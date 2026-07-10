// Agent definitions for Marq AI Skills Platform
// Each agent has: id, name, type, description, capabilities, sampleInputs, sampleOutputs, tools, category, promptTemplates, generateResponse

export const AGENTS = [
  {
    id: 'agent-army',
    name: 'Agent Army',
    type: 'Multi-Agent Orchestrator',
    category: 'Execution',
    icon: '⚔️',
    color: '#ef4444',
    tagline: 'Deploy 3-50+ parallel agents for massive tasks',
    description: 'A 2-layer parallel execution framework where a Commander orchestrates swarms of subordinate agents. Each Layer 1 agent has its own full context window and spawns Layer 2 sub-agents. Designed for large refactors, multi-file migrations, codebase-wide audits, and bulk generation.',
    capabilities: [
      'Deploy 3 to 50+ independent agents in parallel',
      '2-layer hierarchy with Commander at top',
      '4 power levels: Max Power, Heavy, Balanced, Economy',
      'Git safety and pre-deploy gates',
      'Multi-wave execution with self-auditing',
      'Battle-tested on 60+ concurrent agents',
    ],
    bestFor: [
      'Large codebase refactors',
      'Full-site audits',
      'Bulk content generation',
      'Multi-file migrations',
      'Parallel research tasks',
    ],
    tools: ['Read', 'Write', 'Bash', 'Agent', 'Glob', 'Grep'],
    sampleInputs: [
      {
        label: 'Full Codebase Audit',
        input: 'Audit the entire codebase for security vulnerabilities, performance issues, and code quality. Use Max Power level with 15 agents.',
      },
      {
        label: 'Bulk Migration',
        input: 'Migrate all 200 API endpoints from REST to GraphQL. Use Heavy power level with 25 agents, 8 files each.',
      },
    ],
    sampleOutputs: [
      {
        label: 'Codebase Audit Report',
        output: `# Codebase Audit Report

## Agent Swarm: 15 agents | Max Power | Wave 1

### Security Findings (Agent 1-5)
| Severity | Issue | File | Line |
|----------|-------|------|------|
| 🔴 Critical | SQL Injection | api/users.js | 45 |
| 🔴 Critical | Hardcoded Secret | config/auth.js | 12 |
| 🟡 Medium | Missing CSRF Token | middleware/auth.js | 88 |
| 🟢 Low | Info Leakage in Error | api/handler.js | 23 |

### Performance Findings (Agent 6-10)
- 12 N+1 query patterns detected across user, order, and product modules
- 3 unindexed database queries (estimated 4.2s savings if indexed)
- 8 missing cache headers on static asset routes
- Bundle size: 2.4MB — recommend code splitting for 6 routes

### Code Quality (Agent 11-15)
- 47 functions exceed 50 lines (refactor recommended)
- 23 missing error handlers in async functions
- Test coverage: 34% (target: 80%)

### Wave 2 Verification: All findings confirmed ✅`,
      },
    ],
    promptTemplates: [
      'Audit my {language} codebase for security vulnerabilities',
      'Migrate {count} files from {from} to {to}',
      'Run a full performance audit on my {framework} project',
      'Generate {count} unit tests for my codebase',
    ],
    responsePattern: 'army',
  },
  {
    id: 'agent-to-agent',
    name: 'Agent-to-Agent (A2A)',
    type: 'Communication Protocol',
    category: 'Coordination',
    icon: '🔗',
    color: '#8b5cf6',
    tagline: 'Connect agents with structured message passing & handoffs',
    description: 'A communication protocol that lets multiple Marq AI agents pass messages, share context, delegate tasks, and collaborate. Implements structured handoffs, shared memory, and multi-agent conversations through a shared context file.',
    capabilities: [
      'Structured message passing between agents',
      'Shared context via .a2a-context.json',
      '5 communication patterns: request/response, pipeline, fan-out/fan-in, conversation, supervisor',
      'Formal handoff with acceptance/rejection',
      'Agent registry and capability discovery',
      'Deadlock detection and escalation',
    ],
    bestFor: [
      'Multi-agent research + writing pipelines',
      'Code review + fix workflows',
      'Sales + technical collaboration',
      'Parallel specialist consultations',
    ],
    tools: ['Read', 'Write', 'Agent', 'Bash', 'Glob', 'Grep'],
    sampleInputs: [
      {
        label: 'Research + Writing Pipeline',
        input: 'Agent A researches market trends for AI adoption. Agent B writes the executive summary. Agent C creates the slide deck.',
      },
    ],
    sampleOutputs: [
      {
        label: 'A2A Pipeline Result',
        output: `# A2A Pipeline: Market Research → Summary → Deck

## Agent A (Researcher) → Agent B (Writer)
Message: { type: "handoff", from: "researcher", data: { findings: [...] } }
Status: ✅ Accepted

### Research Findings
- AI adoption grew 35% YoY in enterprise
- Top barrier: data privacy (42% of respondents)
- ROI realized within 8 months on average

## Agent B (Writer) → Agent C (Presenter)
Message: { type: "handoff", from: "writer", data: { summary: "..." } }
Status: ✅ Accepted

### Executive Summary
The AI market is accelerating with 35% growth, but privacy concerns remain the primary adoption barrier...

## Agent C Output: 12-slide deck generated
✅ Pipeline complete | 3 agents | 2 handoffs | 0 errors`,
      },
    ],
    promptTemplates: [
      'Create a pipeline: {step1} → {step2} → {step3}',
      'Connect {agent1} with {agent2} for {task}',
      'Build a fan-out workflow for {task} with {count} agents',
      'Set up supervisor pattern for {process}',
    ],
    responsePattern: 'a2a',
  },
  {
    id: 'agent-swarm-deployer',
    name: 'Agent Swarm Deployer',
    type: 'Data Processing Swarm',
    category: 'Execution',
    icon: '🐝',
    color: '#f59e0b',
    tagline: 'Massive parallel data processing with swarms',
    description: 'Deploys swarms of sub-agents for massive parallel data processing tasks — processing 1000 documents, analyzing datasets, bulk content generation. Unlike agent-army (for code), this is for DATA tasks with configurable swarm size, task distribution, result aggregation, and error recovery.',
    capabilities: [
      'Process 100s-1000s of data items in parallel',
      'Configurable swarm size and batch distribution',
      'Result aggregation with completeness validation',
      'Retry strategy and error recovery',
      'Multiple output formats: CSV, JSON, Markdown',
      'Progress tracking across all swarm members',
    ],
    bestFor: [
      'Bulk document processing',
      'Dataset analysis at scale',
      'Mass content generation',
      'Sentiment analysis on reviews',
      'Lead scoring batch jobs',
    ],
    tools: ['Read', 'Write', 'Bash', 'Agent', 'Glob', 'Grep'],
    sampleInputs: [
      {
        label: 'Sentiment Analysis',
        input: 'Analyze sentiment for all 2,500 customer reviews in /data/reviews/. Output as CSV with columns: review_id, sentiment, confidence, keywords.',
      },
    ],
    sampleOutputs: [
      {
        label: 'Swarm Processing Report',
        output: `# Swarm Processing Complete

## Configuration
- Swarm size: 10 agents | Batch size: 250 reviews/agent
- Total items: 2,500 | Processed: 2,500 ✅ | Failed: 0

## Results Summary
| Sentiment | Count | Percentage |
|-----------|-------|-----------|
| Positive  | 1,823 | 72.9%     |
| Neutral   | 412   | 16.5%     |
| Negative  | 265   | 10.6%     |

## Top Keywords
1. "easy to use" (847 mentions) — Positive
2. "great support" (623 mentions) — Positive
3. "slow loading" (189 mentions) — Negative
4. "pricing" (156 mentions) — Mixed

## Output Files
- /output/sentiment-results.csv (2,500 rows)
- /output/sentiment-summary.json
- /output/failed-items.log (0 entries)`,
      },
    ],
    promptTemplates: [
      'Process {count} {document_type} files and extract {fields}',
      'Analyze sentiment of {count} {source} reviews',
      'Batch generate {content_type} for {count} items',
      'Score and rank {count} leads from {source}',
    ],
    responsePattern: 'swarm',
  },
  {
    id: 'agent-team-builder',
    name: 'Agent Team Builder',
    type: 'Team Designer',
    category: 'Design',
    icon: '🏗️',
    color: '#3b82f6',
    tagline: 'Design custom agent teams for business workflows',
    description: 'Designs and deploys custom agent team configurations for business workflows through interactive discovery. Generates complete team configs with specialized agent roles, tool access, communication protocols, and handoff rules.',
    capabilities: [
      'Interactive business process discovery',
      'Pre-built team templates: Sales, Support, Research, Content',
      'Custom agent role definitions with tool access',
      'A2A messaging and handoff rules',
      'YAML team-config output',
      'Scaling and load balancing config',
    ],
    bestFor: [
      'Building sales automation teams',
      'Designing customer support workflows',
      'Creating research pipelines',
      'Content production lines',
    ],
    tools: ['Read', 'Write', 'Bash', 'Glob'],
    sampleInputs: [
      {
        label: 'Sales Team Design',
        input: 'Build a sales team that handles: lead qualification, outreach, demo scheduling, proposal generation, and follow-up.',
      },
    ],
    sampleOutputs: [
      {
        label: 'Team Configuration',
        output: `# Sales Team Configuration

## Agents
| Role | Agent | Tools | Handles |
|------|-------|-------|---------|
| Lead Qualifier | agent-lead | Read, Grep, WebSearch | Score leads, verify ICP fit |
| Outreach Specialist | agent-outreach | Write, WebSearch | Email sequences, personalization |
| Demo Coordinator | agent-demo | Read, Write, Bash | Calendar, prep docs, reminders |
| Proposal Writer | agent-proposal | Read, Write | SOW generation, pricing calc |
| Follow-up Manager | agent-followup | Read, Write, Bash | Cadence, deal tracking |

## Handoff Flow
lead-qualifier → [score > 70] → outreach-specialist → demo-coordinator → proposal-writer → followup-manager

## Communication: A2A protocol
## Config: team-config.yaml generated ✅`,
      },
    ],
    promptTemplates: [
      'Build a {department} team for {business_type}',
      'Design a customer support team with {channels} channels',
      'Create a {process} workflow with agent handoffs',
      'Configure a research team for {domain} analysis',
    ],
    responsePattern: 'team',
  },
  {
    id: 'sub-agent-orchestrator',
    name: 'Sub-Agent Orchestrator',
    type: 'Pipeline Orchestrator',
    category: 'Execution',
    icon: '🎭',
    color: '#6366f1',
    tagline: 'Sequential & parallel agent pipelines with YAML workflows',
    description: 'Manages parent/child agent relationships with task delegation and result aggregation. Supports sequential chains, parallel fans, conditional routing, retry logic, timeout handling, and YAML-based visual workflow definition. Output of Agent A feeds into Agent B.',
    capabilities: [
      '6 workflow patterns: sequential, parallel, conditional, loop, map-reduce, fan-out',
      'YAML workflow definition language',
      'Retry, timeout, and validation per step',
      'Visual workflow diagrams',
      'Reusable workflow templates',
      'Heterogeneous pipeline coordination',
    ],
    bestFor: [
      'Research-to-proposal pipelines',
      'Multi-step data processing',
      'Code review + fix workflows',
      'Content creation chains',
    ],
    tools: ['Read', 'Write', 'Agent', 'Bash'],
    sampleInputs: [
      {
        label: 'Research Pipeline',
        input: 'Run pipeline: research → summarize → create slides → generate speaker notes. Each step feeds the next.',
      },
    ],
    sampleOutputs: [
      {
        label: 'Pipeline Execution Log',
        output: `# Pipeline: Research → Slides

## Step 1: Research Agent ⏱️ 45s
Status: ✅ Complete
Output: 15 research findings on AI market trends

## Step 2: Summary Agent ⏱️ 12s  
Status: ✅ Complete
Input: 15 findings → Output: 5-page executive summary

## Step 3: Slide Generator ⏱️ 30s
Status: ✅ Complete
Input: Summary → Output: 12-slide presentation outline

## Step 4: Speaker Notes Agent ⏱️ 18s
Status: ✅ Complete
Input: 12 slides → Output: Full speaker notes per slide

## Pipeline Result
Total time: 105s | Steps: 4 | Retries: 0 | Output: /output/presentation/
✅ All steps validated and complete`,
      },
    ],
    promptTemplates: [
      'Run pipeline: {step1} → {step2} → {step3}',
      'Create a map-reduce workflow for {task}',
      'Build a conditional pipeline for {process}',
      'Orchestrate {count} agents for {objective}',
    ],
    responsePattern: 'orchestrator',
  },
  {
    id: 'scout',
    name: 'Scout Agent',
    type: 'Meta-Agent',
    category: 'Navigation',
    icon: '🔭',
    color: '#14b8a6',
    tagline: 'Recommends the best skill or agent for any task',
    description: 'A meta-agent that analyzes conversation context and recommends the most effective skills and subagents. Suggests single best tools or combinations, explains reasoning, and outlines execution plans.',
    capabilities: [
      'Context-aware skill recommendation',
      'Multi-skill workflow suggestions',
      'Execution plan creation',
      'Reasoning for each recommendation',
      'Available subagent awareness',
    ],
    bestFor: [
      'Finding the right tool for a task',
      'Discovering capabilities you didn\'t know existed',
      'Planning multi-step workflows',
    ],
    tools: ['Read', 'Glob', 'Grep', 'WebFetch', 'WebSearch'],
    sampleInputs: [
      { label: 'Task Query', input: 'I need to audit my website for SEO issues and create a content plan.' },
    ],
    sampleOutputs: [
      {
        label: 'Scout Recommendation',
        output: `# Scout Recommendation

## Primary Skills
1. **seo-optimizer** — Full SEO audit (keywords, readability, competitors)
2. **seo-keyword-cluster-builder** — Build topic cluster architecture
3. **landing-page-optimizer** — Fix conversion and performance issues

## Workflow Plan
Step 1: Run seo-optimizer on your site → get audit report
Step 2: Feed keywords into keyword-cluster-builder → topic map
Step 3: Use content-repurposer to generate plan from topics

## Why These?
seo-optimizer covers technical + content SEO, keyword-cluster provides strategy, and content-repurposer turns strategy into execution.`,
      },
    ],
    promptTemplates: [
      'What skill should I use for {task}?',
      'Find the best agent combination for {objective}',
      'Recommend a workflow for {scenario}',
      'I need help with {task}, what tools are available?',
    ],
    responsePattern: 'scout',
  },
  {
    id: 'scout-pro',
    name: 'Scout Pro',
    type: 'Advanced Meta-Agent',
    category: 'Navigation',
    icon: '🔍',
    color: '#ec4899',
    tagline: 'Deep context analysis, skill chains, and usage learning',
    description: 'Enhanced skill navigator that maps conversation history, recommends multi-skill chains, identifies patterns from past usage, and learns from session outcomes. Goes beyond basic Scout with deep context analysis and workflow orchestration.',
    capabilities: [
      'Full conversation history mapping',
      'Multi-skill chain recommendations',
      'Pattern recognition from usage',
      'Learning log of what works',
      'Proactive tips based on context',
      'Custom chain builder',
    ],
    bestFor: [
      'Complex multi-step tasks',
      'Learning optimal skill combinations',
      'Getting proactive recommendations',
    ],
    tools: ['Read', 'Glob', 'Grep', 'WebFetch', 'WebSearch'],
    sampleInputs: [
      { label: 'Complex Request', input: 'We need to launch a new product — help us plan the full GTM strategy.' },
    ],
    sampleOutputs: [
      {
        label: 'Scout Pro Chain',
        output: `# Scout Pro: GTM Chain Recommendation

## Detected Pattern: Product Launch (confidence: 94%)
Based on 47 similar sessions in learning log.

## Recommended Skill Chain
1. market-sizing → Validate TAM/SAM/SOM
2. competitor-intel-agent → Analyze competitor positioning
3. landing-page-copywriter → Craft messaging
4. cold-email-sequence-generator → Build outreach
5. sales-methodology-implementer → Set sales process
6. product-launch-war-room → Go/no-go decision

## Learning Insight
Teams that run market-sizing BEFORE competitor analysis have 2.3x better positioning accuracy.

## Proactive Tip
Consider adding pricing-strategy as step 3 — 78% of successful launches defined pricing before messaging.`,
      },
    ],
    promptTemplates: [
      'Plan a full strategy for {objective}',
      'What skill chain works best for {scenario}?',
      'Analyze my context and recommend next steps for {task}',
      'Build a custom chain for {process} with learning insights',
    ],
    responsePattern: 'scout_pro',
  },
  {
    id: 'skill-navigator',
    name: 'Skill Navigator',
    type: 'Guide',
    category: 'Navigation',
    icon: '🧭',
    color: '#64748b',
    tagline: 'Your intelligent guide to all 173+ skills',
    description: 'The master skill navigator and orchestrator with knowledge of all 173+ Marq AI skills. Recommends the perfect skill for any task, creates skill combinations, and helps discover capabilities you didn\'t know you had.',
    capabilities: [
      'Knowledge of all 173+ skills',
      'Skill combination recommendations',
      'Example prompts for each skill',
      'Related skill suggestions',
      'Category-based browsing guidance',
    ],
    bestFor: [
      'Exploring the full skill library',
      'Finding unexpected skill synergies',
      'Getting started with the platform',
    ],
    tools: ['Read', 'Glob', 'Grep'],
    sampleInputs: [
      { label: 'Exploration', input: 'What can I do with the marketing skills?' },
    ],
    sampleOutputs: [
      {
        label: 'Skill Map',
        output: `# Marketing Skill Map

## Content Creation (8 skills)
- landing-page-copywriter → High-converting copy (PAS, AIDA)
- brand-voice-analyzer → Extract your brand voice
- content-repurposer → 1 piece → 8+ formats
- social-selling-content-generator → LinkedIn posts

## SEO & Discovery (3 skills)
- seo-optimizer → Full audit
- seo-keyword-cluster-builder → Topic architecture
- competitor-content-analyzer → Track competitors

## Recommended Combination
brand-voice-analyzer + landing-page-copywriter = on-brand, high-converting pages`,
      },
    ],
    promptTemplates: [
      'Show me all skills for {category}',
      'What skills work well together for {task}?',
      'Help me discover capabilities for {domain}',
      'Map the skill landscape for {industry}',
    ],
    responsePattern: 'navigator',
  },
  {
    id: 'skill-composer-studio',
    name: 'Skill Composer Studio',
    type: 'Workflow Builder',
    category: 'Design',
    icon: '🎵',
    color: '#f97316',
    tagline: 'Chain skills into custom multi-step workflows',
    description: 'Chain multiple existing skills into custom multi-step workflows with automatic handoffs. Output from step N becomes input for step N+1. Support conditional logic (if-then-else based on outputs), error handling, and complete composite skill definitions.',
    capabilities: [
      'Programmable skill combinations',
      'Automatic handoffs between steps',
      'Conditional logic (if-then-else)',
      'Data transformation between steps',
      'Error case handling',
      'Composite skill definition output',
    ],
    bestFor: [
      'Creating repeatable workflows',
      'Building custom automation pipelines',
      'Combining skills for complex tasks',
    ],
    tools: ['Read', 'Write', 'Agent', 'Bash'],
    sampleInputs: [
      { label: 'Custom Workflow', input: 'Create a workflow: research competitors → analyze gaps → write positioning doc → generate email sequence.' },
    ],
    sampleOutputs: [
      {
        label: 'Composed Workflow',
        output: `# Workflow: Competitive Positioning

## Step 1: competitor-intel-agent
Input: Company name + market
Output: Competitor analysis report

## Step 2: market-sizing (conditional)
IF market_size > $1B → Continue to step 3
ELSE → Flag as niche market, adjust strategy

## Step 3: landing-page-copywriter
Input: Gap analysis from step 1-2
Output: Positioning document

## Step 4: cold-email-sequence-generator
Input: Positioning doc
Output: 5-email outreach sequence

## Execution
→ Step 1 complete (3 competitors found)
→ Step 2: TAM = $4.2B → Condition met ✅
→ Step 3: Positioning doc generated
→ Step 4: 5 emails ready
✅ Workflow complete | 4 steps | 0 errors`,
      },
    ],
    promptTemplates: [
      'Compose a workflow: {step1} → {step2} → {step3}',
      'Build an automation pipeline for {process}',
      'Create a conditional workflow for {scenario}',
      'Chain these skills: {skills_list}',
    ],
    responsePattern: 'composer',
  },
];

