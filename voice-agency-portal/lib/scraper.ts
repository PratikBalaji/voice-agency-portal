import { chromium } from 'playwright';
import { convert } from 'html-to-text';

/**
 * Scrapes a URL using a headless Chromium browser (via Playwright),
 * then converts the raw HTML to clean plain text suitable for an LLM.
 *
 * This is a local, unlimited alternative to Firecrawl / Jina.ai:
 * - Handles JavaScript-rendered pages (React, Vue, etc.)
 * - Bypasses simple bot-detection with a realistic User-Agent
 * - Strips noise (nav, footer, images, scripts) before returning
 */
export async function scrapeForDeepSeek(targetUrl: string): Promise<string> {
    console.log(`🕵️ Initiating local scrape for: ${targetUrl}`);

    // 1. Launch invisible browser
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({
        userAgent:
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    });
    const page = await context.newPage();

    try {
        // 2. Navigate and wait for the network to become idle
        await page.goto(targetUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });

        // Extra wait for slow popups / React hydration
        await page.waitForTimeout(2000);

        // 3. Extract the full rendered HTML
        const rawHtml = await page.content();

        // 4. Convert to clean plain text — strip images, nav, footer, and link URLs
        const cleanText = convert(rawHtml, {
            wordwrap: 130,
            selectors: [
                { selector: 'img',    format: 'skip' },
                { selector: 'nav',    format: 'skip' },
                { selector: 'footer', format: 'skip' },
                { selector: 'script', format: 'skip' },
                { selector: 'style',  format: 'skip' },
                { selector: 'a',      options: { ignoreHref: true } },
            ],
        });

        console.log(`✅ Scrape complete! Extracted ${cleanText.length} characters from ${targetUrl}`);
        return cleanText;

    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : String(error);
        console.error(`❌ Scraping failed for ${targetUrl}:`, message);
        // Return a descriptive fallback so the LLM can still run
        return `[Scraping failed for ${targetUrl}: ${message}. Please generate the prompt using only the business name and sector.]`;

    } finally {
        await browser.close();
    }
}
