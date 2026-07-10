import { NextResponse } from 'next/server';
import { generateAgentResponse, getAgentById } from '../../../../lib/agents';

export async function POST(request) {
  try {
    const body = await request.json();
    const { agentId, prompt } = body;

    if (!agentId || !prompt) {
      return NextResponse.json(
        { error: 'agentId and prompt are required' },
        { status: 400 }
      );
    }

    const agent = getAgentById(agentId);
    if (!agent) {
      return NextResponse.json(
        { error: 'Agent not found' },
        { status: 404 }
      );
    }

    // Simulate processing delay
    const delay = Math.floor(Math.random() * 2000) + 500;
    await new Promise(resolve => setTimeout(resolve, delay));

    const result = generateAgentResponse(agentId, prompt);

    return NextResponse.json({
      success: true,
      ...result,
    });
  } catch (error) {
    console.error('Agent prompt error:', error);
    return NextResponse.json(
      { error: 'Failed to process agent prompt' },
      { status: 500 }
    );
  }
}