export const AGENT_CATEGORIES = {
  'Execution': { icon: '⚡', color: '#ef4444', description: 'Agents that execute tasks at scale' },
  'Coordination': { icon: '🔗', color: '#8b5cf6', description: 'Agents that coordinate between other agents' },
  'Design': { icon: '🎨', color: '#3b82f6', description: 'Agents that design and configure systems' },
  'Navigation': { icon: '🧭', color: '#14b8a6', description: 'Agents that help you find the right tools' },
};

// Role-based agent access
export const AGENT_ACCESS = {
  admin: ['Execution', 'Coordination', 'Design', 'Navigation'],
  manager: ['Execution', 'Coordination', 'Design', 'Navigation'],
  editor: ['Execution', 'Design', 'Navigation'],
  viewer: ['Navigation'],
};

export function getAgentsByCategory() {
  const grouped = {};
  for (const agent of AGENTS) {
    if (!grouped[agent.category]) grouped[agent.category] = [];
    grouped[agent.category].push(agent);
  }
  return grouped;
}

export function getAgentById(id) {
  return AGENTS.find(a => a.id === id) || null;
}

export function getAccessibleAgents(role) {
  const accessibleCategories = AGENT_ACCESS[role] || AGENT_ACCESS.viewer;
  return AGENTS.filter(a => accessibleCategories.includes(a.category));
}

