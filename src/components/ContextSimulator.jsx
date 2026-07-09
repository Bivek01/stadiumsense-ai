import React, { useState, useEffect } from 'react';
import { TICKET_TYPES, WEATHER_CONDITIONS, SPECIAL_NEEDS, ZONES, CROWD_DENSITIES, GATES } from '../data/constants';

/**
 * Renders the simulation control panel for updating fan context.
 * 
 * @param {Object} props
 * @param {Object} props.context - The current fan context state.
 * @param {Function} props.setContext - State setter function for the context.
 * @returns {JSX.Element}
 */
function ContextSimulator({ context, setContext }) {
  const [localMinutes, setLocalMinutes] = useState(context.minutesToMatch);

  useEffect(() => {
    setLocalMinutes(context.minutesToMatch);
  }, [context.minutesToMatch]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (localMinutes !== context.minutesToMatch) {
        setContext(prev => ({ ...prev, minutesToMatch: localMinutes }));
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [localMinutes, context.minutesToMatch, setContext]);
  const handleChange = (field, value) => {
    setContext(prev => ({ ...prev, [field]: value }));
  };

  const handleCrowdChange = (gate, value) => {
    setContext(prev => ({
      ...prev,
      crowdByZone: {
        ...prev.crowdByZone,
        [gate]: value
      }
    }));
  };

  const selectClass = "mt-1 block w-full rounded-xl border-slate-300 py-2.5 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm bg-white border shadow-sm transition-colors";
  const labelClass = "block text-sm font-semibold text-slate-700 mb-1";

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg shadow-slate-200/50 border border-slate-200 border-t-4 border-t-indigo-500">
      <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
        <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg>
        Simulation Parameters
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Environmental & Fan Data */}
        <div className="space-y-5">
          <div>
            <label htmlFor="ticketType" className={labelClass}>Ticket Type</label>
            <select id="ticketType" className={selectClass} value={context.ticketType} onChange={e => handleChange('ticketType', e.target.value)}>
              <option value={TICKET_TYPES.GENERAL}>General</option>
              <option value={TICKET_TYPES.VIP}>VIP</option>
              <option value={TICKET_TYPES.STUDENT}>Student</option>
            </select>
          </div>

          <div>
            <label htmlFor="minutesToMatch" className={labelClass}>
              Minutes to Match: <span className="text-blue-600 font-bold ml-1">{context.minutesToMatch} min</span>
            </label>
            <input 
              type="range" 
              id="minutesToMatch" 
              min="0" max="120" 
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600 mt-3" 
              value={localMinutes} 
              onChange={e => setLocalMinutes(parseInt(e.target.value, 10))}
            />
            <div className="flex justify-between text-xs text-slate-400 mt-1 font-medium">
              <span>0m (Kickoff)</span>
              <span>120m</span>
            </div>
          </div>

          <div>
            <label htmlFor="weather" className={labelClass}>Weather Condition</label>
            <select id="weather" className={selectClass} value={context.weather} onChange={e => handleChange('weather', e.target.value)}>
              <option value={WEATHER_CONDITIONS.CLEAR}>Clear</option>
              <option value={WEATHER_CONDITIONS.RAIN}>Rain</option>
              <option value={WEATHER_CONDITIONS.EXTREME_HEAT}>Extreme Heat</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="currentZone" className={labelClass}>Current Location (Zone)</label>
            <select id="currentZone" className={selectClass} value={context.currentZone} onChange={e => handleChange('currentZone', e.target.value)}>
              <option value={ZONES.PARKING_NORTH}>North Parking</option>
              <option value={ZONES.TRANSIT_STATION}>Transit Station</option>
              <option value={ZONES.GATE_C_PLAZA}>Gate C Plaza</option>
              <option value={ZONES.FOOD_COURT}>Food Court</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="specialNeed" className={labelClass}>Special Needs</label>
            <select id="specialNeed" className={selectClass} value={context.specialNeed} onChange={e => handleChange('specialNeed', e.target.value)}>
              <option value={SPECIAL_NEEDS.NONE}>None</option>
              <option value={SPECIAL_NEEDS.MEDICAL}>Medical Emergency</option>
              <option value={SPECIAL_NEEDS.MOBILITY}>Mobility Assistance</option>
              <option value={SPECIAL_NEEDS.LOST_CHILD}>Lost Child</option>
            </select>
          </div>
        </div>

        {/* Live Crowd Densities */}
        <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
          <div className="flex items-center gap-2 mb-4">
            <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
            <h3 className="text-lg font-bold text-slate-900 tracking-tight">Live Crowd Densities</h3>
          </div>
          <p className="text-sm text-slate-500 mb-5">Simulate the congestion at each of the stadium entry gates.</p>
          
          <div className="space-y-4">
            {[GATES.GATE_A, GATES.GATE_B, GATES.GATE_C, GATES.GATE_D].map(gate => (
              <div key={gate}>
                <label htmlFor={gate} className="block text-sm font-semibold text-slate-700 mb-1">{gate.replace('gate', 'Gate ')}</label>
                <select 
                  id={gate} 
                  className={selectClass} 
                  value={context.crowdByZone[gate]} 
                  onChange={e => handleCrowdChange(gate, e.target.value)}
                >
                  <option value={CROWD_DENSITIES.LOW}>Low (Smooth Entry)</option>
                  <option value={CROWD_DENSITIES.MEDIUM}>Medium (Moderate Wait)</option>
                  <option value={CROWD_DENSITIES.HIGH}>High (Heavy Congestion)</option>
                </select>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default React.memo(ContextSimulator);
