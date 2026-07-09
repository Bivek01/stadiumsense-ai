# StadiumSense AI

## 1. Chosen Vertical: Smart Stadiums & Tournament Operations

StadiumSense AI is a dynamic fan assistant designed specifically to solve real-time stadium operational challenges expected at large-scale events, such as the upcoming **FIFA World Cup 2026**. By instantly processing localized fan conditions—ranging from crowd surges to medical emergencies—the platform provides real-time, personalized guidance to ensure safety, efficiency, and an optimal spectator experience.

### Why this matters for large tournaments
At the scale of a World Cup, traditional static signage and generic stadium announcements are insufficient. Sudden crowd surges can bottleneck gates, unexpected weather disruptions can cause chaos, and medical emergencies in dense crowds require immediate, precise routing. StadiumSense AI directly addresses these pain points by replacing static information with dynamic, context-aware intelligence that actively manages fan flow and safety at scale.

## 2. Alignment with Challenge Expectations

This project strictly aligns with the core pillars of the Smart Stadiums & Tournament Operations challenge:
- **Ability to build a smart, dynamic assistant:** The `ChatAssistant` component leverages the Gemini API not as a generic chatbot, but as a grounded operational assistant. It is continuously fed live stadium data and system directives to provide accurate, situation-aware answers.
- **Logical decision making based on user context:** The deterministic rule engine (`src/engine/decisionEngine.js`) processes variables like ticket tier, time to kickoff, and zone density. It applies rigorous logic (e.g., immediate override for medical issues, fallback routing for near-kickoff congestion) to calculate optimal routing.
- **Practical and real-world usability:** The `ContextSimulator` dashboard serves as a live mission-control interface, demonstrating how operations teams (or simulated fans) can instantly react to shifting game-day parameters and receive actionable recommendations.
- **Clean and maintainable code:** The codebase is heavily componentized, uses robust JSDoc typing for self-documentation, centralizes magic strings into a unified `src/data/constants.js` configuration, and utilizes React performance optimizations (like `useMemo` and `React.memo`).

## 3. How the Solution Works

### Setup Instructions
1. Install project dependencies:
   ```bash
   npm install
   ```
2. Create a `.env` file in the project root and add your Gemini API key (Note: It is no longer prefixed with `VITE_` because it is securely handled server-side):
   ```env
   GEMINI_API_KEY=your_api_key_here
   ```
   *The API calls are securely proxied through a Vercel serverless function (`api/gemini.js`), ensuring your API key is never exposed to the client bundle.*
3. Start the Vite development server:
   ```bash
   npm run dev
   ```

### UI Walkthrough
- **ContextSimulator**: A control panel allowing you to manipulate the live environmental variables of a fan (e.g., simulating heavy rain or shifting gate congestion). Changes immediately lift state up to the main application.
- **RecommendationPanel**: Automatically processes the live context through the decision engine and displays actionable tips, optimal gate routes, and priority alerts (color-coded for urgency).
- **ChatAssistant**: A localized chat interface that allows users to ask free-text questions. Because it is continuously fed the active context and engine recommendations behind the scenes, it provides highly relevant, situation-aware answers.

## 4. Assumptions and Limitations

To deliver this prototype, the following specific, honest assumptions were made:
- **Simulated Data**: Crowd density and weather conditions are mocked via the UI slider and dropdowns. This serves as a proxy for the live IoT sensor feeds and turnstile APIs that would exist in a real World Cup stadium infrastructure.
- **Single-Stadium Scope**: The logic assumes a single-stadium, single-match architecture (managing routing for one specific venue at a time) rather than a complex multi-city tournament mesh.
- **Simplified Geography**: The layout is abstracted to four distinct gates and a few general zones (e.g., Transit Station, Food Court) rather than relying on heavy, real-world geospatial mapping APIs.
- **Ticket Privileges**: Ticket categories are restricted to VIP, General, and Student to cleanly demonstrate logical branching for premium access lanes without overcomplicating state.

## 5. Tech Stack Used
- **React 18** (UI architecture, state management, and memoization)
- **Vite** (Build tool and development server)
- **Tailwind CSS** (Utility-first styling and responsive layout)
- **Gemini API** (`gemini-2.0-flash` for grounded conversational AI)