export function getAccessibleAgentCategories(role) {
  const accessibleCategories = AGENT_ACCESS[role] || AGENT_ACCESS.viewer;
  const filtered = {};
  for (const [cat, meta] of Object.entries(AGENT_CATEGORIES)) {
    if (accessibleCategories.includes(cat)) {
      filtered[cat] = meta;
    }
  }
  return filtered;
}

// Generate simulated agent responses based on prompt and agent type
export function generateAgentResponse(agentId, prompt) {
  const agent = getAgentById(agentId);
  if (!agent) return { error: 'Agent not found' };

  const pattern = agent.responsePattern;
  const timestamp = new Date().toISOString();

  switch (pattern) {
    case 'army':
      return generateArmyResponse(agent, prompt, timestamp);
    case 'a2a':
      return generateA2AResponse(agent, prompt, timestamp);
    case 'swarm':
      return generateSwarmResponse(agent, prompt, timestamp);
    case 'team':
      return generateTeamResponse(agent, prompt, timestamp);
    case 'orchestrator':
      return generateOrchestratorResponse(agent, prompt, timestamp);
    case 'scout':
      return generateScoutResponse(agent, prompt, timestamp);
    case 'scout_pro':
      return generateScoutProResponse(agent, prompt, timestamp);
    case 'navigator':
      return generateNavigatorResponse(agent, prompt, timestamp);
    case 'composer':
      return generateComposerResponse(agent, prompt, timestamp);
    default:
      return generateGenericResponse(agent, prompt, timestamp);
  }
}

