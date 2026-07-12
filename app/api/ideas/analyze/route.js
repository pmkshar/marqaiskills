import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    const { idea, role } = await request.json();

    if (!idea || !idea.trim()) {
      return NextResponse.json({ error: 'Please describe your idea' }, { status: 400 });
    }

    // Generate a comprehensive development plan using rule-based engine
    const plan = generateIdeaPlan(idea.trim(), role || 'viewer');

    return NextResponse.json({ success: true, plan });
  } catch (error) {
    console.error('Ideas analysis error:', error);
    return NextResponse.json(
      { error: 'Failed to analyze idea. Please try again.' },
      { status: 500 }
    );
  }
}

function generateIdeaPlan(idea, role) {
  const ideaLower = idea.toLowerCase();

  // Detect key features from the idea
  const hasChatbot = /chat|bot|assistant|convers/i.test(ideaLower);
  const hasVoice = /voice|speech|audio|talk|speak/i.test(ideaLower);
  const hasImage = /image|photo|picture|visual|design|art/i.test(ideaLower);
  const hasCode = /code|develop|program|debug|review/i.test(ideaLower);
  const hasSearch = /search|find|retriev|query|knowledge/i.test(ideaLower);
  const hasAnalytics = /analytic|dashboard|metric|predict|forecast|insight/i.test(ideaLower);
  const hasMultilingual = /multilingual|translat|language|international/i.test(ideaLower);
  const hasRealtime = /real-time|live|stream|instant/i.test(ideaLower);
  const hasEcommerce = /e-commerce|shop|store|product|cart|payment/i.test(ideaLower);
  const hasMedical = /medical|health|hospital|clinical|patient/i.test(ideaLower);
  const hasFinance = /finance|investment|bank|trading|stock|portfolio/i.test(ideaLower);
  const hasEducation = /educ|learn|teach|course|tutor|school/i.test(ideaLower);
  const hasVideo = /video|stream|watch|record|camera|youtube/i.test(ideaLower);
  const hasMobile = /mobile|app|ios|android|react native|flutter/i.test(ideaLower);
  const hasSecurity = /security|auth|encrypt|compliance|audit/i.test(ideaLower);
  const hasAutomation = /automat|workflow|schedule|pipeline|cron/i.test(ideaLower);
  const hasEmail = /email|mail|newsletter|notification|alert/i.test(ideaLower);
  const hasDocument = /document|pdf|parse|extract|ocr|scan/i.test(ideaLower);

  // Build phases based on detected features
  const phases = [];
  const allTools = new Set();
  const allModels = [];

  // Phase 1: Planning & Requirements
  phases.push({
    title: 'Project Planning & Requirements',
    category: 'Frontend & UI',
    description: 'Define the project scope, user stories, and technical requirements. Create wireframes and design the system architecture. Identify the AI capabilities needed and map them to available models and platforms from the Marq AI Directory. Establish sprint planning and team assignments based on the project complexity and timeline.',
    tools: [
      { name: 'Notion', icon: '📝' },
      { name: 'Figma', icon: '🎨' },
      { name: 'GitHub', icon: '🐙' },
    ],
    models: [
      { name: 'GPT-4o', reason: 'Requirements analysis and user story generation' },
    ],
    deliverables: ['Product Requirements Document', 'System Architecture Diagram', 'Technical Specification', 'Sprint Plan'],
  });
  allTools.add('Notion');

  // Phase 2: Frontend Development
  const frontendTools = [
    { name: 'Next.js', icon: '⚛️' },
    { name: 'React', icon: '⚛️' },
    { name: 'Tailwind CSS', icon: '🎨' },
    { name: 'Vercel AI SDK', icon: '▲' },
  ];
  if (hasMobile) {
    frontendTools.push({ name: 'React Native', icon: '📱' });
    frontendTools.push({ name: 'Expo', icon: '📲' });
  }
  phases.push({
    title: 'Frontend Development',
    category: 'Frontend & UI',
    description: 'Build the user interface using Next.js and React with Tailwind CSS for styling. Implement responsive design, dark/light themes, and accessible components. Set up the component library and design system for consistent UI across the application. ' + (hasMobile ? 'Configure React Native/Expo for mobile app development alongside the web interface.' : 'Ensure cross-browser compatibility and progressive web app support.'),
    tools: frontendTools,
    models: [
      { name: 'Vercel AI SDK', reason: 'Streaming UI components for AI responses' },
    ],
    deliverables: ['Responsive Web Application', 'Component Library', 'Design System', 'User Flows'],
  });
  allTools.add('Next.js');

  // Phase 3: Backend & API
  phases.push({
    title: 'Backend API & Services',
    category: 'Backend & API',
    description: 'Develop the REST API and backend services using Node.js with Next.js API routes. Implement authentication, authorization, rate limiting, and API versioning. Set up database models with Prisma ORM and configure Redis caching for performance. ' + (hasRealtime ? 'Implement WebSocket connections for real-time features using Socket.io.' : 'Design the API with future real-time capability support.'),
    tools: [
      { name: 'Prisma', icon: '🔷' },
      { name: 'PostgreSQL', icon: '🐘' },
      { name: 'Redis', icon: '🔴' },
      { name: 'Docker', icon: '🐳' },
    ],
    models: [],
    deliverables: ['REST API Endpoints', 'Database Schema', 'Authentication System', 'API Documentation'],
  });
  allTools.add('Prisma');

  // Phase 4: AI Integration (dynamic based on features)
  const aiTools = [];
  const aiModels = [];

  if (hasChatbot || hasSearch) {
    aiTools.push({ name: 'LangChain', icon: '🔗' });
    aiTools.push({ name: 'LlamaIndex', icon: '🦙' });
    aiModels.push({ name: 'GPT-4o', reason: 'Conversational AI and reasoning' });
    aiModels.push({ name: 'Claude 3.5 Sonnet', reason: 'Complex multi-step reasoning' });
    allTools.add('LangChain');
    allTools.add('LlamaIndex');
  }

  if (hasSearch || hasChatbot) {
    aiTools.push({ name: 'Pinecone', icon: '🌲' });
    aiTools.push({ name: 'Chroma', icon: '🎨' });
    aiModels.push({ name: 'text-embedding-3-large', reason: 'High-quality embeddings for RAG' });
    allTools.add('Pinecone');
  }

  if (hasVoice) {
    aiTools.push({ name: 'ElevenLabs', icon: '🎙️' });
    aiTools.push({ name: 'Deepgram', icon: '🔊' });
    aiModels.push({ name: 'Whisper', reason: 'Speech-to-text transcription' });
    aiModels.push({ name: 'ElevenLabs Turbo v2', reason: 'Realistic text-to-speech' });
    allTools.add('ElevenLabs');
    allTools.add('Deepgram');
  }

  if (hasImage) {
    aiTools.push({ name: 'Replicate', icon: '🔄' });
    aiTools.push({ name: 'fal', icon: '⚡' });
    aiModels.push({ name: 'Stable Diffusion XL', reason: 'Image generation and editing' });
    aiModels.push({ name: 'DALL-E 3', reason: 'Creative image generation from text' });
    allTools.add('Replicate');
  }

  if (hasVideo) {
    aiTools.push({ name: 'Replicate', icon: '🔄' });
    aiTools.push({ name: 'Runway', icon: '🎬' });
    aiModels.push({ name: 'Stable Video Diffusion', reason: 'AI video generation' });
    aiModels.push({ name: 'Whisper', reason: 'Video transcription and captioning' });
    allTools.add('Runway');
  }

  if (hasCode) {
    aiTools.push({ name: 'E2B', icon: '🖥️' });
    aiModels.push({ name: 'DeepSeek Coder V2', reason: 'Code generation and review' });
    aiModels.push({ name: 'CodeLlama 70B', reason: 'Self-hosted code model' });
    allTools.add('E2B');
  }

  if (hasDocument) {
    aiTools.push({ name: 'LlamaIndex', icon: '🦙' });
    aiTools.push({ name: 'Unstructured', icon: '📄' });
    aiModels.push({ name: 'GPT-4o', reason: 'Document understanding and extraction' });
    aiModels.push({ name: 'Nougat', reason: 'PDF OCR and parsing' });
    allTools.add('LlamaIndex');
  }

  if (hasMultilingual) {
    aiModels.push({ name: 'GPT-4o', reason: 'Multilingual understanding and translation' });
    aiModels.push({ name: 'NLLB', reason: 'Open-source translation model' });
  }

  if (hasAnalytics) {
    aiTools.push({ name: 'LangFuse', icon: '🔍' });
    aiModels.push({ name: 'Prophet', reason: 'Time series forecasting' });
    allTools.add('LangFuse');
  }

  // Default AI tools if none matched
  if (aiTools.length === 0) {
    aiTools.push({ name: 'OpenAI API', icon: '🤖' });
    aiTools.push({ name: 'LangChain', icon: '🔗' });
    aiTools.push({ name: 'Pinecone', icon: '🌲' });
    aiModels.push({ name: 'GPT-4o', reason: 'General-purpose AI reasoning and generation' });
    aiModels.push({ name: 'text-embedding-3-large', reason: 'Semantic search embeddings' });
    allTools.add('OpenAI');
    allTools.add('LangChain');
    allTools.add('Pinecone');
  }

  // Always add observability
  aiTools.push({ name: 'LangFuse', icon: '🔍' });
  aiTools.push({ name: 'Helicone', icon: '📊' });
  allTools.add('LangFuse');

  phases.push({
    title: 'AI Integration & Model Setup',
    category: 'AI & ML Models',
    description: `Integrate AI models and build the core intelligence layer. ${hasChatbot ? 'Set up conversational AI with RAG for knowledge-grounded responses. ' : ''}${hasVoice ? 'Implement speech-to-text and text-to-speech pipelines. ' : ''}${hasImage ? 'Configure image generation and vision models. ' : ''}${hasSearch ? 'Build vector search and retrieval pipeline. ' : ''}${hasVideo ? 'Integrate video processing and generation capabilities. ' : ''}${hasDocument ? 'Set up document parsing and extraction pipeline. ' : ''}Use LiteLLM for multi-provider model routing and fallbacks.`,
    tools: aiTools,
    models: aiModels.length > 0 ? aiModels : [{ name: 'GPT-4o', reason: 'General-purpose AI capabilities' }],
    deliverables: ['AI Integration Layer', 'RAG Pipeline', 'Model Routing System', 'Prompt Templates'],
  });

  // Phase 5: Agents & Automation
  const agentTools = [];
  if (hasChatbot || hasCode) {
    agentTools.push({ name: 'CrewAI', icon: '👥' });
    agentTools.push({ name: 'LangGraph', icon: '🔀' });
    allTools.add('CrewAI');
    allTools.add('LangGraph');
  }
  if (hasRealtime) {
    agentTools.push({ name: 'LiveKit Agents', icon: '📞' });
    allTools.add('LiveKit Agents');
  }
  if (hasAutomation) {
    agentTools.push({ name: 'n8n', icon: '⚡' });
    agentTools.push({ name: 'Composio', icon: '🔌' });
    allTools.add('n8n');
  }
  if (hasEmail) {
    agentTools.push({ name: 'Composio', icon: '🔌' });
    allTools.add('Composio');
  }
  if (agentTools.length === 0) {
    agentTools.push({ name: 'CrewAI', icon: '👥' });
    agentTools.push({ name: 'LangGraph', icon: '🔀' });
    agentTools.push({ name: 'Composio', icon: '🔌' });
    allTools.add('CrewAI');
  }

  phases.push({
    title: 'Agent Development & Automation',
    category: 'Integration',
    description: `Build AI agents for automated workflows and multi-step tasks. ${hasChatbot ? 'Create conversational agents that can handle user queries with tool use. ' : ''}${hasCode ? 'Implement code analysis and review agents. ' : ''}${hasAutomation ? 'Design automated workflow agents using n8n for scheduling and orchestration. ' : ''}Set up agent orchestration with fallback mechanisms and human-in-the-loop patterns for critical decisions.`,
    tools: agentTools,
    models: [
      { name: 'Claude 3.5 Sonnet', reason: 'Agent reasoning and tool selection' },
      { name: 'GPT-4o', reason: 'Multi-step planning and execution' },
    ],
    deliverables: ['Agent Workflows', 'Tool Integration Layer', 'Human-in-the-loop System', 'Agent Memory'],
  });

  // Phase 6: Testing & QA
  phases.push({
    title: 'Testing & Quality Assurance',
    category: 'Testing & QA',
    description: 'Implement comprehensive testing including unit tests, integration tests, and end-to-end tests. Use PromptFoo for LLM evaluation and RAGAS for RAG quality assessment. Set up automated CI/CD pipelines with GitHub Actions for continuous testing and deployment. Create test fixtures for AI model responses to ensure consistent behavior across updates.',
    tools: [
      { name: 'PromptFoo', icon: '🧪' },
      { name: 'RAGAS', icon: '📊' },
      { name: 'GitHub Actions', icon: '⚡' },
      { name: 'Playwright', icon: '🎭' },
    ],
    models: [
      { name: 'GPT-4o-mini', reason: 'Cost-effective evaluation judge' },
    ],
    deliverables: ['Test Suite', 'LLM Evaluation Benchmarks', 'CI/CD Pipeline', 'Performance Report'],
  });
  allTools.add('PromptFoo');

  // Phase 7: Deployment
  const deployTools = [
    { name: 'Vercel', icon: '▲' },
    { name: 'AWS', icon: '☁️' },
    { name: 'LangFuse', icon: '🔍' },
    { name: 'Cloudflare', icon: '🌐' },
  ];
  if (hasMobile) {
    deployTools.push({ name: 'App Store Connect', icon: '📱' });
  }
  phases.push({
    title: 'Deployment & Production Launch',
    category: 'Deployment & DevOps',
    description: 'Deploy the application to production with Vercel for frontend and AWS/GCP for backend services. Set up monitoring, logging, and alerting with LangFuse and Datadog. Configure auto-scaling, CDN distribution, and production database with backup strategies. ' + (hasMobile ? 'Prepare mobile app builds for App Store and Play Store submission.' : 'Implement blue-green deployment for zero-downtime updates.'),
    tools: deployTools,
    models: [],
    deliverables: ['Production Deployment', 'Monitoring Dashboard', 'Scaling Configuration', 'Documentation'],
  });
  allTools.add('Vercel');

  // Build architecture layers
  const layers = [
    { type: 'Frontend', name: 'Next.js + React', description: 'Server-rendered web application with streaming AI UI' },
    { type: 'Backend & API', name: 'Node.js API Routes', description: 'REST API with authentication and business logic' },
    { type: 'AI & ML Models', name: 'LiteLLM + Multi-provider', description: 'Unified AI model routing with fallbacks' },
    { type: 'Data & Storage', name: 'PostgreSQL + Pinecone', description: 'Structured data + vector search for RAG' },
  ];

  if (hasVoice) layers.push({ type: 'Integration', name: 'Deepgram + ElevenLabs', description: 'Speech processing pipeline' });
  if (hasImage) layers.push({ type: 'Integration', name: 'fal + Replicate', description: 'Image generation and processing' });
  if (hasVideo) layers.push({ type: 'Integration', name: 'Runway + Whisper', description: 'Video generation and captioning' });
  if (hasMobile) layers.push({ type: 'Mobile', name: 'React Native + Expo', description: 'Cross-platform mobile application' });
  layers.push({ type: 'Infrastructure', name: 'Vercel + Cloudflare', description: 'Hosting, CDN, and edge compute' });

  // Build cost estimates
  const complexity = phases.length > 6 ? 'Medium-High' : 'Medium';
  const weekRange = phases.length > 6 ? '8-14' : '6-10';
  const aiCost = hasVoice && hasImage ? '$300-800' : hasVoice || hasImage ? '$150-400' : '$50-200';
  const devCost = phases.length > 6 ? '$25K-50K' : '$15K-35K';

  // Build tips
  const tips = [
    'Start with a minimal viable product (MVP) focusing on the core AI feature before adding complexity',
    'Use LiteLLM or OpenRouter to avoid vendor lock-in and get the best pricing across AI providers',
    'Implement streaming responses for all AI interactions to improve perceived performance',
    'Set up observability (LangFuse/Helicone) from day one to monitor costs and quality',
    'Use RAG instead of fine-tuning for initial launch — it is faster to iterate and cheaper to run',
    'Plan for rate limiting and caching from the start to manage AI API costs at scale',
  ];

  if (hasMedical) tips.push('Ensure HIPAA compliance with data encryption and audit trails for all patient data');
  if (hasFinance) tips.push('Implement financial data validation and regulatory compliance checks in your agent pipeline');
  if (hasSecurity) tips.push('Implement zero-trust security architecture with encryption at rest and in transit');
  if (hasEducation) tips.push('Design adaptive learning paths and use AI to personalize content for different skill levels');
  if (hasMobile) tips.push('Use Expo for rapid mobile prototyping and CodePush for over-the-air updates');

  // Build summary based on detected features
  const features = [];
  if (hasChatbot) features.push('conversational AI');
  if (hasVoice) features.push('voice/speech');
  if (hasImage) features.push('image generation');
  if (hasVideo) features.push('video processing');
  if (hasCode) features.push('code intelligence');
  if (hasSearch) features.push('intelligent search');
  if (hasAnalytics) features.push('predictive analytics');
  if (hasDocument) features.push('document processing');
  if (hasAutomation) features.push('workflow automation');
  if (hasMobile) features.push('mobile app');

  const featureStr = features.length > 0 ? ` with ${features.join(', ')}` : '';
  const approach = hasSearch ? 'RAG-based knowledge retrieval' : hasChatbot ? 'LLM-powered conversational AI' : 'AI-driven processing';

  return {
    summary: `Your idea involves building${featureStr} application. The recommended approach uses a modern web stack with multi-provider AI routing, ${approach}, and production-grade observability. The development plan spans ${phases.length} phases covering frontend, backend, AI integration, testing, and deployment.`,
    quickStats: [
      { label: 'Development Time', value: `${weekRange} weeks` },
      { label: 'AI Models', value: `${aiModels.length || 3}-${(aiModels.length || 3) + 2}` },
      { label: 'Complexity', value: complexity },
      { label: 'Team Size', value: phases.length > 6 ? '4-6 devs' : '2-4 devs' },
      { label: 'Recommended Tools', value: `${allTools.size}+` },
      { label: 'Architecture Layers', value: `${layers.length}` },
    ],
    architecture: { layers },
    costs: {
      items: [
        { label: 'Monthly AI API', value: aiCost },
        { label: 'Infrastructure', value: '$50-200/mo' },
        { label: 'Development', value: devCost },
        { label: 'Time to MVP', value: `${weekRange} weeks` },
      ],
    },
    phases,
    tips: tips.slice(0, 8),
  };
}
