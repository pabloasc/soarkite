import { type ReactNode } from 'react';
interface Assistant {
    id: string;
    name: string;
    icon: ReactNode;
    description: string;
    link: string;
  }

export const assistants: Assistant[] = [
  {
    id: 'github-copilot',
    name: 'GitHub Copilot',
    icon: 'github-copilot.png',
    description: 'AI pair programmer that helps you write code faster with smart suggestions and real-time completions across multiple IDEs.',
    link: 'https://github.com/features/copilot'
  },
  {
    id: 'cursor',
    name: 'Cursor',
    icon: 'logo-cursor-ai.webp',
    description: 'Free VS Code-based editor with GPT-4 and Claude-3.5 Sonnet integrations, offering powerful code editing and generation capabilities.',
    link: 'https://cursor.sh'
  },
  {
    id: 'bolt',
    name: 'Bolt',
    icon: 'bolt.png',
    description: 'Browser-based development environment optimized for React, perfect for rapid prototyping and instant project setup.',
    link: 'https://bolt.new'
  },
  {
    id: 'v0',
    name: 'v0',
    icon: 'v0.png',
    description: 'AI-powered full-stack development platform with strong UI capabilities and seamless Vercel deployment.',
    link: 'https://v0.dev'
  },
  {
    id: 'tabnine',
    name: 'Tabnine',
    icon: 'tabnine.png',
    description: 'AI code completion tool with both cloud and local processing options, focusing on privacy and personalization.',
    link: 'https://www.tabnine.com'
  },
  {
    id: 'amazon-codewhisperer',
    name: 'Amazon CodeWhisperer',
    icon: 'amazon-codewhisperer.png',
    description: 'AWS-integrated coding companion with strong security features and free individual tier.',
    link: 'https://aws.amazon.com/codewhisperer',

  },
  {
    id: 'replit',
    name: 'Replit',
    icon: 'replit_logo.jpg',
    description: 'Collaborative browser-based IDE with built-in AI features and hosting capabilities.',
    link: 'https://replit.com'
  },
  {
    id: 'windsurf',
    name: 'Windsurf AI',
    icon: 'windsurf_teal_logo.svg',
    description: 'Revolutionary AI-powered development platform that transforms natural language into full-stack applications.',
    link: 'https://windsurf.ai'
  },
  {
    id: 'lovable',
    name: 'Lovable.dev',
    icon: 'lovable.png',
    description: 'Build faster with AI that understands your needs. Get working code from natural language. Chat about your product idea in English.',
    link: 'https://lovable.dev'
  },
  {
    id: 'supermaven',
    name: 'Supermaven',
    icon: 'supermaven.webp',
    description: 'Copilot with a 1 million token context window.',
    link: 'https://supermaven.com'
  },
  {
    id: 'project-idx',
    name: 'Project IDX',
    icon: 'project-idx.png',
    description: 'Google\'s browser-based development experience powered by AI, offering features like code generation, chat, and more.',
    link: 'https://idx.dev'
  },
  
  {
    id: 'claude-code',
    name: 'Claude Code',
    icon: 'claude-code.png',
    description: 'Claude Code is an agentic coding tool that lives in your terminal, understands your codebase, and helps you code faster through natural language commands.',
    link: 'https://docs.anthropic.com/en/docs/agents-and-tools/claude-code/overview'
  },
];