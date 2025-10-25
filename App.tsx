// Fix: Added full content for App.tsx to create the main application logic.
import React, { useState, useEffect } from 'react';
import { GoogleGenAI, Type } from '@google/genai';
import LoginPage from './components/LoginPage';
import SurveyPage from './components/SurveyPage';
import ResultsPage from './components/ResultsPage';
import Header from './components/Header';
import { Answers, AssessmentResult, CATEGORIES, Question, OrganizationType } from './types';
import { QUESTIONS } from './constants';

type Page = 'login' | 'survey' | 'loading' | 'results' | 'error';

const LOADING_MESSAGES = [
    "Initializing analysis...",
    "Evaluating your data governance...",
    "Assessing infrastructure readiness...",
    "Analyzing workflow integration...",
    "Checking compliance and security...",
    "Compiling actionable recommendations...",
    "Finalizing your report..."
];

const App: React.FC = () => {
  const [page, setPage] = useState<Page>('login');
  const [userInfo, setUserInfo] = useState<{ email: string; organization: string; orgType: OrganizationType } | null>(null);
  const [assessmentResult, setAssessmentResult] = useState<AssessmentResult | null>(null);
  const [previousResult, setPreviousResult] = useState<AssessmentResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loadingMessage, setLoadingMessage] = useState(LOADING_MESSAGES[0]);

  useEffect(() => {
      try {
        const storedResult = localStorage.getItem('previousMaturityMapResult');
        if (storedResult) {
            setPreviousResult(JSON.parse(storedResult));
        }
      } catch (e) {
        console.error("Could not parse previous result from localStorage", e);
      }

    let interval: ReturnType<typeof setInterval> | null = null;
    if (page === 'loading') {
      let index = 0;
      interval = setInterval(() => {
        index = (index + 1) % LOADING_MESSAGES.length;
        setLoadingMessage(LOADING_MESSAGES[index]);
      }, 2000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [page]);

  const handleLogin = (email: string, organization: string, orgType: OrganizationType) => {
    setUserInfo({ email, organization, orgType });
    setPage('survey');
  };

  const generatePrompt = (answers: Answers): string => {
    let prompt = `As an expert in AI adoption for the healthcare industry, please analyze the following AI maturity assessment answers for a healthcare organization.
    The organization identifies as: ${userInfo?.orgType}.
    The answers are based on a questionnaire. The available answers for each question vary.

    Here are the answers provided by the user:\n\n`;

    QUESTIONS.forEach((q: Question) => {
      const answer = answers[q.id];
      prompt += `- Category: ${q.category}\n`;
      prompt += `  Question: ${q.text}\n`;
      prompt += `  Answer: ${answer}\n\n`;
    });

    prompt += `Based on these answers, provide a comprehensive AI maturity assessment. The output must be a JSON object that strictly adheres to the provided schema.
    Calculate a numerical score (0-100) for each of the ${CATEGORIES.length} categories and an overall maturity score (0-100).
    A score of 100 represents the highest level of maturity.
    Provide a brief, insightful summary for the overall score and for each category score.
    Finally, provide a list of 3-5 actionable recommendations prioritized by High, Medium, or Low, to help the healthcare organization advance its AI maturity. The recommendations should be specific and practical for a healthcare context.`;

    return prompt;
  }

  const handleSurveySubmit = async (answers: Answers) => {
    setPage('loading');
    setError(null);

    // Save current results as previous before fetching new ones
    if (assessmentResult) {
        try {
            localStorage.setItem('previousMaturityMapResult', JSON.stringify(assessmentResult));
            setPreviousResult(assessmentResult);
        } catch (e) {
            console.error("Could not save result to localStorage", e);
        }
    }

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

      const prompt = generatePrompt(answers);

      const responseSchema = {
        type: Type.OBJECT,
        properties: {
          overallScore: { type: Type.NUMBER, description: "Overall score from 0 to 100." },
          summary: { type: Type.STRING, description: "A brief summary of the overall assessment." },
          categoryScores: {
            type: Type.ARRAY,
            description: "An array of scores for each category.",
            items: {
              type: Type.OBJECT,
              properties: {
                category: { type: Type.STRING, enum: CATEGORIES, description: "The AI maturity category." },
                score: { type: Type.NUMBER, description: "The score for this category from 0 to 100." },
                summary: { type: Type.STRING, description: "A brief summary for this category's score." }
              },
              required: ["category", "score", "summary"],
            }
          },
          recommendations: {
            type: Type.ARRAY,
            description: "A list of actionable recommendations.",
            items: {
              type: Type.OBJECT,
              properties: {
                priority: { type: Type.STRING, enum: ["High", "Medium", "Low"], description: "Priority of the recommendation." },
                description: { type: Type.STRING, description: "The detailed recommendation text." }
              },
              required: ["priority", "description"],
            }
          }
        },
        required: ["overallScore", "summary", "categoryScores", "recommendations"],
      };

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-pro',
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: responseSchema,
        },
      });

      let resultText = response.text.trim();
      // Clean up potential markdown code fences from the response
      if (resultText.startsWith('```json')) {
        resultText = resultText.slice(7, -3).trim();
      } else if (resultText.startsWith('```')) {
        resultText = resultText.slice(3, -3).trim();
      }
      
      const resultJson = JSON.parse(resultText);
      setAssessmentResult(resultJson);
      setPage('results');

    } catch (e) {
      console.error(e);
      setError('An error occurred while analyzing your results. Please try again.');
      setPage('error');
    }
  };

  const handleStartOver = () => {
    setUserInfo(null);
    setAssessmentResult(null);
    // We keep previousResult to allow for re-logging in and seeing history
    setError(null);
    setPage('login');
  };
  
  const renderPage = () => {
    switch (page) {
      case 'login':
        return <LoginPage onLogin={handleLogin} />;
      case 'survey':
        return <SurveyPage onSubmit={handleSurveySubmit} />;
      case 'loading':
        return (
          <div className="flex flex-col items-center justify-center text-center p-8 bg-white border border-slate-200 rounded-xl shadow-lg">
            <h2 className="text-2xl font-semibold text-slate-800 mb-4">Analyzing Your Results...</h2>
            <p className="text-slate-600 mb-6 transition-opacity duration-500">{loadingMessage}</p>
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600"></div>
          </div>
        );
      case 'results':
        if (assessmentResult && userInfo) {
          return <ResultsPage results={assessmentResult} previousResult={previousResult} orgType={userInfo.orgType} organization={userInfo.organization} onStartOver={handleStartOver} />;
        }
        setError("Something went wrong displaying the results.");
        return renderErrorPage();
      case 'error':
        return renderErrorPage();
      default:
        return <LoginPage onLogin={handleLogin} />;
    }
  };

  const renderErrorPage = () => (
    <div className="text-center p-8 bg-red-50 border border-red-200 rounded-xl shadow-lg">
      <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
        <svg className="h-6 w-6 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>
      <h2 className="text-2xl font-semibold text-red-800 mb-4">Oops! An Error Occurred</h2>
      <p className="text-red-700 mb-6">{error || 'An unknown error occurred. Please try again from the beginning.'}</p>
      <button
        onClick={handleStartOver}
        className="py-2 px-5 rounded-lg text-white font-semibold bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-600"
      >
        Start Over
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 antialiased flex flex-col">
        <Header userInfo={userInfo} onStartOver={handleStartOver} />
        <main className="container mx-auto px-4 py-8 sm:py-12 flex-grow flex flex-col items-center justify-center">
          {page === 'login' && !userInfo && (
             <div className="w-full text-center mb-10">
                <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-800">
                    Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">MaturityMap</span>
                </h1>
                <p className="mt-4 max-w-2xl mx-auto text-lg text-slate-600">
                    Benchmark your AI readiness and get a strategic roadmap for intelligent healthcare.
                </p>
            </div>
          )}
            {renderPage()}
        </main>
        <footer className="text-center py-6 text-sm text-slate-500">
            <p>&copy; {new Date().getFullYear()} MaturityMap.</p>
        </footer>
    </div>
  );
};

export default App;