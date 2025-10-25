import React, { useState } from 'react';
import { QUESTIONS, CATEGORY_DESCRIPTIONS } from '../constants';
import { Answers, AnswerValue, CATEGORIES, Category } from '../types';

const CategoryStepper: React.FC<{ currentCategory: Category }> = ({ currentCategory }) => {
    const currentCategoryIndex = CATEGORIES.indexOf(currentCategory);

    return (
        <nav aria-label="Progress">
            <ol role="list" className="flex items-center">
                {CATEGORIES.map((category, categoryIdx) => (
                    <li key={category} className={`relative ${categoryIdx !== CATEGORIES.length - 1 ? 'flex-1' : ''}`}>
                        <>
                            {categoryIdx < currentCategoryIndex ? (
                                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                                    <div className="h-0.5 w-full bg-indigo-600" />
                                </div>
                            ) : categoryIdx === currentCategoryIndex ? (
                                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                                    <div className="h-0.5 w-full bg-gray-200" />
                                    <div className="h-0.5 w-1/2 bg-indigo-600" />
                                </div>
                            ) : (
                                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                                    <div className="h-0.5 w-full bg-gray-200" />
                                </div>
                            )}
                            
                            <div className="relative flex h-8 w-8 items-center justify-center rounded-full">
                                {categoryIdx < currentCategoryIndex ? (
                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 hover:bg-indigo-900">
                                        <svg className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                            <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.052-.143z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                ) : categoryIdx === currentCategoryIndex ? (
                                    <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-indigo-600 bg-white" aria-current="step">
                                        <span className="h-2.5 w-2.5 rounded-full bg-indigo-600" />
                                    </div>
                                ) : (
                                    <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-gray-300 bg-white hover:border-gray-400">
                                        <span className="h-2.5 w-2.5 rounded-full bg-transparent" />
                                    </div>
                                )}
                                 <span className="absolute top-10 left-1/2 -translate-x-1/2 w-20 text-xs text-center text-slate-500">{category}</span>
                            </div>
                        </>
                    </li>
                ))}
            </ol>
        </nav>
    );
};

const SurveyPage: React.FC<{ onSubmit: (answers: Answers) => void }> = ({ onSubmit }) => {
  const [answers, setAnswers] = useState<Answers>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const totalQuestions = QUESTIONS.length;
  const progress = ((currentQuestionIndex) / totalQuestions) * 100;
  const currentQuestion = QUESTIONS[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === totalQuestions - 1;

  const navigate = (direction: 'next' | 'prev') => {
    if (isTransitioning) return;
    
    setIsTransitioning(true);
    setTimeout(() => {
      if (direction === 'next' && !isLastQuestion) {
        setCurrentQuestionIndex(i => i + 1);
      } else if (direction === 'prev' && currentQuestionIndex > 0) {
        setCurrentQuestionIndex(i => i - 1);
      }
      setIsTransitioning(false);
    }, 150); // Match this with transition duration
  };
  
  const handleAnswer = (questionId: number, value: AnswerValue) => {
    const newAnswers = { ...answers, [questionId]: value };
    setAnswers(newAnswers);

    // Auto-navigate for all but the last question. The user must explicitly click the final button.
    if (!isLastQuestion) {
      setTimeout(() => navigate('next'), 150);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (Object.keys(answers).length === totalQuestions) {
        onSubmit(answers);
    }
  };

  return (
    <div className="bg-white border border-slate-200 p-6 sm:p-8 rounded-xl shadow-lg max-w-4xl mx-auto w-full">
      <div className="mb-16 pt-8">
        <CategoryStepper currentCategory={currentQuestion.category} />
      </div>

      <div className="text-center mb-8">
          <h2 className="text-xl font-semibold text-slate-900">Category: {currentQuestion.category}</h2>
          <p className="text-slate-500 mt-1 max-w-2xl mx-auto">{CATEGORY_DESCRIPTIONS[currentQuestion.category]}</p>
      </div>
      
       <div className="w-full bg-slate-200 rounded-full h-2.5 mb-8 max-w-lg mx-auto">
          <div className="bg-indigo-600 h-2.5 rounded-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
        </div>

      <form onSubmit={handleSubmit}>
        <div className={`min-h-[150px] transition-opacity duration-150 text-center ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
            <div className="font-semibold text-xl text-slate-800 mb-6 flex items-center justify-center gap-2">
                <span>{currentQuestionIndex + 1}. {currentQuestion.text}</span>
                {currentQuestion.elaboration && (
                    <div className="relative group cursor-help">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-400 hover:text-slate-600 transition-colors" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-72 p-3 bg-slate-800 text-white text-sm font-normal rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10 text-left normal-case tracking-normal">
                            {currentQuestion.elaboration}
                            <svg className="absolute text-slate-800 h-2 w-full left-0 top-full" x="0px" y="0px" viewBox="0 0 255 255">
                                <polygon className="fill-current" points="0,0 127.5,127.5 255,0"/>
                            </svg>
                        </div>
                    </div>
                )}
            </div>
            <div className={`mx-auto max-w-lg grid grid-cols-1 ${currentQuestion.options.length === 2 ? 'sm:grid-cols-2' : 'sm:grid-cols-3'} gap-3`}>
              {currentQuestion.options.map(option => (
                option && (
                  <button
                    key={option}
                    type="button"
                    onClick={() => handleAnswer(currentQuestion.id, option)}
                    className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-base font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white
                      ${answers[currentQuestion.id] === option 
                        ? 'bg-indigo-600 text-white shadow-md border-indigo-700 focus:ring-indigo-500' 
                        : 'bg-white text-slate-700 hover:bg-slate-100 border-slate-300 border focus:ring-indigo-500'
                      }`}
                  >
                     {answers[currentQuestion.id] === option && (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                           <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                    )}
                    {option}
                  </button>
                )
              ))}
            </div>
        </div>
       
        <div className="pt-8 mt-8 border-t border-slate-200 flex justify-between items-center">
          <button
            type="button"
            onClick={() => navigate('prev')}
            disabled={currentQuestionIndex === 0 || isTransitioning}
            className="py-2 px-5 rounded-lg font-semibold transition-all duration-300 
              disabled:opacity-50 disabled:cursor-not-allowed
              bg-white text-slate-700 hover:bg-slate-100 border-slate-300 border focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Back
          </button>

          {isLastQuestion ? (
              <button
                type="submit"
                disabled={Object.keys(answers).length !== totalQuestions || isTransitioning}
                className="py-2 px-5 rounded-lg text-white font-semibold shadow-md transition-all duration-300 
                  disabled:bg-slate-300 disabled:cursor-not-allowed disabled:text-slate-500
                  bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Calculate My Score
              </button>
          ) : (
             <button
                type="button"
                onClick={() => navigate('next')}
                disabled={!answers[currentQuestion.id] || isTransitioning}
                className="py-2 px-5 rounded-lg text-white font-semibold shadow-md transition-all duration-300 
                  disabled:bg-slate-300 disabled:cursor-not-allowed disabled:text-slate-500
                  bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Next
              </button>
          )}

        </div>
      </form>
    </div>
  );
};

export default SurveyPage;