import { NextResponse } from 'next/server';
import { scrapeForDeepSeek } from '@/lib/scraper';
import axios from 'axios';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        // Accept both `url` (new) and `referenceUrl` (legacy) from the frontend
        const {
            businessName,
            sector,
            url,
            referenceUrl,
            additionalContext,
        } = body;

        const targetUrl: string = url || referenceUrl;

        if (!businessName || !sector || !targetUrl) {
            return NextResponse.json(
                { error: 'Missing required fields: businessName, sector, and url.' },
                { status: 400 }
            );
        }

        // 1. Scrape the target website locally with Playwright
        console.log(`Starting scrape for ${targetUrl}...`);
        const scrapedText = await scrapeForDeepSeek(targetUrl);

        if (!scrapedText) {
            return NextResponse.json(
                { error: 'Failed to scrape the website.' },
                { status: 500 }
            );
        }

        // 2. The Master System Prompt for DeepSeek
        const deepSeekPrompt = `
You are a professional voice agent prompt engineer specializing in creating high-performance, instruction-based conversation agents.

I need you to create a complete, deployment-ready voice agent prompt for a business called "${businessName}" in the "${sector}" sector.

Here is the raw text scraped from their website:
"""
${scrapedText}
"""

Here are additional specific rules requested by the user:
"""
${additionalContext || 'No additional rules provided.'}
"""

YOUR TASK:
Analyze the website data above. Figure out what the business does, who their customers are, their key services, and what makes them different. Then, generate a complete Voice Agent System Prompt using the exact structure below.

If specific details (like exact common objections or precise target age) are not explicitly on the website, use your expert intuition to generate highly logical, industry-standard assumptions.

THE REQUIRED OUTPUT STRUCTURE:
Role - Define who the agent is and their purpose.
Context - Explain the calling situation and expectations.
Personality - Detailed personality and communication guidelines (Tone: Professional, helpful, natural).
Task - Clear objectives and success criteria (e.g., qualifying leads, booking appointments).
Conversation Stages - Stage-by-stage conversation progression with conditional logic.
Information Collection - Systematic data gathering approach based on the business type.
Objection Handling - Responses for common concerns likely for this industry.
Critical Guidelines - Essential rules for natural conversation flow (one question at a time, active listening).

OUTPUT INSTRUCTIONS:
Do not include conversational filler in your response (e.g., "Here is the prompt"). Output ONLY the final, structured Voice Agent prompt ready to be pasted into Vapi.
`;

        // 3. Send the payload to the local Ollama/DeepSeek model
        console.log('Sending data to DeepSeek...');
        const aiResponse = await axios.post(
            process.env.OLLAMA_API_URL || 'http://localhost:11434/api/generate',
            {
                model: process.env.MODEL_NAME || 'deepseek-r1:7b',
                prompt: deepSeekPrompt,
                stream: false,
            }
        );

        const generatedPrompt: string = aiResponse.data.response;

        // 4. Return the Vapi-ready prompt to the frontend
        console.log('Prompt generated successfully!');
        return NextResponse.json({ prompt: generatedPrompt });

    } catch (error: any) {
        console.error('API Error:', error.message);
        return NextResponse.json(
            { error: 'Failed to generate prompt.' },
            { status: 500 }
        );
    }
}