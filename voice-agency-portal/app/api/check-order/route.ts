import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const body = await req.json();

        // Vapi wraps the tool call data inside a message object
        const toolCall = body.message?.toolCalls?.[0];

        if (!toolCall) {
            return NextResponse.json({ error: 'No tool call found in payload' }, { status: 400 });
        }

        // Extract the order number the AI gathered from the customer
        const args =
            typeof toolCall.function.arguments === 'string'
                ? JSON.parse(toolCall.function.arguments)
                : toolCall.function.arguments;

        const { orderNumber } = args;
        console.log(`🔍 AI Agent is looking up order: ${orderNumber}`);

        // ==========================================
        // 🚀 YOUR DATABASE LOGIC GOES HERE
        // Replace this mock data with a real database or Shopify API call
        let statusMessage = '';

        if (orderNumber === '12345') {
            statusMessage =
                'Order 12345 was packaged this morning and will be shipped via UPS this afternoon.';
        } else if (orderNumber === '99999') {
            statusMessage =
                'Order 99999 is currently delayed due to backordered items, but is expected to ship next Monday.';
        } else {
            statusMessage = `I'm sorry, I looked in the system but I cannot find an active order matching number ${orderNumber}.`;
        }
        // ==========================================

        console.log(`✅ Sending result back to AI: ${statusMessage}`);

        // Vapi requires us to return the result paired with the specific toolCallId
        return NextResponse.json({
            results: [
                {
                    toolCallId: toolCall.id,
                    result: statusMessage,
                },
            ],
        });
    } catch (error: any) {
        console.error('❌ Tool execution failed:', error.message);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
