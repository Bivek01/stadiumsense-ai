import React, { useState, useMemo, Suspense, lazy } from 'react';
import ContextSimulator from './components/ContextSimulator';
import RecommendationPanel from './components/RecommendationPanel';
const ChatAssistant = lazy(() => import('./components/ChatAssistant'));
import ErrorBoundary from './components/ErrorBoundary';
import { getRecommendations } from './engine/decisionEngine';
import { normalContext } from './data/mockContext';

function App() {
  // Application State
  const [context, setContext] = useState(normalContext);
  
  // Calculate recommendation purely based on context changes
  const recommendation = useMemo(() => getRecommendations(context), [context]);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-12">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex flex-col">
              <span className="text-xl font-bold text-slate-900 tracking-tight">StadiumSense AI</span>
              <span className="text-[10px] text-blue-600 font-bold uppercase tracking-widest mt-0.5">Smart Fan Assistant — Tournament Ops</span>
            </div>
          </div>
        </div>
      </nav>
      
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        <header className="mb-8">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">Live Routing Dashboard</h1>
          <p className="text-slate-600 max-w-2xl text-lg">
            Adjust the parameters below to simulate different game-day scenarios. The decision engine will calculate the optimal route and instructions in real-time.
          </p>
        </header>

        <ErrorBoundary>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column: Controls */}
            <div className="lg:col-span-8">
              <ContextSimulator context={context} setContext={setContext} />
            </div>
            
            {/* Right Column: Output */}
            <div className="lg:col-span-4 flex flex-col gap-6">
              <RecommendationPanel recommendation={recommendation} />
              <Suspense fallback={<div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 text-slate-500 flex justify-center items-center h-[500px]">Loading assistant...</div>}>
                <ChatAssistant context={context} recommendation={recommendation} />
              </Suspense>
            </div>
          </div>
        </ErrorBoundary>
        
      </main>
    </div>
  );
}

export default App;
