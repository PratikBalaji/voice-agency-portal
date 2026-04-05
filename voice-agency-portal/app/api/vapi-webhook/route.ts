import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function POST(req: NextRequest) {
  try {
    const payload = await req.json();
    const { call, transcript, summary } = payload;

    if (!call || !call.id || !transcript || !summary) {
      console.error("Vapi webhook payload missing required fields:", payload);
      return new NextResponse(
        JSON.stringify({ error: 'Invalid Vapi webhook payload' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const callId = call.id;
    const logData = {
      callId,
      transcript,
      summary,
      receivedAt: new Date().toISOString(),
    };

    const logFolderPath = path.join(process.cwd(), 'voice-agency-portal', 'call_logs');
    const logFilePath = path.join(logFolderPath, `${callId}.json`);

    // Ensure the call_logs directory exists
    await fs.mkdir(logFolderPath, { recursive: true });

    // Save the data to a JSON file
    await fs.writeFile(logFilePath, JSON.stringify(logData, null, 2), 'utf8');

    console.log(`Successfully saved call log for ${callId} to ${logFilePath}`);

    return new NextResponse(
      JSON.stringify({ success: true, message: 'Webhook received and log saved' }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error("Error handling Vapi webhook:", error);
    return new NextResponse(
      JSON.stringify({ error: 'Internal Server Error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
