/**
 * Mock contexts representing various common game-day scenarios.
 * Useful for unit testing the decisionEngine pure functions.
 */

// 1. Standard arrival scenario with plenty of time and variable crowds.
export const normalContext = {
  ticketType: "General",
  minutesToMatch: 60,
  weather: "Clear",
  crowdByZone: { gateA: "High", gateB: "Medium", gateC: "Low", gateD: "Medium" },
  currentZone: "parking_north",
  specialNeed: "None"
};

// 2. VIP fan arriving in the rain.
export const rainyContext = {
  ticketType: "VIP",
  minutesToMatch: 45,
  weather: "Rain",
  crowdByZone: { gateA: "Medium", gateB: "Low", gateC: "Low", gateD: "Medium" },
  currentZone: "transit_station",
  specialNeed: "None"
};

// 3. Urgent scenario where rules are bypassed for safety.
export const medicalEmergencyContext = {
  ticketType: "Student",
  minutesToMatch: 30,
  weather: "Clear",
  crowdByZone: { gateA: "Low", gateB: "Low", gateC: "Low", gateD: "Low" },
  currentZone: "gateC_plaza",
  specialNeed: "Medical"
};

// 4. Critical time crunch with maximum congestion.
export const nearKickoffHighCrowdContext = {
  ticketType: "General",
  minutesToMatch: 15,
  weather: "ExtremeHeat",
  crowdByZone: { gateA: "High", gateB: "High", gateC: "High", gateD: "High" },
  currentZone: "food_court",
  specialNeed: "None"
};
