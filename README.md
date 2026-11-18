# AI Productivity Hub

# Build: AI Workplace Productivity Assistant

Create a modern, responsive SaaS web application called **AI Workplace Productivity Assistant**. The application helps professionals improve workplace productivity through AI-powered email writing, research assistance, and an interactive AI chatbot.

## 1. Design & User Interface

Build a clean, modern, professional dashboard inspired by premium SaaS platforms.

**Design requirements:**

* Primary colors: Dark pink, magenta, and deep purple.
* Use a subtle pink-to-purple gradient for buttons and highlights.
* Light background with white cards and soft shadows.
* Modern typography, rounded cards, and consistent spacing.
* Responsive layout for desktop, tablet, and mobile.
* Collapsible sidebar navigation.
* Professional icons and subtle hover animations.

## 2. Dashboard Layout

Create a sidebar with the following navigation:

* Dashboard
* Smart Email Generator
* AI Research Assistant
* AI Workplace Chatbot
* Settings

The main dashboard should include:

* Welcome heading: "Your AI-Powered Workplace Assistant"
* Short productivity-focused subtitle.
* Three feature cards for Email Generator, Research Assistant, and AI Chatbot.
* Quick action buttons to access each feature.
* A clean, modern overview of the application's capabilities.

## 3. Smart Email Generator

Create an interactive email generation tool.

**Input fields:**

* Email purpose or description.
* Recipient.
* Subject (optional).
* Additional context or key points.
* Tone selector with three options:

  * Formal
  * Friendly
  * Persuasive

**Functionality:**

* Generate professional, context-aware emails based on user input.
* Produce relevant subject lines and complete email bodies.
* Allow users to edit generated emails directly.
* Include Copy, Regenerate, and Clear buttons.
* Ensure generated content is relevant to the actual user prompt, not generic placeholder responses.

## 4. AI Research Assistant

Create an AI research workspace that allows users to:

* Enter a research topic or paste an article.
* Generate concise, meaningful summaries.
* Extract important findings and key points.
* Provide actionable insights and recommendations.
* Organize results into clearly labeled sections.
* Edit generated research outputs.
* Copy results to the clipboard.

## 5. AI Workplace Chatbot

Create a modern conversational AI interface.

**Features:**

* Chat-style interface with distinct user and AI message bubbles.
* Input field for workplace-related questions.
* Send button.
* Suggested prompts such as:

  * Help me write a professional email.
  * Summarize this meeting.
  * Give me ideas to improve team productivity.
  * Help me organize my workday.
* Display conversational responses based on the user's actual questions.
* Allow users to start a new conversation.
* Include a typing indicator while generating responses.

## 6. AI Functionality – Important

AI-generated responses are a core requirement.

Use a real AI integration through an available frontend-compatible AI service or Lovable-supported AI capability, if available without requiring a backend.

**Important constraints:**

* Do not build a custom backend.
* Do not create a database.
* Do not implement authentication.
* Do not use mock AI responses or hardcoded generic answers.
* Use structured prompts tailored to each feature.
* Handle loading states and API errors gracefully.
* Keep API credentials secure; never expose secret API keys in frontend code.
* If genuine AI integration requires a backend or paid service, clearly explain the limitation rather than pretending AI generation works.

## 7. Responsible AI Disclaimer

Include a small disclaimer in the application:

"AI-generated content may contain inaccuracies. Always review, verify, and edit AI-generated emails, research, and recommendations before using them professionally. Do not enter confidential company or personal information."

## 8. Technical Requirements

* Use React and TypeScript.
* Use Tailwind CSS for styling.
* Use reusable UI components.
* Use Lucide icons.
* Ensure responsive layouts.
* Use local component state for interactions.
* Use browser local storage only if needed for temporary preferences or saved drafts.
* No backend, database, or authentication.
* Keep the project lightweight and easy to maintain.

## 9. Final Expectations

Deliver a functional, polished frontend application rather than a static mockup.

Prioritize these three working features:

1. Smart Email Generator.
2. AI Research Assistant.
3. AI Workplace Chatbot.

Make all navigation, input fields, buttons, editing features, and copy actions functional.

Keep the design consistent across all pages, with dark pink and purple as the application's visual identity.

**Credit optimization:** Build the complete application in one implementation. Avoid unnecessary extra pages, complicated animations, excessive dependencies, and features outside the stated requirements. Prioritize functionality and a professional user experience.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/55a93bf0-6640-441c-9b11-e9c4280001e3).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
