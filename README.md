# Voice Agency Portal

A comprehensive SaaS dashboard for automating the creation, configuration, and deployment of AI voice agents via Vapi.

## Overview

Voice Agency Portal streamlines the process of building and deploying intelligent voice agents. Users simply input a business URL, and our platform automatically scrapes the site for context, then uses a local LLM to generate a highly tailored system prompt for the voice agent. This eliminates manual configuration and enables rapid deployment of production-ready AI voice solutions.

## Key Features

### 🎨 Discovery Form UI
A sleek, Tailwind-styled frontend that guides users through agent setup. Users input:
- Business Name
- Industry/Sector
- Business Website URL
- Custom Rules & Instructions

### 🤖 Automated Web Scraper
A Playwright-powered backend that:
- Silently scrapes the target business website
- Cleans HTML into readable, contextual text
- Extracts key information for prompt generation

### 🧠 AI Prompt Generation Engine
Uses a local DeepSeek model to:
- Analyze scraped website data
- Identify key differentiators and services
- Recognize common customer objections
- Generate strict, Vapi-ready system prompts automatically

### 🛠️ Agentic Tools Sandbox
A "Backend Demo" UI toggle that allows users to:
- Simulate tool calls in the browser
- Test scenarios (e.g., Order Status lookup, Appointment Booking)
- Validate agent behavior without making live phone calls

## Tech Stack

### Frontend
- **Framework**: Next.js (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Language Composition**: 91.9% TypeScript, 7% CSS, 1.1% JavaScript

### Backend
- **API Runtime**: Next.js Serverless Routes

### Scraping Engine
- **Browser Automation**: Playwright (Chromium)
- **HTML Processing**: html-to-text

### AI & Orchestration
- **Local LLM**: Ollama (running deepseek-r1 or gemma4 models)
- **Voice Telephony**: Vapi
- **Agent Orchestration**: Vapi

## Getting Started

### Prerequisites
- Node.js and npm
- Playwright dependencies
- Ollama (for local LLM inference)
- A running DeepSeek model

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/PratikBalaji/voice-agency-portal.git
   cd voice-agency-portal
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Install Playwright dependencies**:
   ```bash
   npx playwright install chromium
   ```

4. **Ensure Ollama is running** with DeepSeek model:
   ```bash
   ollama run deepseek-r1
   ```
   Or alternatively:
   ```bash
   ollama run gemma4
   ```

5. **Start the development server**:
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) to see the result.

### Network Configuration

If testing across a local network or VM:

1. Start the dev server with the host flag:
   ```bash
   npm run dev -- -H 0.0.0.0
   ```

2. Add your host IP to `allowedDevOrigins` in `next.config.js`:
   ```javascript
   allowedDevOrigins: ['http://YOUR_IP:3000']
   ```

## Project Status

🚀 **Alpha / Active Development**

This project is currently in active development. Features and APIs may change as we refine the platform based on user feedback and testing.

## Contributing

We welcome contributions! Please follow these guidelines:

1. **Fork the repository**
2. **Create a feature branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Commit your changes**:
   ```bash
   git commit -m "Add your feature description"
   ```
4. **Push to your fork**:
   ```bash
   git push origin feature/your-feature-name
   ```
5. **Submit a Pull Request** to the main repository

## Learn More

- [Next.js Documentation](https://nextjs.org/docs) – Learn about Next.js features and API
- [Playwright Documentation](https://playwright.dev) – Web scraping and browser automation
- [Ollama Documentation](https://ollama.ai) – Running local LLMs
- [Vapi Documentation](https://vapi.ai) – Voice agent orchestration