function generateArmyResponse(agent, prompt, timestamp) {
  const agentCount = prompt.match(/(\d+)/)?.[0] || Math.floor(Math.random() * 15) + 5;
  const powerLevel = prompt.toLowerCase().includes('max') ? 'Max Power' : prompt.toLowerCase().includes('heavy') ? 'Heavy' : prompt.toLowerCase().includes('economy') ? 'Economy' : 'Balanced';

  return {
    agentId: agent.id,
    agentName: agent.name,
    timestamp,
    status: 'completed',
    executionTime: `${Math.floor(Math.random() * 120) + 30}s`,
    output: `# ${agent.name} Execution Report

## Deployment Configuration
- Power Level: ${powerLevel}
- Agents Deployed: ${agentCount}
- Wave Strategy: 2-wave with self-audit
- Git Safety: Enabled ✅

## Wave 1 — Primary Execution (${agentCount} agents)

### Agent Assignments
| Agent | Task | Status | Duration |
|-------|------|--------|----------|
| Agent 1-${Math.ceil(agentCount/3)} | Analysis & Discovery | ✅ Complete | ${Math.floor(Math.random()*30)+10}s |
| Agent ${Math.ceil(agentCount/3)+1}-${Math.ceil(agentCount*2/3)} | Processing & Execution | ✅ Complete | ${Math.floor(Math.random()*45)+15}s |
| Agent ${Math.ceil(agentCount*2/3)+1}-${agentCount} | Validation & Quality Check | ✅ Complete | ${Math.floor(Math.random()*20)+8}s |

### Results Summary
- Total items processed: ${agentCount * Math.floor(Math.random()*50+10)}
- Critical findings: ${Math.floor(Math.random()*5)+1}
- Warnings: ${Math.floor(Math.random()*10)+3}
- Optimizations suggested: ${Math.floor(Math.random()*15)+5}

## Wave 2 — Verification & Cross-Audit
All Wave 1 results verified across agents.
Consistency score: ${(95 + Math.random()*5).toFixed(1)}%

## Final Status
✅ All ${agentCount} agents completed successfully
✅ Self-audit passed
✅ Results aggregated and validated
Output saved to: /output/agent-army-${Date.now()}/`,
  };
}

