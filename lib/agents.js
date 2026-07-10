// Agent definitions for Marq AI Skills Platform
// Each agent has: id, name, type, description, capabilities, sampleInputs, sampleOutputs, tools, category

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
  },
];

export const AGENT_CATEGORIES = {
  'Execution': { icon: '⚡', color: '#ef4444', description: 'Agents that execute tasks at scale' },
  'Coordination': { icon: '🔗', color: '#8b5cf6', description: 'Agents that coordinate between other agents' },
  'Design': { icon: '🎨', color: '#3b82f6', description: 'Agents that design and configure systems' },
  'Navigation': { icon: '🧭', color: '#14b8a6', description: 'Agents that help you find the right tools' },
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
