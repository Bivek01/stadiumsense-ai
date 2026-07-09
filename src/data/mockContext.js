import { TICKET_TYPES, WEATHER_CONDITIONS, CROWD_DENSITIES, ZONES, SPECIAL_NEEDS, GATES } from './constants';

/**
 * Mock contexts representing various common game-day scenarios.
 * Useful for unit testing the decisionEngine pure functions.
 */

// 1. Standard arrival scenario with plenty of time and variable crowds.
export const normalContext = {
  ticketType: TICKET_TYPES.GENERAL,
  minutesToMatch: 60,
  weather: WEATHER_CONDITIONS.CLEAR,
  crowdByZone: { [GATES.GATE_A]: CROWD_DENSITIES.HIGH, [GATES.GATE_B]: CROWD_DENSITIES.MEDIUM, [GATES.GATE_C]: CROWD_DENSITIES.LOW, [GATES.GATE_D]: CROWD_DENSITIES.MEDIUM },
  currentZone: ZONES.PARKING_NORTH,
  specialNeed: SPECIAL_NEEDS.NONE
};

// 2. VIP fan arriving in the rain.
export const rainyContext = {
  ticketType: TICKET_TYPES.VIP,
  minutesToMatch: 45,
  weather: WEATHER_CONDITIONS.RAIN,
  crowdByZone: { [GATES.GATE_A]: CROWD_DENSITIES.MEDIUM, [GATES.GATE_B]: CROWD_DENSITIES.LOW, [GATES.GATE_C]: CROWD_DENSITIES.LOW, [GATES.GATE_D]: CROWD_DENSITIES.MEDIUM },
  currentZone: ZONES.TRANSIT_STATION,
  specialNeed: SPECIAL_NEEDS.NONE
};

// 3. Urgent scenario where rules are bypassed for safety.
export const medicalEmergencyContext = {
  ticketType: TICKET_TYPES.STUDENT,
  minutesToMatch: 30,
  weather: WEATHER_CONDITIONS.CLEAR,
  crowdByZone: { [GATES.GATE_A]: CROWD_DENSITIES.LOW, [GATES.GATE_B]: CROWD_DENSITIES.LOW, [GATES.GATE_C]: CROWD_DENSITIES.LOW, [GATES.GATE_D]: CROWD_DENSITIES.LOW },
  currentZone: ZONES.GATE_C_PLAZA,
  specialNeed: SPECIAL_NEEDS.MEDICAL
};

// 4. Critical time crunch with maximum congestion.
export const nearKickoffHighCrowdContext = {
  ticketType: TICKET_TYPES.GENERAL,
  minutesToMatch: 15,
  weather: WEATHER_CONDITIONS.EXTREME_HEAT,
  crowdByZone: { [GATES.GATE_A]: CROWD_DENSITIES.HIGH, [GATES.GATE_B]: CROWD_DENSITIES.HIGH, [GATES.GATE_C]: CROWD_DENSITIES.HIGH, [GATES.GATE_D]: CROWD_DENSITIES.HIGH },
  currentZone: ZONES.FOOD_COURT,
  specialNeed: SPECIAL_NEEDS.NONE
};
