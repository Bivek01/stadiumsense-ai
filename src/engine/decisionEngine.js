/**
 * Helper to determine numeric value for crowd density
 * This allows us to sort gates by how busy they are.
 * 
 * @param {string} density - "Low" | "Medium" | "High"
 * @returns {number} Numeric weight (1 for Low, 2 for Medium, 3 for High)
 */
const getDensityValue = (density) => {
  switch (density) {
    case 'Low': return 1;
    case 'Medium': return 2;
    case 'High': return 3;
    default: return 3;
  }
};

/**
 * Core Decision Engine for StadiumSense AI.
 * Processes fan context and outputs actionable recommendations.
 * 
 * @param {Object} context
 * @param {string} context.ticketType - "VIP" | "General" | "Student"
 * @param {number} context.minutesToMatch - Minutes remaining until kickoff
 * @param {string} context.weather - "Clear" | "Rain" | "ExtremeHeat"
 * @param {Object} context.crowdByZone - Map of gates to density, e.g. { gateA: "Low", gateB: "Medium", ... }
 * @param {string} context.currentZone - Fan's current location zone
 * @param {string} context.specialNeed - "None" | "Medical" | "Mobility" | "LostChild"
 * @returns {Object} - { priority: "normal"|"urgent", recommendedGate: string|null, message: string, tips: string[] }
 */
export function getRecommendations(context) {
  const { specialNeed, minutesToMatch, weather, crowdByZone, ticketType } = context;

  // 1. Evaluate critical override rules first (Urgent needs)
  if (specialNeed === 'Medical' || specialNeed === 'LostChild') {
    return {
      priority: 'urgent',
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
  if (minutesToMatch < 20 && lowestDensity === 'High') {
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
  if (weather === 'Rain') {
    tips.push('Use covered walkways and consider carrying an umbrella.');
  } else if (weather === 'ExtremeHeat') {
    tips.push('Remember to stay hydrated! Visit the hydration stations near the gates.');
  }

  // 5. Contextual tips based on ticket tier
  if (ticketType === 'VIP') {
    tips.push('As a VIP, you can use the exclusive VIP lounge fast-entry lane at your gate.');
  }

  return {
    priority: 'normal',
    recommendedGate,
    message,
    tips
  };
}
