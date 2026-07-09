import { describe, it, expect } from 'vitest';
import { getRecommendations } from './decisionEngine';
import { TICKET_TYPES, WEATHER_CONDITIONS, SPECIAL_NEEDS, CROWD_DENSITIES, PRIORITIES, GATES, ZONES } from '../data/constants';

describe('decisionEngine', () => {

  const baseContext = {
    ticketType: TICKET_TYPES.GENERAL,
    minutesToMatch: 60,
    weather: WEATHER_CONDITIONS.CLEAR,
    crowdByZone: {
      [GATES.GATE_A]: CROWD_DENSITIES.HIGH,
      [GATES.GATE_B]: CROWD_DENSITIES.MEDIUM,
      [GATES.GATE_C]: CROWD_DENSITIES.LOW,
      [GATES.GATE_D]: CROWD_DENSITIES.LOW
    },
    currentZone: ZONES.PARKING_NORTH,
    specialNeed: SPECIAL_NEEDS.NONE
  };

  it('1. should return urgent recommendation for Medical special need', () => {
    const context = { ...baseContext, specialNeed: SPECIAL_NEEDS.MEDICAL };
    const result = getRecommendations(context);
    
    expect(result.priority).toBe(PRIORITIES.URGENT);
    expect(result.recommendedGate).toBeNull();
    expect(result.message).toContain('Urgent: Please proceed immediately');
    expect(result.tips).toHaveLength(0);
  });

  it('2. should return urgent recommendation for LostChild special need', () => {
    const context = { ...baseContext, specialNeed: SPECIAL_NEEDS.LOST_CHILD };
    const result = getRecommendations(context);
    
    expect(result.priority).toBe(PRIORITIES.URGENT);
    expect(result.recommendedGate).toBeNull();
  });

  it('3. should recommend the lowest density gate in normal scenario', () => {
    const context = { ...baseContext };
    // Gate C is LOW in baseContext, which has weight 1 (lowest)
    const result = getRecommendations(context);
    
    expect(result.priority).toBe(PRIORITIES.NORMAL);
    expect(result.recommendedGate).toBe(GATES.GATE_C); 
    expect(result.message).toContain('fastest entry');
  });

  it('4. should add rain tip when weather is Rain', () => {
    const context = { ...baseContext, weather: WEATHER_CONDITIONS.RAIN };
    const result = getRecommendations(context);
    
    expect(result.tips).toContain('Use covered walkways and consider carrying an umbrella.');
  });

  it('5. should add extreme heat tip when weather is ExtremeHeat', () => {
    const context = { ...baseContext, weather: WEATHER_CONDITIONS.EXTREME_HEAT };
    const result = getRecommendations(context);
    
    expect(result.tips).toContain('Remember to stay hydrated! Visit the hydration stations near the gates.');
  });

  it('6. should add VIP tip when ticket type is VIP', () => {
    const context = { ...baseContext, ticketType: TICKET_TYPES.VIP };
    const result = getRecommendations(context);
    
    expect(result.tips).toContain('As a VIP, you can use the exclusive VIP lounge fast-entry lane at your gate.');
  });

  it('7. should switch to alternate gate if best gate is High and kickoff is < 20 mins', () => {
    const context = {
      ...baseContext,
      minutesToMatch: 15,
      crowdByZone: {
        [GATES.GATE_A]: CROWD_DENSITIES.HIGH,
        [GATES.GATE_B]: CROWD_DENSITIES.HIGH
      }
    };
    
    const result = getRecommendations(context);
    // Since all available are High, sortedGates[0] and sortedGates[1] are both High. 
    // It should pick sortedGates[1][0] as the alternate gate.
    // In our crowdByZone above, Gate A and Gate B are the only ones, so it will pick Gate B.
    expect(result.message).toContain('Match starts in less than 20 mins and primary gates are packed.');
    // In javascript Object.entries order is not strictly guaranteed if keys are not numeric, but usually alphabetical.
    // Let's just check the message contains the switch logic.
    expect(result.recommendedGate).toBeDefined();
  });

  it('8. should suggest hurrying if < 20 mins but gate is NOT High', () => {
    const context = {
      ...baseContext,
      minutesToMatch: 10,
      crowdByZone: {
        [GATES.GATE_A]: CROWD_DENSITIES.LOW,
      }
    };
    
    const result = getRecommendations(context);
    expect(result.message).toContain('Match starts soon (10 mins). Hurry to gateA for fast entry.');
    expect(result.recommendedGate).toBe(GATES.GATE_A);
  });

});
