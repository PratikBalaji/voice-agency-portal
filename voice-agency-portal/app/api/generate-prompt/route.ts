import { NextRequest, NextResponse } from 'next/server';
import ollama from 'ollama';
import fs from 'fs/promises';
import path from 'path';

async function scrapeWebsite(url: string): Promise<string> {
    try {
        const jinaUrl = `https://r.jina.ai/${url}`;
        const response = await fetch(jinaUrl);

        if (!response.ok) {
            console.error(`Jina AI scraping failed for ${url}: ${response.statusText}`);
            return `Failed to scrape website: ${response.statusText}`;
        }

        return await response.text();
    } catch (error: any) {
        console.error(`Error during website scraping for ${url}:`, error);
        return `Error during website scraping: ${error.message}`;
    }
}

export async function POST(req: NextRequest) {
    try {
        // No specific API key check for Ollama, as it's typically local.
        // If your Ollama setup requires authentication, you would add it here.
        const body = await req.json();
        const { businessName, sector, referenceUrl } = body;

        if (!businessName || !sector || !referenceUrl) {
            return new NextResponse(
                JSON.stringify({ error: 'Missing businessName, sector, or referenceUrl in request body.' }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }

        const scrapedWebsiteData = await scrapeWebsite(referenceUrl);

        let localGuidelines = '';
        const guidelinesPath = path.join(process.cwd(), 'guidelines.txt');
        try {
            localGuidelines = await fs.readFile(guidelinesPath, 'utf8');
        } catch (readError: any) {
            console.warn(`Could not read guidelines.txt at ${guidelinesPath}: ${readError.message}`);
            localGuidelines = "No specific guidelines provided. Act as an expert Voice AI Architect.";
        }

        const systemPrompt = `You are an expert Voice AI Architect. Your goal is to create a highly optimized and effective Vapi system prompt for an AI agent.

Use the following business information, scraped website data, and strict guidelines to formulate the prompt.

Business Name: ${businessName}
Sector: ${sector}
Reference URL: ${referenceUrl}
Scraped Website Data:
\`\`\`markdown
${scrapedWebsiteData}
\`\`\`

Strict Guidelines:
\`\`\`
${localGuidelines}
\`\`\`

Generate the Vapi system prompt:`;

        try {
            const response = await ollama.chat({
                model: 'deepseek-r1:7b', // Using deepseek-coder:7b as per previous instruction.
                messages: [{ role: 'user', content: systemPrompt }],
            });

            const generatedContent = response.message.content;

            return NextResponse.json({ success: true, generatedContent });

        } catch (llmError: any) {
            console.error("Error communicating with Ollama:", llmError);
            return new NextResponse(
                JSON.stringify({ error: `Error generating prompt from LLM: ${llmError.message || 'An unknown error occurred.'}` }),
                { status: 500, headers: { 'Content-Type': 'application/json' } }
            );
        }
    } catch (error) {
        console.error("Error in generate-prompt API route:", error);
        return new NextResponse(
            JSON.stringify({ error: "An unexpected error occurred." }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
}