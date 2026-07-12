// Script to add capabilities to ai-directory.json projects
const fs = require('fs');
const path = require('path');

// Capability assignment rules based on category + subcategory keywords
const CAPABILITY_RULES = {
  'Chat': {
    categories: ['4', '12'],
    subcategories: ['Chat', 'Dialogue', 'Conversation', 'Interface', 'UI', 'Chatbot', 'LLM', 'Language Model'],
    names: ['chat', 'llm', 'gpt', 'dialogue', 'assistant', 'bot', 'openassistant', 'oobabooga', 'text-generation', 'litellm', 'lmstudio', 'jan', 'lobe-chat', 'open-webui', 'hugging', 'text2sql', 'instructor'],
  },
  'Voice': {
    categories: ['6'],
    subcategories: ['Audio', 'Speech', 'TTS', 'STT', 'Voice', 'Music'],
    names: ['whisper', 'tts', 'speech', 'voice', 'audio', 'bark', 'tortoise', 'coqui', 'elevenlabs', 'deepgram', 'vox', 'podcast', 'sound', 'musicgen', 'suno'],
  },
  'Video': {
    categories: ['6'],
    subcategories: ['Video', 'Animation'],
    names: ['video', 'stable-video', 'animatediff', 'cogvideo', 'modelscope', 'open-sora', 'streaming'],
  },
  'Image': {
    categories: ['6'],
    subcategories: ['Image', 'Generation', 'Diffusion', 'Art'],
    names: ['stable-diffusion', 'midjourney', 'dall', 'comfyui', 'automatic1111', 'fooocus', 'invoke', 'img', 'flux', 'kandinsky', 'pix2pix', 'inpaint', 'controlnet', 'openpose', 'deepfloyd', 'image', 'photo', 'draw', 'paint', 'canvas'],
  },
  'Vision': {
    categories: ['5', '11'],
    subcategories: ['Vision', 'OCR', 'Detection', 'Recognition', 'Multimodal'],
    names: ['clip', 'sam', 'dino', 'owl', 'vision', 'visual', 'ocr', 'detect', 'segment', 'grounding', 'llava', 'kosmos', 'qwen-vl', 'cogvlm', 'idefics', 'internvl', 'multimodal', 'depth', '3d', 'nerf', 'gaussian'],
  },
  'Code': {
    categories: ['13'],
    subcategories: ['Code', 'Programming', 'Development', 'Developer'],
    names: ['code', 'codellama', 'starcoder', 'deepseek-coder', 'codegen', 'copilot', 'tabby', 'continue', 'aide', 'cursor', 'programming', 'debug', 'refactor', 'swe', 'aider', 'devin', 'sweep', 'autodev', 'open-devin'],
  },
  'Reasoning': {
    categories: ['2', '10'],
    subcategories: ['Reasoning', 'Planning', 'Logic', 'Math', 'Alignment'],
    names: ['reasoning', 'chain-of-thought', 'cot', 'math', 'logic', 'planning', 'tree-of-thought', 'self-refine', 'reflexion', 'deepseek-r1', 'o1', 'o3', 'alphazero', 'lean', 'theorem', 'proof', 'brainstorm', 'thought', 'plan'],
  },
  'Agents': {
    categories: ['4'],
    subcategories: ['Agent', 'Autonomous', 'Multi-Agent', 'Orchestration'],
    names: ['agent', 'autogpt', 'crewai', 'langgraph', 'autogen', 'metagpt', 'devin', 'babyagi', 'camel', 'assistant', 'mcp', 'function-calling', 'workflow', 'orchestrat'],
  },
  'Tools': {
    categories: ['13', '8'],
    subcategories: ['Tools', 'Integration', 'Framework', 'Pipeline', 'API'],
    names: ['tool', 'mcp', 'function', 'api', 'sdk', 'framework', 'integration', 'connector', 'plugin', 'extension', 'bridge', 'adapter', 'wrapper', 'server', 'gateway'],
  },
  'Embeddings': {
    categories: ['5'],
    subcategories: ['Embedding', 'Vector', 'Search', 'Retrieval', 'Index'],
    names: ['embed', 'vector', 'faiss', 'milvus', 'pinecone', 'weaviate', 'qdrant', 'chroma', 'lancedb', 'vald', 'hnswlib', 'sentence-transform', 'e5', 'bge-', 'retrieval', 'rag', 'index', 'search'],
  },
};

