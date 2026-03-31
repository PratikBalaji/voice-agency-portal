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
    const { generatedPrompt } = body; // Expecting the generated prompt from DiscoveryForm.tsx

    const vapiAssistantPayload = {
      model: {
        provider: "openai", // or your preferred LLM provider for Vapi
        model: "gpt-4", // or your preferred model
        messages: [
          { role: "system", content: generatedPrompt }
        ],
      },
      voice: {
        provider: "openai", // Corrected voice provider
        voiceId: "alloy",    // Corrected voiceId
      },
      // CRITICAL GUARDRAILS (costLimit removed as per Vapi schema validation)
      maxDurationSeconds: 120, // maxDurationSeconds retained
      // Add other Vapi assistant configuration as needed
    };

    const vapiResponse = await fetch('https://api.vapi.ai/assistant', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${VAPI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(vapiAssistantPayload),
    });
    if (!vapiResponse.ok) {
      const errorData = await vapiResponse.json();
      console.error("Error creating Vapi assistant:", errorData);
      return new NextResponse(
        JSON.stringify({ error: `Failed to create Vapi assistant: ${errorData.message || vapiResponse.statusText}` }),
        { status: vapiResponse.status, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const vapiAssistant = await vapiResponse.json();
    return NextResponse.json({ success: true, agentId: vapiAssistant.id, publicUrl: vapiAssistant.publicUrl });

  } catch (error) {
    console.error("Error in agent API route:", error);
    return new NextResponse(
      JSON.stringify({ error: "An unexpected error occurred." }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