function generateA2AResponse(agent, prompt, timestamp) {
  const agents = ['Researcher', 'Writer', 'Analyst', 'Presenter', 'Reviewer'];
  const numAgents = Math.min(agents.length, Math.max(2, (prompt.match(/agent/gi) || []).length || 3));
  const usedAgents = agents.slice(0, numAgents);

  let handoffs = '';
  for (let i = 0; i < usedAgents.length - 1; i++) {
    handoffs += `
## Handoff ${i + 1}: ${usedAgents[i]} → ${usedAgents[i + 1]}
\`\`\`json
{
  "type": "handoff",
  "from": "${usedAgents[i].toLowerCase()}",
  "to": "${usedAgents[i + 1].toLowerCase()}",
  "status": "accepted",
  "context_size": "${Math.floor(Math.random() * 5000 + 1000)} tokens",
  "data": { "findings": ${Math.floor(Math.random() * 20 + 3)}, "confidence": ${(0.8 + Math.random() * 0.2).toFixed(2)} }
}
\`\`\`
✅ Accepted by ${usedAgents[i + 1]} at +${(i + 1) * Math.floor(Math.random() * 15 + 5)}s`;
  }

  return {
    agentId: agent.id,
    agentName: agent.name,
    timestamp,
    status: 'completed',
    executionTime: `${Math.floor(Math.random() * 60) + 20}s`,
    output: `# A2A Pipeline Execution

## Protocol: Agent-to-Agent Communication
- Communication Pattern: Pipeline
- Context File: .a2a-context.json
- Agents in Pipeline: ${numAgents} (${usedAgents.join(', ')})
- Deadlock Detection: Active ✅

${handoffs}

## Shared Context Summary
- Total context exchanged: ${(numAgents * Math.floor(Math.random() * 3000 + 500))} tokens
- Handoffs completed: ${numAgents - 1}
- Handoffs rejected: 0
- Deadlocks detected: 0

## Pipeline Output
All agents completed their tasks. Final output from ${usedAgents[usedAgents.length - 1]} aggregated successfully.

✅ Pipeline complete | ${numAgents} agents | ${numAgents - 1} handoffs | 0 errors`,
  };
}

