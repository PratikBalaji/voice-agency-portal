import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const VAPI_API_KEY = process.env.VAPI_API_KEY;
    if (!VAPI_API_KEY) {
      return new NextResponse(
        JSON.stringify({ error: 'Vapi API key not configured.' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const body = await req.json();
    const { generatedPrompt } = body; // Expecting the generated prompt from Claude

    const vapiAgentPayload = {
      prompt: generatedPrompt,
      // CRITICAL GUARDRAILS
      costLimit: 0.50,
      maxDurationSeconds: 120,
      // Add other Vapi agent configuration as needed
      // For example, voice, model, etc.
      voice: {
        provider: "deepmind",
        voiceId: "en-US-Neural2-D", // Example voice
      },
      model: {
        provider: "openai", // or "anthropic"
        model: "gpt-4", // or "claude-3-opus-20240229"
        temperature: 0.7,
        // Add other model configuration
      },
      // More Vapi configuration can be added here based on requirements.
      // For instance, firstMessage, endCallMessage, clientMessages, etc.
    };

    const vapiResponse = await fetch('https://api.vapi.ai/agent', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${VAPI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(vapiAgentPayload),
    });

    if (!vapiResponse.ok) {
      const errorData = await vapiResponse.json();
      console.error("Error deploying Vapi agent:", errorData);
      return new NextResponse(
        JSON.stringify({ error: `Failed to deploy Vapi agent: ${errorData.message || vapiResponse.statusText}` }),
        { status: vapiResponse.status, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const vapiAgent = await vapiResponse.json();
    return NextResponse.json({ success: true, agentId: vapiAgent.id, agentUrl: vapiAgent.publicUrl });

  } catch (error) {
    console.error("Error in deploy-agent API route:", error);
    return new NextResponse(
      JSON.stringify({ error: "An unexpected error occurred." }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
