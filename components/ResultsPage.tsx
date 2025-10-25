import React, { useState } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { AssessmentResult, CategoryScore, OrganizationType, Category, CATEGORIES } from '../types';
import GaugeChart from './GaugeChart';
import RadarChart from './RadarChart';
import BarChart from './BarChart';
import DonutChart from './DonutChart';
import Chatbot from './Chatbot'; // Import the new Chatbot component

// --- Reusable RecommendationCard Component ---
const RecommendationCard: React.FC<{ recommendation: AssessmentResult['recommendations'][0], isPdf?: boolean }> = ({ recommendation, isPdf = false }) => {
    const [isOpen, setIsOpen] = useState(isPdf); // Always open for PDF
    
    const getFirstSteps = (desc: string): string[] => {
        if (desc.toLowerCase().includes('governance')) return ["Form a cross-departmental AI ethics committee.", "Draft an initial charter defining roles and responsibilities.", "Establish a process for reviewing new AI projects."];
        if (desc.toLowerCase().includes('training') || desc.toLowerCase().includes('literacy')) return ["Identify key roles that require AI upskilling.", "Curate a list of introductory AI resources and courses.", "Schedule a pilot 'AI in Healthcare' workshop."];
        if (desc.toLowerCase().includes('data')) return ["Conduct an audit of current data sources and quality.", "Define a pilot project and identify its specific data needs.", "Develop a data sanitization and anonymization protocol."];
        return ["Define the primary objective for this recommendation.", "Assign an owner or a small team to lead the initiative.", "Set a timeline with a 30-day check-in milestone."];
    }
    const firstSteps = getFirstSteps(recommendation.description);

    const getPriorityClasses = (priority: 'High' | 'Medium' | 'Low') => {
        switch (priority) {
          case 'High': return { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200', ring: 'focus:ring-red-500' };
          case 'Medium': return { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', ring: 'focus:ring-amber-500' };
          default: return { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200', ring: 'focus:ring-green-500' };
        }
    }
    const classes = getPriorityClasses(recommendation.priority);
  
    return (
        <div className={`rounded-lg border ${classes.bg} ${classes.border} pdf-avoid-break`}>
            <div className={`p-4 flex items-start gap-4`}>
                <div className="flex-shrink-0 mt-0.5">
                    <span className={`font-bold text-sm ${classes.text}`}>{recommendation.priority.toUpperCase()}</span>
                </div>
                <div className="flex-1">
                    <p className={`text-slate-800`}>{recommendation.description}</p>
                </div>
                {!isPdf && (
                    <button onClick={() => setIsOpen(!isOpen)} className={`ml-4 flex-shrink-0 p-1 rounded-full hover:bg-black/5 focus:outline-none focus:ring-2 ${classes.ring}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 text-slate-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                    </button>
                )}
            </div>
            {isOpen && (
                <div className="px-4 pb-4 ml-14 border-t border-black/10">
                    <h4 className="font-semibold text-sm text-slate-700 mt-3 mb-2">First Steps</h4>
                    <ul className="list-disc pl-5 space-y-1 text-sm text-slate-600">
                        {firstSteps.map((step, i) => <li key={i}>{step}</li>)}
                    </ul>
                </div>
            )}
        </div>
    );
};

// --- MOCK BENCHMARK DATA ---
const getBenchmarkData = (orgType: OrganizationType): { overallScore: number; categoryScores: CategoryScore[] } => {
    let baseScore = 55;
    if (orgType.includes('Large Hospital')) baseScore = 68; if (orgType.includes('Research')) baseScore = 75; if (orgType.includes('Community')) baseScore = 45;
    const categoryScores = (Object.values(CATEGORIES) as Category[]).map(cat => {
        const hash = cat.split('').reduce((acc, char) => char.charCodeAt(0) + ((acc << 5) - acc), 0);
        const score = (baseScore + (hash % 25) - 12);
        return { category: cat, score: Math.max(20, Math.min(95, score)), summary: '' };
    });
    return { overallScore: Math.round(categoryScores.reduce((acc, cs) => acc + cs.score, 0) / categoryScores.length), categoryScores };
};

// --- MATURITY LEVEL INFO ---
const getMaturityLevelInfo = (score: number) => {
    if (score <= 25) return { level: 'Nascent', description: 'Your organization is in the early stages of exploring AI, with limited awareness and ad-hoc activities. The focus should be on building foundational knowledge and identifying potential use cases.', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15.5 15.5l-1.5-1.5M17.5 9.5a1.5 1.5 0 01-3 0m-3.5-2a1.5 1.5 0 01-3 0M10 17l-1.5 1.5m-3-3l-1.5 1.5M4.5 9.5a1.5 1.5 0 01-3 0m11 11a1.5 1.5 0 010-3m-8.5-3.5a1.5 1.5 0 010-3m14 3a1.5 1.5 0 010-3" /></svg>, colors: { bg: 'bg-slate-100', text: 'text-slate-800', icon: 'text-slate-500', border: 'border-slate-200' } };
    if (score <= 50) return { level: 'Developing', description: 'Foundational AI elements are being put in place, but efforts may be siloed. The key is to develop a cohesive strategy and formalize governance to guide future initiatives.', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>, colors: { bg: 'bg-blue-50', text: 'text-blue-800', icon: 'text-blue-500', border: 'border-blue-200' } };
    if (score <= 75) return { level: 'Strategic', description: 'AI is a strategic priority with defined governance and growing integration. The goal is to scale successful pilots, optimize workflows, and foster a data-driven culture across the organization.', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>, colors: { bg: 'bg-indigo-50', text: 'text-indigo-800', icon: 'text-indigo-500', border: 'border-indigo-200' } };
    return { level: 'Transformational', description: 'AI is deeply embedded in operations and culture, driving significant innovation. The focus is on leveraging AI for competitive advantage and shaping the future of healthcare delivery.', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>, colors: { bg: 'bg-purple-50', text: 'text-purple-800', icon: 'text-purple-500', border: 'border-purple-200' } };
};

// --- DEDICATED PDF LAYOUT COMPONENT ---
const PdfReportLayout: React.FC<ResultsPageProps> = ({ results, previousResult, orgType, organization }) => {
    const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    const maturityLevelInfo = getMaturityLevelInfo(results.overallScore);
    const benchmarkData = getBenchmarkData(orgType);
    const scoreDiff = previousResult ? results.overallScore - previousResult.overallScore : null;

    return (
        <div id="pdf-layout-container" className="font-sans text-slate-900" style={{ width: '210mm' }}>
            {/* Page 1: Cover Page */}
            <div className="pdf-page w-full h-[297mm] flex flex-col justify-center items-center text-center p-8 bg-white">
                <h1 className="text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">MaturityMap</h1>
                <h2 className="mt-4 text-3xl font-bold text-slate-800">AI Maturity Assessment Report</h2>
                <div className="mt-24 text-lg text-slate-600 space-y-2">
                    <p>Prepared for:</p>
                    <p className="font-bold text-2xl text-slate-900">{organization}</p>
                </div>
                 <p className="mt-8 text-lg text-slate-600">Organization Type: <span className="font-semibold">{orgType}</span></p>
                <p className="mt-2 text-lg text-slate-600">Date: <span className="font-semibold">{today}</span></p>
                <p className="absolute bottom-10 text-sm text-slate-500">&copy; {new Date().getFullYear()} MaturityMap.</p>
            </div>
            
            {/* Page 2: Executive Summary */}
            <div className="pdf-page w-full h-[297mm] p-12 bg-white flex flex-col">
                <h2 className="text-3xl font-bold text-slate-800 border-b-2 border-slate-200 pb-3 mb-8">Executive Summary</h2>
                {previousResult && scoreDiff !== null && (
                     <div className="mb-8">
                       <h3 className="text-xl font-bold text-slate-800 mb-4">Progress Snapshot</h3>
                       <div className="p-4 rounded-lg border bg-slate-50 border-slate-200 flex items-center justify-between">
                           <div><p className="text-sm text-slate-600">Previous Score</p><p className="text-2xl font-bold text-slate-500">{previousResult.overallScore}</p></div>
                           <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                           <div><p className="text-sm text-slate-600">Current Score</p><p className="text-2xl font-bold text-indigo-600">{results.overallScore}</p></div>
                           <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-sm font-semibold ${scoreDiff >= 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{scoreDiff > 0 ? '▲' : scoreDiff < 0 ? '▼' : ''} {scoreDiff >= 0 ? `+${scoreDiff}` : scoreDiff} pts</div>
                       </div>
                    </div>
                )}
                <div className="mb-8 flex flex-row items-center gap-8">
                    <div className="w-[280px] flex-shrink-0"><GaugeChart score={results.overallScore} benchmarkScore={benchmarkData.overallScore} /></div>
                    <div><h3 className="text-xl font-bold text-slate-800 mb-2">Overall Assessment</h3><p className="text-slate-600 leading-relaxed">{results.summary}</p></div>
                </div>
                <div className={`p-6 rounded-lg border flex items-start gap-6 ${maturityLevelInfo.colors.bg} ${maturityLevelInfo.colors.border}`}>
                    <div className={`flex-shrink-0 ${maturityLevelInfo.colors.icon}`}>{maturityLevelInfo.icon}</div>
                    <div><h3 className={`text-xl font-bold ${maturityLevelInfo.colors.text}`}>Your Maturity Level: {maturityLevelInfo.level}</h3><p className="mt-1 text-slate-700 leading-relaxed text-sm">{maturityLevelInfo.description}</p></div>
                </div>
                <div className="flex-grow"></div>
            </div>

            {/* Page 3: Action Plan */}
            <div className="pdf-page w-full h-[297mm] p-12 bg-white flex flex-col">
                 <h2 className="text-3xl font-bold text-slate-800 border-b-2 border-slate-200 pb-3 mb-8">Strategic Action Plan</h2>
                 <p className="text-slate-600 mb-6">Your prioritized roadmap to advancing AI maturity. Recommendations are expanded to show actionable first steps.</p>
                 <div className="space-y-4">
                    {results.recommendations.map((rec, index) => (<RecommendationCard key={index} recommendation={rec} isPdf={true} />))}
                 </div>
                 <div className="flex-grow"></div>
            </div>
            
            {/* Page 4: Deep Dive */}
             <div className="pdf-page w-full h-[297mm] p-12 bg-white flex flex-col">
                 <h2 className="text-3xl font-bold text-slate-800 border-b-2 border-slate-200 pb-3 mb-8">Deep-Dive Analysis</h2>
                 <div className="mb-12">
                     <h3 className="text-xl font-bold text-slate-800">Maturity Breakdown vs. Peers</h3>
                     <p className="text-slate-600 mt-2 mb-6">Your performance across key dimensions compared to similar organizations ({orgType}).</p>
                     <BarChart scores={results.categoryScores} benchmarkScores={benchmarkData.categoryScores} />
                 </div>
                 <div>
                     <h3 className="text-xl font-bold text-slate-800">Visual Maturity Profile</h3>
                     <p className="text-slate-600 mt-2 mb-6">A holistic view of your organization's AI capabilities across all assessed categories.</p>
                     <RadarChart scores={results.categoryScores} />
                 </div>
                 <div className="flex-grow"></div>
             </div>

            {/* Page 5: Category Summaries Part 1 */}
            <div className="pdf-page w-full h-[297mm] p-12 bg-white flex flex-col">
                <h2 className="text-3xl font-bold text-slate-800 border-b-2 border-slate-200 pb-3 mb-8">Category Summaries</h2>
                <div className="space-y-4">
                    {results.categoryScores.slice(0, 5).map(item => (
                        <div key={item.category} className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                            <h4 className="font-semibold text-slate-800">{item.category} - <span className="text-indigo-600 font-bold">{item.score}/100</span></h4>
                            <p className="text-sm text-slate-600 mt-1">{item.summary}</p>
                        </div>
                    ))}
                </div>
                 <div className="flex-grow"></div>
            </div>
            
             {/* Page 6: Category Summaries Part 2 */}
            <div className="pdf-page w-full h-[297mm] p-12 bg-white flex flex-col">
                <h2 className="text-3xl font-bold text-slate-800 border-b-2 border-slate-200 pb-3 mb-8">Category Summaries (cont.)</h2>
                <div className="space-y-4">
                    {results.categoryScores.slice(5).map(item => (
                        <div key={item.category} className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                            <h4 className="font-semibold text-slate-800">{item.category} - <span className="text-indigo-600 font-bold">{item.score}/100</span></h4>
                            <p className="text-sm text-slate-600 mt-1">{item.summary}</p>
                        </div>
                    ))}
                </div>
                 <div className="flex-grow"></div>
            </div>
        </div>
    );
};


// --- MAIN WEB VIEW COMPONENT ---
interface ResultsPageProps {
  results: AssessmentResult;
  previousResult: AssessmentResult | null;
  orgType: OrganizationType;
  organization: string;
  onStartOver: () => void;
}

const ResultsPage: React.FC<ResultsPageProps> = (props) => {
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const { results, previousResult, orgType, organization, onStartOver } = props;
  const benchmarkData = getBenchmarkData(orgType);
  const maturityLevelInfo = getMaturityLevelInfo(results.overallScore);
  const scoreDiff = previousResult ? results.overallScore - previousResult.overallScore : null;

  const handleDownloadPdf = async () => {
    setIsGeneratingPdf(true);
    await new Promise(resolve => setTimeout(resolve, 500)); // Allow render time

    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const pageElements = document.querySelectorAll<HTMLElement>('#pdf-layout-container .pdf-page');

    try {
        for (let i = 0; i < pageElements.length; i++) {
            const pageElement = pageElements[i];
            if (i > 0) pdf.addPage();
            
            const canvas = await html2canvas(pageElement, {
                scale: 2,
                useCORS: true,
            });
            
            const imgData = canvas.toDataURL('image/png');
            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight, undefined, 'FAST');

            if (i > 0) {
                pdf.setFontSize(9);
                pdf.setTextColor(128);
                pdf.text('MaturityMap Assessment Report', 15, 12);
                pdf.text(organization, pdfWidth - 15, 12, { align: 'right' });
                const footerText = `Page ${i + 1} of ${pageElements.length}`;
                pdf.text(footerText, pdfWidth / 2, pdfHeight - 10, { align: 'center' });
            }
        }
      pdf.save(`MaturityMap_Report_${organization.replace(/\s/g, '_')}.pdf`);
    } catch (err) {
        console.error("Error generating PDF", err);
        alert("Sorry, we couldn't generate the PDF. Please try again.");
    } finally {
        setIsGeneratingPdf(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <style>{`
        @keyframes pulse-glow {
            0%, 100% {
                box-shadow: 0 0 0 0rem rgba(99, 102, 241, 0.7);
            }
            70% {
                box-shadow: 0 0 0 1.5rem rgba(99, 102, 241, 0);
            }
        }
        .animate-pulse-glow {
            animation: pulse-glow 2.2s infinite;
        }
        .pdf-avoid-break { break-inside: avoid; page-break-inside: avoid; }
      `}</style>
      
      <div className="absolute left-[-9999px] top-auto -z-10"><PdfReportLayout {...props} /></div>

      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
              <h1 className="text-3xl font-bold text-slate-900">Assessment Report</h1>
              <p className="text-lg text-slate-600 mt-1">For <span className="font-semibold text-indigo-600">{organization}</span></p>
          </div>
          <div className="flex items-center gap-4 w-full sm:w-auto">
             <button onClick={onStartOver} className="flex items-center justify-center gap-2 w-full sm:w-auto py-2.5 px-4 rounded-lg text-sm font-semibold transition-all duration-200 bg-white text-slate-700 hover:bg-slate-100 border-slate-300 border focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">New Assessment</button>
             <button onClick={handleDownloadPdf} disabled={isGeneratingPdf} className="flex items-center justify-center gap-2 w-full sm:w-auto py-2.5 px-4 rounded-lg text-sm font-semibold transition-all duration-200 bg-indigo-600 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-wait">
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                 <span>{isGeneratingPdf ? 'Generating...' : 'Download PDF'}</span>
             </button>
          </div>
      </header>
      
      <div className="bg-white rounded-xl border border-slate-200 shadow-lg">
          <div className="grid grid-cols-1 lg:grid-cols-5">
              {/* Main Content */}
              <div className="lg:col-span-3 p-6 sm:p-8 lg:border-r border-b lg:border-b-0 border-slate-200">
                  {previousResult && scoreDiff !== null && (
                      <section className="mb-8">
                           <h2 className="text-2xl font-bold text-slate-800">Progress Snapshot</h2>
                           <div className="mt-4 p-4 rounded-lg border bg-slate-50 border-slate-200 flex items-center justify-between">
                               <div><p className="text-sm text-slate-600">Previous Score</p><p className="text-2xl font-bold text-slate-500">{previousResult.overallScore}</p></div>
                               <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                               <div><p className="text-sm text-slate-600">Current Score</p><p className="text-2xl font-bold text-indigo-600">{results.overallScore}</p></div>
                               <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-sm font-semibold ${scoreDiff >= 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{scoreDiff > 0 ? '▲' : scoreDiff < 0 ? '▼' : ''} {scoreDiff >= 0 ? `+${scoreDiff}` : scoreDiff} pts</div>
                           </div>
                      </section>
                  )}
                  <section>
                    <h2 className="text-2xl font-bold text-slate-800">Overall AI Maturity Score</h2>
                    <div className="mt-6 flex flex-col md:flex-row items-center gap-8 text-center md:text-left">
                      <div className="flex-shrink-0 w-full max-w-[280px] md:max-w-none md:w-auto"><GaugeChart score={results.overallScore} benchmarkScore={benchmarkData.overallScore} /></div>
                      <div><p className="text-slate-600 leading-relaxed max-w-lg">{results.summary}</p></div>
                    </div>
                  </section>
                  <section className="mt-8">
                    <div className={`p-6 rounded-lg border flex items-start gap-6 ${maturityLevelInfo.colors.bg} ${maturityLevelInfo.colors.border}`}>
                      <div className={`flex-shrink-0 ${maturityLevelInfo.colors.icon}`}>{maturityLevelInfo.icon}</div>
                      <div><h3 className={`text-xl font-bold ${maturityLevelInfo.colors.text}`}>Your Maturity Level: {maturityLevelInfo.level}</h3><p className="mt-1 text-slate-700 leading-relaxed text-sm">{maturityLevelInfo.description}</p></div>
                    </div>
                  </section>
                  <div className="border-t border-slate-200 my-8"></div>
                  <section>
                    <div>
                      <h2 className="text-2xl font-bold text-slate-800">Maturity Breakdown vs. Peers</h2>
                      <p className="text-slate-600 mt-2">Your performance across key dimensions compared to similar organizations ({orgType}).</p>
                      <div className="mt-6"><BarChart scores={results.categoryScores} benchmarkScores={benchmarkData.categoryScores} /></div>
                    </div>
                    <div className="mt-8 space-y-4">
                        <h3 className="text-lg font-semibold text-slate-800">Category Summaries</h3>
                        {results.categoryScores.map(item => (
                            <div key={item.category} className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                                <h4 className="font-semibold text-slate-800">{item.category} - <span className="text-indigo-600 font-bold">{item.score}/100</span></h4>
                                <p className="text-sm text-slate-600 mt-1">{item.summary}</p>
                            </div>
                        ))}
                    </div>
                  </section>
              </div>
              {/* Sidebar */}
              <div className="lg:col-span-2 p-6 sm:p-8 bg-slate-50/50 rounded-b-xl lg:rounded-b-none lg:rounded-r-xl">
                  <div className="sticky top-8">
                      <section>
                          <h2 className="text-2xl font-bold text-slate-800">Visual Maturity Profile</h2>
                          <div className="mt-4"><RadarChart scores={results.categoryScores} /></div>
                      </section>
                      <div className="border-t border-slate-200 my-8"></div>
                      <section>
                          <div>
                            <h2 className="text-2xl font-bold text-slate-800">Actionable Recommendations</h2>
                            <p className="text-slate-600 mt-2">Your prioritized roadmap to advancing AI maturity.</p>
                            <div className="mt-6"><DonutChart recommendations={results.recommendations} /></div>
                          </div>
                          <div className="space-y-4 mt-8">
                              {results.recommendations.map((rec, index) => (<RecommendationCard key={index} recommendation={rec} />))}
                          </div>
                      </section>
                  </div>
              </div>
          </div>
      </div>

      {/* Chatbot FAB and Modal */}
      <div className="fixed bottom-6 right-6 z-30 group">
        <button 
          onClick={() => setIsChatOpen(true)}
          className="bg-indigo-600 text-white rounded-full p-4 shadow-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-transform hover:scale-110 animate-pulse-glow"
          aria-label="Ask about your report"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </button>
        <div className="absolute right-full mr-4 top-1/2 -translate-y-1/2 bg-slate-800 text-white text-sm font-semibold py-1.5 px-3 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 ease-in-out whitespace-nowrap transform group-hover:translate-x-0 translate-x-2 pointer-events-none">
            Ask MaturityBot
            <div className="absolute top-1/2 -translate-y-1/2 right-[-4px] w-0 h-0 border-t-4 border-t-transparent border-b-4 border-b-transparent border-l-4 border-l-slate-800"></div>
        </div>
      </div>

      {isChatOpen && (
        <Chatbot 
          results={results} 
          onClose={() => setIsChatOpen(false)} 
        />
      )}
    </div>
  );
};

export default ResultsPage;