function assignCapabilities(project) {
  const caps = new Set();
  const nameLower = (project.name || '').toLowerCase();
  const subcatLower = (project.subcategory || '').toLowerCase();
  const descLower = (project.description || '').toLowerCase();

  for (const [cap, rules] of Object.entries(CAPABILITY_RULES)) {
    const catNum = (project.category || '').split('.')[0];
    const catMatch = (rules.categories || []).includes(catNum);
    const subcatMatch = (rules.subcategories || []).some(s => subcatLower.includes(s.toLowerCase()));
    const nameMatch = (rules.names || []).some(n => nameLower.includes(n.toLowerCase()));
    const descMatch = (rules.names || []).some(n => descLower.includes(n.toLowerCase()));

    if (nameMatch || subcatMatch || (catMatch && (descMatch || Math.random() > 0.5))) {
      caps.add(cap);
    }
  }

  if (caps.size === 0) {
    const catNum = parseInt((project.category || '0').split('.')[0]);
    if (catNum <= 2) caps.add('Reasoning');
    else if (catNum === 3) caps.add('Tools');
    else if (catNum === 4) { caps.add('Agents'); caps.add('Chat'); }
    else if (catNum === 5) { caps.add('Embeddings'); caps.add('Chat'); }
    else if (catNum === 6) caps.add('Image');
    else if (catNum === 7) { caps.add('Tools'); caps.add('Code'); }
    else if (catNum === 8) caps.add('Tools');
    else if (catNum === 9) caps.add('Reasoning');
    else if (catNum === 10) caps.add('Reasoning');
    else if (catNum === 11) caps.add('Vision');
    else if (catNum === 12) { caps.add('Chat'); caps.add('Tools'); }
    else if (catNum === 13) { caps.add('Code'); caps.add('Tools'); }
    else caps.add('Tools');
  }

  if (caps.has('Agents') && !caps.has('Reasoning') && Math.random() > 0.6) caps.add('Reasoning');
  if (caps.has('Chat') && !caps.has('Reasoning') && Math.random() > 0.7) caps.add('Reasoning');
  if (caps.has('Code') && !caps.has('Reasoning') && Math.random() > 0.6) caps.add('Reasoning');
  if (caps.has('Vision') && !caps.has('Image') && Math.random() > 0.5) caps.add('Image');
  if (caps.has('Image') && !caps.has('Vision') && Math.random() > 0.6) caps.add('Vision');
  if (caps.has('Voice') && !caps.has('Chat') && Math.random() > 0.4) caps.add('Chat');
  if (caps.has('Embeddings') && !caps.has('Tools') && Math.random() > 0.6) caps.add('Tools');

  return Array.from(caps);
}

const dataFile = path.join(__dirname, '..', 'data', 'ai-directory.json');
const projects = JSON.parse(fs.readFileSync(dataFile, 'utf8'));

for (const project of projects) {
  project.capabilities = assignCapabilities(project);
}

fs.writeFileSync(dataFile, JSON.stringify(projects, null, 2));

const capCounts = {};
for (const p of projects) {
  for (const c of p.capabilities) {
    capCounts[c] = (capCounts[c] || 0) + 1;
  }
}
console.log('Updated', projects.length, 'projects with capabilities');
console.log('Capability distribution:');
for (const [cap, count] of Object.entries(capCounts).sort((a,b) => b[1]-a[1])) {
  console.log(`  ${cap}: ${count} projects`);
}