function generateSwarmResponse(agent, prompt, timestamp) {
  const itemCount = parseInt(prompt.match(/(\d{1,3}(?:,\d{3})*)/)?.[1]?.replace(/,/g, '') || '') || Math.floor(Math.random() * 2000 + 500);
  const swarmSize = Math.max(3, Math.min(20, Math.ceil(itemCount / 250)));
  const batchSize = Math.ceil(itemCount / swarmSize);
  const positivePct = (60 + Math.random() * 25).toFixed(1);
  const neutralPct = ((100 - parseFloat(positivePct)) * 0.5).toFixed(1);
  const negativePct = (100 - parseFloat(positivePct) - parseFloat(neutralPct)).toFixed(1);

  return {
    agentId: agent.id,
    agentName: agent.name,
    timestamp,
    status: 'completed',
    executionTime: `${Math.floor(Math.random() * 180) + 60}s`,
    output: `# Swarm Processing Report

## Swarm Configuration
- Swarm Size: ${swarmSize} agents
- Batch Size: ${batchSize} items/agent
- Total Items: ${itemCount.toLocaleString()}
- Retry Strategy: 3 attempts with exponential backoff
- Output Format: CSV + JSON summary

## Processing Results
| Metric | Value |
|--------|-------|
| Processed | ${itemCount.toLocaleString()} ✅ |
| Failed | ${Math.floor(Math.random() * 5)} |
| Success Rate | ${(99 + Math.random()).toFixed(1)}% |
| Avg Processing Time | ${(itemCount/swarmSize * 0.05).toFixed(1)}s/agent |

## Analysis Summary
| Category | Count | Percentage |
|----------|-------|-----------|
| Positive | ${Math.floor(itemCount * parseFloat(positivePct) / 100).toLocaleString()} | ${positivePct}% |
| Neutral | ${Math.floor(itemCount * parseFloat(neutralPct) / 100).toLocaleString()} | ${neutralPct}% |
| Negative | ${Math.floor(itemCount * parseFloat(negativePct) / 100).toLocaleString()} | ${negativePct}% |

## Top Insights
1. Strong positive trend detected across ${Math.floor(Math.random() * 5 + 3)} key themes
2. ${Math.floor(Math.random() * 10 + 2)} outlier patterns identified for review
3. Confidence level: ${(85 + Math.random() * 10).toFixed(1)}%

## Output Files
- /output/swarm-results.csv (${itemCount.toLocaleString()} rows)
- /output/swarm-summary.json
- /output/swarm-metadata.yaml

✅ Swarm processing complete | ${swarmSize} agents | ${itemCount.toLocaleString()} items processed`,
  };
}

function generateTeamResponse(agent, prompt, timestamp) {
  const isSales = prompt.toLowerCase().includes('sales');
  const isSupport = prompt.toLowerCase().includes('support');
  const isResearch = prompt.toLowerCase().includes('research');

  let teamConfig;
  if (isSales) {
    teamConfig = `| Lead Qualifier | agent-lead-qualifier | Read, Grep, WebSearch | Score leads, verify ICP fit |
| Outreach Specialist | agent-outreach | Write, WebSearch | Email sequences, personalization |
| Demo Coordinator | agent-demo | Read, Write, Bash | Calendar, prep docs, reminders |
| Proposal Writer | agent-proposal | Read, Write | SOW generation, pricing calc |
| Follow-up Manager | agent-followup | Read, Write, Bash | Cadence, deal tracking |`;
  } else if (isSupport) {
    teamConfig = `| Triage Agent | agent-triage | Read, Grep | Classify tickets, route to specialist |
| Knowledge Base Agent | agent-kb | Read, Glob, Grep | Search docs, suggest solutions |
| Escalation Agent | agent-escalate | Read, Write, Agent | Handle complex cases, notify humans |
| Feedback Agent | agent-feedback | Read, Write | Collect satisfaction, analyze trends |`;
  } else if (isResearch) {
    teamConfig = `| Discovery Agent | agent-discover | WebSearch, WebFetch | Find sources, gather data |
| Analysis Agent | agent-analyze | Read, Grep, Bash | Process data, identify patterns |
| Synthesis Agent | agent-synthesize | Read, Write | Combine findings, create reports |
| Quality Agent | agent-quality | Read, Glob | Verify citations, fact-check |`;
  } else {
    teamConfig = `| Coordinator | agent-coord | Read, Write, Agent | Manage workflow, delegate tasks |
| Specialist A | agent-spec-a | Read, Write, Bash | Handle primary processing |
| Specialist B | agent-spec-b | Read, Grep, Glob | Secondary analysis |
| Reviewer | agent-review | Read, Write | Quality assurance |`;
  }

  return {
    agentId: agent.id,
    agentName: agent.name,
    timestamp,
    status: 'completed',
    executionTime: `${Math.floor(Math.random() * 15) + 5}s`,
    output: `# Team Configuration Generated

## Discovery Results
Based on your prompt, I detected the following requirements:
- Process type: ${isSales ? 'Sales Pipeline' : isSupport ? 'Customer Support' : isResearch ? 'Research Pipeline' : 'General Workflow'}
- Automation level: High
- Communication protocol: A2A with structured handoffs

## Team Members
| Role | Agent ID | Tools | Handles |
|------|----------|-------|---------|
${teamConfig}

## Handoff Rules
\`\`\`yaml
communication:
  protocol: a2a
  context_file: .a2a-context.json
  handoff_rules:
    - from: coordinator
      to: specialist
      condition: task_assigned
      timeout: 30s
    - from: specialist
      to: reviewer
      condition: output_ready
      timeout: 60s
\`\`\`

## Scaling Configuration
- Min agents: 2
- Max agents: 10
- Auto-scale threshold: 80% capacity

✅ Team config saved to: team-config.yaml
Ready for deployment.`,
  };
}

