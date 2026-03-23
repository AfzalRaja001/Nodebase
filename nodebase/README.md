# ⚡ Nodebase

Nodebase is a powerful, open-source workflow automation platform designed to connect APIs, AI models, and triggers seamlessly. Built with modern web technologies, it features a visual workflow builder that allows you to orchestrate complex tasks, automate business processes, and integrate with your favorite services.

## ✨ Basic Features

- **🎨 Visual Workflow Builder:** Intuitive drag-and-drop interface powered by React Flow.
- **🤖 Native AI Actions:** Built-in nodes for executing tasks against OpenAI, Anthropic, and Google Gemini via the AI SDK.
- **🔗 Flexible Triggers:** Start workflows via HTTP Webhooks, Google Form submissions, Stripe events, or Manual Triggers.
- **🔌 Integrations:** Communicate with external services like Discord and generic HTTP endpoints.
- **🔐 Secure Credential Management:** Store and manage API keys for your AI providers securely, attached natively to workflow nodes.
- **⏱️ Reliable Execution Engine:** Background jobs, retries, and comprehensive step-by-step executions powered by Inngest.
- **👤 Authentication:** Built-in auth system using Better Auth (GitHub, Google, Email/Password).
- **📊 Real-time Monitoring:** View execution statuses (Running, Success, Failed) and output logs in real-time.

## 🛠️ Tech Stack

- **Framework:** [Next.js 15](https://nextjs.org) (React 19, App Router)
- **Database / ORM:** PostgreSQL + [Prisma](https://www.prisma.io/)
- **Authentication:** [Better Auth](https://better-auth.com/)
- **Workflow / Job Engine:** [Inngest](https://www.inngest.com/)
- **Frontend & Styling:** [Tailwind CSS 4](https://tailwindcss.com/) & [Radix UI](https://www.radix-ui.com/) (shadcn/ui)
- **API & State:** [tRPC](https://trpc.io/) & [TanStack Query](https://tanstack.com/query) v5
- **Node Graph:** [React Flow](https://reactflow.dev/)
- **Error Tracking & Monitoring:** [Sentry](https://sentry.io/)

---

## 🚀 Setup Guide

Follow these step-by-step instructions to set up Nodebase on your local machine for development.

### Prerequisites

- Node.js (v20+ recommended)
- A PostgreSQL database (e.g., local, [Neon.tech](https://neon.tech), or Supabase)
- An [Inngest](https://www.inngest.com) account (or rely solely on the local dev server)
- `ngrok` (optional, for receiving external webhooks like Stripe/Google Forms locally)

### 1. Clone the repository

```bash
git clone https://github.com/your-username/nodebase.git
cd nodebase
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the root directory based on the variables the app expects:

```env
# Database
DATABASE_URL="postgresql://user:password@host/database"

# Better Auth Configuration
BETTER_AUTH_SECRET="your-super-secret-auth-key"
BETTER_AUTH_URL="http://localhost:3000"

# OAuth Providers
GITHUB_CLIENT_ID="your-github-client-id"
GITHUB_CLIENT_SECRET="your-github-client-secret"
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Basic Encryption Details
ENCRYPTION_KEY="your-32-byte-encryption-key"

# AI Providers (can also be configured via Frontend UI Credentials manager)
GOOGLE_GENERATIVE_AI_API_KEY="your-gemini-key"
OPENAI_API_KEY="your-openai-key" 
ANTHROPIC_AUTH_TOKEN="your-anthropic-key"

# Application URLs
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_NGROK_URL="https://your-ngrok-url.ngrok-free.dev" # Optional
```

### 4. Set up the database schema

Push the Prisma schema to your PostgreSQL database to create all the necessary schemas and tables:

```bash
npx prisma db push
```

*(Note: Use `npx prisma migrate dev` if you prefer to generate migration files instead.)*

### 5. Start the development server

Nodebase comes with a handy script to run Next.js and the Inngest CLI concurrently using `mprocs`:

```bash
npm run dev:all
```

> **Alternatively**, you can run them in separate terminal instances:
> - Terminal 1: `npm run dev` (Starts Next.js server with Turbopack)
> - Terminal 2: `npm run inngest:dev` (Starts the Inngest local dev server)

### 6. Start Building!

Visit [http://localhost:3000](http://localhost:3000) in your browser to sign in, set up your credentials, and start building automation workflows!

---

## 🤝 Contributing

Contributions are more than welcome! Please feel free to submit a Pull Request or open an issue to discuss new trigger/action node additions.
