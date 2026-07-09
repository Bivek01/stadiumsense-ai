import { CROWD_DENSITIES, SPECIAL_NEEDS, WEATHER_CONDITIONS, TICKET_TYPES, PRIORITIES } from '../data/constants.js';

/**
 * Core Decision Engine module for StadiumSense AI.
 * 
 * This module is responsible for analyzing game-day fan contexts and generating
 * real-time routing recommendations. It processes various factors like crowd density,
 * time remaining until kickoff, weather conditions, and special needs to calculate
 * the optimal entry gate and provide actionable tips for the fan.
 */

/**
 * Helper to determine numeric value for crowd density.
 * This allows us to sort gates by how busy they are.
 * 
 * @param {string} density - The current crowd density at a specific gate (e.g., "Low", "Medium", "High").
 * @returns {number} A numeric weight representing congestion (1 for Low, 2 for Medium, 3 for High).
 */
const getDensityValue = (density) => {
  switch (density) {
    case CROWD_DENSITIES.LOW: return 1;
    case CROWD_DENSITIES.MEDIUM: return 2;
    case CROWD_DENSITIES.HIGH: return 3;
    default: return 3;
  }
};

/**
 * Processes fan context and outputs actionable recommendations based on business rules.
 * Prioritizes urgent needs first, then identifies the gate with the lowest density,
 * factoring in proximity to kickoff time, weather, and ticket privileges.
 * 
 * @param {Object} context - The current state of the fan's situation and environment.
 * @param {string} context.ticketType - The fan's ticket tier ("VIP", "General", "Student").
 * @param {number} context.minutesToMatch - Minutes remaining until kickoff time.
 * @param {string} context.weather - The current weather conditions ("Clear", "Rain", "ExtremeHeat").
 * @param {Object} context.crowdByZone - Map of gate names to their respective crowd density string.
 * @param {string} context.currentZone - The fan's current geographic location zone.
 * @param {string} context.specialNeed - Any special assistance required by the fan.
 * @returns {{ priority: string, recommendedGate: string|null, message: string, tips: string[] }} An object containing routing priority, recommended gate, a guidance message, and contextual tips.
 */
export function getRecommendations(context) {
  const { specialNeed, minutesToMatch, weather, crowdByZone, ticketType } = context;

  // 1. Evaluate critical override rules first (Urgent needs)
  if (specialNeed === SPECIAL_NEEDS.MEDICAL || specialNeed === SPECIAL_NEEDS.LOST_CHILD) {
    return {
      priority: PRIORITIES.URGENT,
      recommendedGate: null,
      message: 'Urgent: Please proceed immediately to the nearest help desk or medical point. Staff have been alerted.',
      tips: []
    };
  }

  const tips = [];
  
  // 2. Identify the gate with the lowest crowd density
  // Sort all gates based on their density value (ascending)
  const gates = Object.entries(crowdByZone);
  const sortedGates = [...gates].sort(
    ([, densityA], [, densityB]) => getDensityValue(densityA) - getDensityValue(densityB)
  );

  // Default to the absolute lowest density gate
  let recommendedGate = sortedGates.length > 0 ? sortedGates[0][0] : null;
  const lowestDensity = sortedGates.length > 0 ? sortedGates[0][1] : null;
  
  let message = `Proceed to ${recommendedGate} for the fastest entry.`;

  // 3. Time-to-match & Congestion logic
  if (minutesToMatch < 20 && lowestDensity === CROWD_DENSITIES.HIGH) {
    // If the "best" gate is still 'High' and kickoff is soon, suggest an alternate approach.
    // In a real world scenario, we'd pick a geographically nearest alternate gate. 
    // Here we pick the next available gate if possible, or fallback to a general message.
    const alternateGate = sortedGates.length > 1 ? sortedGates[1][0] : recommendedGate;
    recommendedGate = alternateGate;
    message = `Match starts in less than 20 mins and primary gates are packed. Proceed to ${recommendedGate} as a nearest alternate gate for entry.`;
  } else if (minutesToMatch < 20) {
    message = `Match starts soon (${minutesToMatch} mins). Hurry to ${recommendedGate} for fast entry.`;
  }

  // 4. Contextual tips based on weather conditions
  if (weather === WEATHER_CONDITIONS.RAIN) {
    tips.push('Use covered walkways and consider carrying an umbrella.');
  } else if (weather === WEATHER_CONDITIONS.EXTREME_HEAT) {
    tips.push('Remember to stay hydrated! Visit the hydration stations near the gates.');
  }

  // 5. Contextual tips based on ticket tier
  if (ticketType === TICKET_TYPES.VIP) {
    tips.push('As a VIP, you can use the exclusive VIP lounge fast-entry lane at your gate.');
  }

  return {
    priority: PRIORITIES.NORMAL,
    recommendedGate,
    message,
    tips
  };
}
