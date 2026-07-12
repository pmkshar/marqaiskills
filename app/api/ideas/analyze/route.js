import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    const { idea, role } = await request.json();

    if (!idea || !idea.trim()) {
      return NextResponse.json({ error: 'Please describe your idea' }, { status: 400 });
    }

    // Use the AI to generate a comprehensive development plan
    const plan = await generateIdeaPlan(idea.trim(), role || 'viewer');

    return NextResponse.json({ success: true, plan });
  } catch (error) {
    console.error('Ideas analysis error:', error);
    return NextResponse.json(
      { error: 'Failed to analyze idea. Please try again.' },
      { status: 500 }
    );
  }
}

async function generateIdeaPlan(idea, role) {
  // Dynamic import for z-ai-web-dev-sdk
  let ZAI;
  try {
    const sdk = await import('z-ai-web-dev-sdk');
    ZAI = sdk.default || sdk;
  } catch (e) {
    console.error('Failed to import z-ai-web-dev-sdk:', e.message);
    // Fallback to rule-based generation
    return generateRuleBasedPlan(idea);
  }

  try {
    const zai = await ZAI.create();

    const systemPrompt = `You are an expert AI architect and development consultant for the Marq AI Skills Platform. Your job is to take a user's app idea and generate a comprehensive, actionable development plan.

You must respond ONLY with valid JSON (no markdown, no code fences) in this exact structure:

{
  "summary": "A clear 2-3 sentence summary of the project and the recommended approach",
  "quickStats": [
    {"label": "Development Time", "value": "8-12 weeks"},
    {"label": "AI Models Needed", "value": "3-5"},
    {"label": "Complexity", "value": "Medium"},
    {"label": "Team Size", "value": "3-5 devs"}
  ],
  "architecture": {
    "layers": [
      {"type": "Frontend", "name": "Next.js + React", "description": "Modern web UI with SSR"},
      {"type": "Backend & API", "name": "Node.js + Express", "description": "REST API and business logic"},
      {"type": "AI & ML Models", "name": "GPT-4 + Custom Fine-tuned", "description": "NLP and generation models"},
      {"type": "Data & Storage", "name": "PostgreSQL + Pinecone", "description": "Structured data + vector search"},
      {"type": "Infrastructure", "name": "Vercel + AWS", "description": "Hosting and compute"}
    ]
  },
  "costs": {
    "items": [
      {"label": "Monthly AI API", "value": "$200-500"},
      {"label": "Infrastructure", "value": "$50-150/mo"},
      {"label": "Development", "value": "$15K-40K"},
      {"label": "Time to MVP", "value": "6-10 weeks"}
    ]
  },
  "phases": [
    {
      "title": "Requirements & Planning",
      "category": "Frontend & UI",
      "description": "Detailed description of what to do in this phase, including specific technical decisions and architecture choices. Should be 3-5 sentences.",
      "tools": [
        {"name": "Figma", "icon": "🎨"},
        {"name": "Notion", "icon": "📝"}
      ],
      "models": [
        {"name": "GPT-4o", "reason": "Requirements analysis and user story generation"}
      ],
      "deliverables": [
        "Product requirements document",
        "Technical architecture diagram"
      ]
    }
  ],
  "tips": [
    "Start with a minimal viable product focusing on core features",
    "Use streaming responses for better user experience"
  ]
}

IMPORTANT RULES:
1. Generate 5-8 phases in the roadmap
2. Each phase MUST have: title, category (one of: Frontend & UI, Backend & API, AI & ML Models, Data & Storage, Infrastructure, Testing & QA, Deployment & DevOps, Security & Auth, Integration, Monitoring), description (3-5 sentences), tools array, models array, and deliverables array
3. Tools should be SPECIFIC real products/platforms from the Marq AI Directory (e.g., "LangChain", "Pinecone", "vLLM", "OpenAI", "Together AI", "LangFuse", "CrewAI", "ElevenLabs", "Deepgram", "Hugging Face", "Replicate", "Fireworks AI", "Groq", "Ollama", "Chroma", "Weaviate", "Qdrant", "LlamaIndex", "Dify", "AutoGen", "Llama.cpp", "LM Studio", "LiteLLM", "DSPy", "LangGraph", "Semantic Kernel", "Spring AI", "Pydantic AI", "Mastra", "n8N", "Composio", "E2B", "Burr", "Letta", "AssemblyAI", "Cartesia", "Suno", "Vercel AI SDK", "Next.js", "React", "PostgreSQL", "Redis", "Docker", "Kubernetes", "GitHub Actions", "Vercel", "AWS", "Cloudflare", "Tailwind CSS", "Prisma", "Supabase", "Firebase")
4. Models should recommend SPECIFIC AI models with reasons (e.g., {"name": "Claude 3.5 Sonnet", "reason": "Complex reasoning for code generation"}, {"name": "GPT-4o", "reason": "Multimodal understanding"}, {"name": "Whisper", "reason": "Speech-to-text transcription"}, {"name": "Stable Diffusion XL", "reason": "Image generation"}, {"name": "Llama 3 70B", "reason": "Self-hosted private inference"})
5. Tips should be 4-6 practical, actionable insights
6. Architecture layers should be 4-6 layers covering the full stack
7. Cost estimates should be realistic for the project scope
8. Return ONLY valid JSON, no markdown formatting, no code fences`;;

    const result = await zai.chat.completions.create({
      model: 'glm-4-flash',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Analyze this app idea and create a complete development plan:\n\n"${idea}"` },
      ],
      temperature: 0.7,
      max_tokens: 4000,
    });

    const content = result.choices?.[0]?.message?.content || '';

    // Parse JSON from the response
    let plan;
    try {
      // Try direct parse
      plan = JSON.parse(content);
    } catch {
      // Try extracting JSON from markdown code fences
      const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/);
      if (jsonMatch) {
        plan = JSON.parse(jsonMatch[1].trim());
      } else {
        // Try finding JSON object in the text
        const objMatch = content.match(/\{[\s\S]*\}/);
        if (objMatch) {
          plan = JSON.parse(objMatch[0]);
        } else {
          throw new Error('Could not parse AI response as JSON');
        }
      }
    }

    // Validate and ensure minimum structure
    if (!plan.summary) plan.summary = `A development plan for: ${idea.slice(0, 100)}`;
    if (!plan.phases || !Array.isArray(plan.phases)) plan.phases = [];
    if (!plan.quickStats) plan.quickStats = [];
    if (!plan.architecture) plan.architecture = { layers: [] };
    if (!plan.costs) plan.costs = { items: [] };
    if (!plan.tips) plan.tips = [];

    return plan;
  } catch (error) {
    console.error('LLM analysis failed, using fallback:', error.message);
    return generateRuleBasedPlan(idea);
  }
}

// Fallback: Rule-based plan generation when LLM is unavailable
function generateRuleBasedPlan(idea) {
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

  // Build phases based on detected features
  const phases = [];
  const allTools = new Set();
  const allModels = [];

  // Phase 1: Planning
  phases.push({
    title: 'Project Planning & Requirements',
    category: 'Frontend & UI',
    description: 'Define the project scope, user stories, and technical requirements. Create wireframes and design the system architecture. Identify the AI capabilities needed and map them to available models and platforms from the Marq AI Directory.',
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

  // Phase 2: Frontend
  phases.push({
    title: 'Frontend Development',
    category: 'Frontend & UI',
    description: 'Build the user interface using Next.js and React with Tailwind CSS for styling. Implement responsive design, dark/light themes, and accessible components. Set up the component library and design system for consistent UI across the application.',
    tools: [
      { name: 'Next.js', icon: '⚛️' },
      { name: 'React', icon: '⚛️' },
      { name: 'Tailwind CSS', icon: '🎨' },
      { name: 'Vercel AI SDK', icon: '▲' },
    ],
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
    description: 'Develop the REST API and backend services using Node.js with Next.js API routes. Implement authentication, authorization, rate limiting, and API versioning. Set up database models with Prisma ORM and configure Redis caching for performance.',
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

  if (hasCode) {
    aiTools.push({ name: 'E2B', icon: '🖥️' });
    aiModels.push({ name: 'DeepSeek Coder V2', reason: 'Code generation and review' });
    aiModels.push({ name: 'CodeLlama 70B', reason: 'Self-hosted code model' });
    allTools.add('E2B');
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
    description: `Integrate AI models and build the core intelligence layer. ${hasChatbot ? 'Set up conversational AI with RAG for knowledge-grounded responses. ' : ''}${hasVoice ? 'Implement speech-to-text and text-to-speech pipelines. ' : ''}${hasImage ? 'Configure image generation and vision models. ' : ''}${hasSearch ? 'Build vector search and retrieval pipeline. ' : ''}Use LiteLLM for multi-provider model routing and fallbacks.`,
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
  agentTools.push({ name: 'Composio', icon: '🔌' });

  phases.push({
    title: 'Agent Development & Automation',
    category: 'Integration',
    description: `Build AI agents for automated workflows and multi-step tasks. ${hasChatbot ? 'Create conversational agents that can handle user queries with tool use. ' : ''}${hasCode ? 'Implement code analysis and review agents. ' : ''}Set up agent orchestration with fallback mechanisms and human-in-the-loop patterns for critical decisions.`,
    tools: agentTools.length > 0 ? agentTools : [{ name: 'CrewAI', icon: '👥' }, { name: 'LangGraph', icon: '🔀' }],
    models: [
      { name: 'Claude 3.5 Sonnet', reason: 'Agent reasoning and tool selection' },
      { name: 'GPT-4o', reason: 'Multi-step planning and execution' },
    ],
    deliverables: ['Agent Workflows', 'Tool Integration Layer', 'Human-in-the-loop System', 'Agent Memory'],
  });

  // Phase 6: Testing
  phases.push({
    title: 'Testing & Quality Assurance',
    category: 'Testing & QA',
    description: 'Implement comprehensive testing including unit tests, integration tests, and end-to-end tests. Use PromptFoo for LLM evaluation and RAGAS for RAG quality assessment. Set up automated CI/CD pipelines with GitHub Actions for continuous testing and deployment.',
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
  phases.push({
    title: 'Deployment & Production Launch',
    category: 'Deployment & DevOps',
    description: 'Deploy the application to production with Vercel for frontend and AWS/GCP for backend services. Set up monitoring, logging, and alerting with LangFuse and Datadog. Configure auto-scaling, CDN distribution, and production database with backup strategies.',
    tools: [
      { name: 'Vercel', icon: '▲' },
      { name: 'AWS', icon: '☁️' },
      { name: 'LangFuse', icon: '🔍' },
      { name: 'Cloudflare', icon: '🌐' },
    ],
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
  layers.push({ type: 'Infrastructure', name: 'Vercel + Cloudflare', description: 'Hosting, CDN, and edge compute' });

  // Build cost estimates
  const complexity = phases.length > 6 ? 'Medium-High' : 'Medium';
  const weekRange = phases.length > 6 ? '8-14' : '6-10';
  const aiCost = hasVoice && hasImage ? '$300-800' : hasVoice || hasImage ? '$150-400' : '$50-200';

  const tips = [
    'Start with a minimal viable product (MVP) focusing on the core AI feature before adding complexity',
    'Use LiteLLM or OpenRouter to avoid vendor lock-in and get the best pricing across AI providers',
    'Implement streaming responses for all AI interactions to improve perceived performance',
    'Set up observability (LangFuse/Helicone) from day one to monitor costs and quality',
    'Use RAG instead of fine-tuning for initial launch — it\'s faster to iterate and cheaper to run',
    'Plan for rate limiting and caching from the start to manage AI API costs at scale',
  ];

  if (hasMedical) tips.push('Ensure HIPAA compliance with data encryption and audit trails for all patient data');
  if (hasFinance) tips.push('Implement financial data validation and regulatory compliance checks in your agent pipeline');

  return {
    summary: `Your idea involves building ${hasChatbot ? 'a conversational AI system' : hasAnalytics ? 'an analytics platform' : 'an AI-powered application'} ${hasVoice ? 'with voice capabilities' : ''} ${hasImage ? 'with image generation' : ''} ${hasSearch ? 'with intelligent search' : ''}. The recommended approach uses a modern web stack with multi-provider AI routing, ${hasSearch ? 'RAG-based knowledge retrieval' : 'LLM-based processing'}, and production-grade observability.`,
    quickStats: [
      { label: 'Development Time', value: `${weekRange} weeks` },
      { label: 'AI Models', value: `${aiModels.length || 3}-${aiModels.length + 2}` },
      { label: 'Complexity', value: complexity },
      { label: 'Team Size', value: phases.length > 6 ? '4-6 devs' : '2-4 devs' },
    ],
    architecture: { layers },
    costs: {
      items: [
        { label: 'Monthly AI API', value: aiCost },
        { label: 'Infrastructure', value: '$50-200/mo' },
        { label: 'Development', value: phases.length > 6 ? '$25K-50K' : '$15K-35K' },
        { label: 'Time to MVP', value: `${weekRange} weeks` },
      ],
    },
    phases,
    tips: tips.slice(0, 6),
  };
}
