import React from 'react';

export default function RecommendationPanel({ recommendation }) {
  const { priority, recommendedGate, message, tips } = recommendation;
  
  const isUrgent = priority === 'urgent';
  
  const containerClass = isUrgent 
    ? "bg-red-50/80 border-red-200 text-red-900 shadow-lg shadow-red-500/10 border-t-4 border-t-red-500"
    : "bg-blue-50/80 border-blue-200 text-blue-900 shadow-lg shadow-blue-500/10 border-t-4 border-t-blue-500";
    
  const badgeClass = isUrgent
    ? "bg-red-100 text-red-800 border-red-200 shadow-sm"
    : "bg-blue-100 text-blue-800 border-blue-200 shadow-sm";

  return (
    <div className={`p-6 rounded-2xl border ${containerClass} transition-all duration-300 h-full flex flex-col`}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold flex items-center gap-2 tracking-tight">
          {isUrgent ? (
            <svg className="w-6 h-6 text-red-600 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
          ) : (
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
          )}
          Recommendation
        </h2>
        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${badgeClass}`}>
          {priority}
        </span>
      </div>
      
      {recommendedGate && (
        <div className="mb-6 bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-white shadow-sm flex flex-col items-center justify-center text-center">
          <p className="text-xs uppercase tracking-widest font-bold opacity-70 mb-1">Target Gate</p>
          <p className="text-4xl font-black tracking-tight">{recommendedGate.replace('gate', 'Gate ')}</p>
        </div>
      )}

      <div className="mb-6 flex-grow">
        <p className="text-lg font-medium leading-relaxed">{message}</p>
      </div>

      {tips && tips.length > 0 && (
        <div className="bg-white/60 p-5 rounded-xl shadow-sm border border-white/50">
          <h3 className="font-bold text-sm uppercase tracking-wider mb-4 opacity-80 flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
            Actionable Tips
          </h3>
          <ul className="space-y-3">
            {tips.map((tip, index) => (
              <li key={index} className="flex items-start text-sm font-medium">
                <svg className={`w-5 h-5 mr-2 flex-shrink-0 ${isUrgent ? 'text-red-500' : 'text-blue-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                <span className="mt-0.5">{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