function generateOrchestratorResponse(agent, prompt, timestamp) {
  const steps = prompt.split(/[→>]/).map(s => s.trim()).filter(Boolean);
  const numSteps = Math.max(3, steps.length || 4);
  const stepNames = steps.length >= 3 ? steps : ['Research', 'Analyze', 'Process', 'Generate'].slice(0, numSteps);

  let pipelineSteps = '';
  let totalTime = 0;
  for (let i = 0; i < stepNames.length; i++) {
    const duration = Math.floor(Math.random() * 40) + 10;
    totalTime += duration;
    pipelineSteps += `
## Step ${i + 1}: ${stepNames[i]} ⏱️ ${duration}s
Status: ✅ Complete
${i > 0 ? `Input: Output from Step ${i}` : 'Input: User prompt'}
Output: ${stepNames[i].toLowerCase()} results (${Math.floor(Math.random() * 50 + 5)} items)
${i < stepNames.length - 1 ? `→ Feeding into Step ${i + 2}...` : '→ Final output'}`;
  }

  return {
    agentId: agent.id,
    agentName: agent.name,
    timestamp,
    status: 'completed',
    executionTime: `${totalTime}s`,
    output: `# Pipeline Execution Log

## Pipeline Definition
\`\`\`yaml
pipeline:
  name: custom-pipeline
  steps: ${numSteps}
  pattern: sequential
  retry: 3
  timeout: 120s
\`\`\`
${pipelineSteps}

## Pipeline Summary
- Total Steps: ${numSteps}
- Total Time: ${totalTime}s
- Retries: 0
- Errors: 0
- All validations: ✅ Passed

✅ Pipeline complete | Output saved to /output/pipeline-${Date.now()}/`,
  };
}

function generateScoutResponse(agent, prompt, timestamp) {
  const skillMap = {
    'seo': ['seo-optimizer', 'seo-keyword-cluster-builder', 'landing-page-optimizer'],
    'sales': ['deal-closer-playbook', 'pipeline-health-analyzer', 'cold-email-sequence-generator'],
    'marketing': ['landing-page-copywriter', 'brand-voice-analyzer', 'content-repurposer'],
    'code': ['code-review-pro', 'api-load-tester', 'test-coverage-improver'],
    'security': ['compliance-checker', 'security-pentest-planner', 'tech-due-diligence'],
    'research': ['market-sizing', 'competitor-intel-agent', 'customer-review-aggregator'],
  };

  const matchedCategory = Object.keys(skillMap).find(k => prompt.toLowerCase().includes(k)) || 'research';
  const skills = skillMap[matchedCategory];

  return {
    agentId: agent.id,
    agentName: agent.name,
    timestamp,
    status: 'completed',
    executionTime: `${Math.floor(Math.random() * 10) + 3}s`,
    output: `# Scout Recommendation

## Task Analysis
Prompt: "${prompt}"
Detected intent: ${matchedCategory.charAt(0).toUpperCase() + matchedCategory.slice(1)} task
Confidence: ${(85 + Math.random() * 10).toFixed(1)}%

## Recommended Skills
${skills.map((s, i) => `${i + 1}. **${s}** — Best for ${matchedCategory} tasks`).join('\n')}

## Workflow Plan
Step 1: Run ${skills[0]} → Initial analysis
Step 2: Feed results into ${skills[1]} → Deep processing
Step 3: Use ${skills[2]} → Final output generation

## Why These Skills?
These ${skills.length} skills form a natural pipeline for ${matchedCategory} work. The first provides data, the second adds depth, and the third produces actionable results.

## Alternative Options
- If you need faster results: Use ${skills[0]} alone
- If you need more depth: Add market-sizing before ${skills[0]}
- If you need team coordination: Wrap in agent-team-builder`,
  };
}

function generateScoutProResponse(agent, prompt, timestamp) {
  return {
    agentId: agent.id,
    agentName: agent.name,
    timestamp,
    status: 'completed',
    executionTime: `${Math.floor(Math.random() * 15) + 5}s`,
    output: `# Scout Pro: Deep Analysis

## Context Mapping
- Full conversation analyzed
- ${Math.floor(Math.random() * 20 + 5)} relevant context points identified
- Task classification: Multi-step (confidence: ${(90 + Math.random() * 8).toFixed(1)}%)

## Pattern Detection
Based on ${Math.floor(Math.random() * 100 + 30)} similar sessions:
- Primary pattern: ${['Product Launch', 'Market Entry', 'Process Optimization', 'Content Strategy'][Math.floor(Math.random() * 4)]}
- Success rate with recommended chain: ${(75 + Math.random() * 20).toFixed(1)}%

## Recommended Skill Chain
1. **market-sizing** → Validate market opportunity (${Math.floor(Math.random() * 20 + 10)}s)
2. **competitor-intel-agent** → Analyze competitive landscape (${Math.floor(Math.random() * 30 + 15)}s)
3. **landing-page-copywriter** → Craft positioning (${Math.floor(Math.random() * 25 + 10)}s)
4. **cold-email-sequence-generator** → Build outreach (${Math.floor(Math.random() * 20 + 8)}s)
5. **sales-methodology-implementer** → Set process (${Math.floor(Math.random() * 20 + 10)}s)

## Learning Insights
- Teams that start with market validation have 2.3x better outcomes
- Adding competitor analysis before copywriting increases conversion by 34%
- 78% of successful projects included a review step

## Proactive Tips
1. Consider adding **pricing-strategy** between steps 2-3
2. **product-launch-war-room** can coordinate the final go/no-go
3. Use **skill-composer-studio** to save this chain as a reusable workflow

✅ Analysis complete | 5 skills recommended | 3 learning insights`,
  };
}

