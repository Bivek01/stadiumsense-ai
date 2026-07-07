# StadiumSense AI

## 1. Chosen Vertical
**Fan/Spectator Assistant for Smart Stadiums & Tournament Operations**

## 2. Approach and Logic
- **Context Object**: The system tracks a localized fan state consisting of: ticket type, time remaining until kickoff, weather conditions, individual gate crowd densities, current physical zone, and special needs (e.g., medical, mobility).
- **Rule-Based Decision Engine**: A deterministic, side-effect-free pure function evaluates the context to make critical routing decisions. For example, medical emergencies immediately override standard logic, while near-kickoff congestion triggers intelligent fallback routing to alternate gates.
- **Grounded Conversational AI**: Instead of acting as a generic chatbot, the Gemini API is utilized as a contextual conversational layer. Both the live fan context and the deterministic recommendations are injected into the prompt. This strictly grounds the AI, ensuring its answers are tailored to the immediate physical realities of the simulated stadium environment.

## 3. How the Solution Works

### Setup Instructions
1. Install project dependencies:
   ```bash
   npm install
   ```
2. Create a `.env` file in the project root and add your Gemini API key:
   ```env
   VITE_GEMINI_API_KEY=your_api_key_here
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```

### UI Walkthrough
- **ContextSimulator**: A control panel allowing you to manipulate the live environmental variables of a fan (e.g., simulating heavy rain or shifting gate congestion). Changes immediately lift state up to the main application.
- **RecommendationPanel**: Automatically processes the live context through the decision engine and displays actionable tips, optimal gate routes, and priority alerts (color-coded for urgency).
- **ChatAssistant**: A localized chat interface that allows users to ask free-text questions. Because it is continuously fed the active context and engine recommendations behind the scenes, it provides highly relevant, situation-aware answers.

## 4. Assumptions Made
- **Simulated Data**: Crowd density and weather conditions are mocked/simulated via the UI rather than pulling from a live IoT sensor feed for this prototype.
- **Simplified Logic**: Ticket categories are restricted to VIP, General, and Student for simplicity.
- **Scope**: The logic assumes a single-stadium, single-match architecture for demonstration purposes.

## 5. Tech Stack Used
- **React** (UI architecture and state management)
- **Vite** (Build tool and development server)
- **Tailwind CSS** (Utility-first styling and responsive layout)
- **Gemini API** (`gemini-2.0-flash` for the conversational assistant)