function generateNavigatorResponse(agent, prompt, timestamp) {
  const category = prompt.toLowerCase().includes('market') ? 'Marketing' :
                   prompt.toLowerCase().includes('sales') ? 'Sales' :
                   prompt.toLowerCase().includes('engineer') || prompt.toLowerCase().includes('code') ? 'Engineering' :
                   prompt.toLowerCase().includes('security') ? 'Security' : 'All';

  const categorySkills = {
    'Marketing': ['landing-page-copywriter', 'brand-voice-analyzer', 'content-repurposer', 'seo-optimizer', 'social-selling-content-generator'],
    'Sales': ['deal-closer-playbook', 'pipeline-health-analyzer', 'cold-email-sequence-generator', 'lead-scoring-model', 'objection-pattern-detector'],
    'Engineering': ['code-review-pro', 'api-load-tester', 'test-coverage-improver', 'docker-debugger', 'performance-profiler'],
    'Security': ['compliance-checker', 'security-pentest-planner', 'tech-due-diligence', 'contract-analyzer'],
    'All': ['market-sizing', 'workflow-automator', 'okr-generator', 'knowledge-base-builder'],
  };

  const skills = categorySkills[category] || categorySkills['All'];

  return {
    agentId: agent.id,
    agentName: agent.name,
    timestamp,
    status: 'completed',
    executionTime: `${Math.floor(Math.random() * 5) + 2}s`,
    output: `# Skill Map: ${category}

## Available Skills (${skills.length})
${skills.map((s, i) => `${i + 1}. **${s}** → ${getSkillBrief(s)}`).join('\n')}

## Skill Combinations
- ${skills[0]} + ${skills[1]} = Enhanced ${category.toLowerCase()} pipeline
- ${skills[2]} + ${skills[Math.min(3, skills.length - 1)]} = End-to-end ${category.toLowerCase()} workflow

## Getting Started
1. Start with **${skills[0]}** for immediate value
2. Add **${skills[1]}** for deeper analysis
3. Combine with **skill-composer-studio** for automation

## Related Categories
${category !== 'All' ? `- See also: Sales, Marketing, Engineering, Security, Strategy` : `- Browse by category in the Skills section`}

✅ ${skills.length} skills mapped for ${category}`,
  };
}

function generateComposerResponse(agent, prompt, timestamp) {
  const steps = prompt.split(/[→>]/).map(s => s.trim()).filter(Boolean);
  const numSteps = Math.max(3, steps.length || 4);
  const stepNames = steps.length >= 3 ? steps : ['Research', 'Analyze', 'Generate', 'Review'].slice(0, numSteps);

  let workflowDef = '';
  let execution = '';
  for (let i = 0; i < stepNames.length; i++) {
    const skillName = stepNames[i].toLowerCase().replace(/\s+/g, '-');
    workflowDef += `
### Step ${i + 1}: ${skillName}
- Input: ${i === 0 ? 'User prompt' : `Output from Step ${i}`}
- Output: ${stepNames[i].toLowerCase()} results
${i === 1 ? '- Condition: IF results_count > 0 → Continue ELSE → Error path' : ''}`;
    execution += `\n→ Step ${i + 1}: ${stepNames[i]} ${['complete', 'done', 'finished'][Math.floor(Math.random() * 3)]} ✅`;
  }

  return {
    agentId: agent.id,
    agentName: agent.name,
    timestamp,
    status: 'completed',
    executionTime: `${Math.floor(Math.random() * 30) + 10}s`,
    output: `# Composed Workflow

## Workflow Definition
\`\`\`yaml
workflow:
  name: custom-workflow
  steps: ${numSteps}
  error_handling: retry_with_fallback
  timeout: 120s per step
\`\`\`
${workflowDef}

## Execution Log${execution}

## Error Handling
- Step-level retry: 3 attempts
- Fallback: Skip and continue with partial results
- Timeout: 120s per step

## Composite Skill Definition
\`\`\`yaml
composite_skill:
  id: custom-workflow
  name: "${stepNames.join(' → ')}"
  steps: ${numSteps}
  reusable: true
\`\`\`

✅ Workflow composed | ${numSteps} steps | Saved as reusable skill`,
  };
}

function generateGenericResponse(agent, prompt, timestamp) {
  return {
    agentId: agent.id,
    agentName: agent.name,
    timestamp,
    status: 'completed',
    executionTime: `${Math.floor(Math.random() * 30) + 10}s`,
    output: `# ${agent.name} Response

## Processing Prompt
"${prompt}"

## Analysis
Based on your input, ${agent.name} has analyzed the request and generated the following output:

### Key Findings
1. Primary task identified: Processing your request
2. Recommended approach: Multi-step execution
3. Confidence level: ${(85 + Math.random() * 10).toFixed(1)}%

### Results
- Task completed successfully
- ${Math.floor(Math.random() * 20 + 3)} items processed
- 0 errors encountered

✅ Execution complete`,
  };
}

function getSkillBrief(skillName) {
  const briefs = {
    'landing-page-copywriter': 'High-converting landing page copy',
    'brand-voice-analyzer': 'Extract and codify brand voice',
    'content-repurposer': '1 content piece → 8+ formats',
    'seo-optimizer': 'Full SEO audit and optimization',
    'social-selling-content-generator': 'LinkedIn and social posts',
    'deal-closer-playbook': 'Win more deals with proven frameworks',
    'pipeline-health-analyzer': 'Diagnose pipeline issues',
    'cold-email-sequence-generator': 'Multi-touch email sequences',
    'lead-scoring-model': 'Prioritize your best leads',
    'objection-pattern-detector': 'Find and counter objections',
    'code-review-pro': 'AI-powered code review',
    'api-load-tester': 'Performance and load testing',
    'test-coverage-improver': 'Increase test coverage',
    'docker-debugger': 'Debug Docker containers',
    'performance-profiler': 'Find performance bottlenecks',
    'compliance-checker': 'Check regulatory compliance',
    'security-pentest-planner': 'Plan penetration tests',
    'tech-due-diligence': 'Technical due diligence',
    'contract-analyzer': 'Analyze and review contracts',
    'market-sizing': 'Validate market opportunity (TAM/SAM/SOM)',
    'workflow-automator': 'Automate repetitive processes',
    'okr-generator': 'Generate OKRs from goals',
    'knowledge-base-builder': 'Build and maintain knowledge bases',
  };
  return briefs[skillName] || 'Specialized AI skill';
}
