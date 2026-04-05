import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const toolCall = body.message?.toolCalls?.[0];

        if (!toolCall) {
            return NextResponse.json({ error: 'No tool call found' }, { status: 400 });
        }

        const args =
            typeof toolCall.function.arguments === 'string'
                ? JSON.parse(toolCall.function.arguments)
                : toolCall.function.arguments;

        const { customerName, date, time } = args;
        console.log(`📅 Booking Request: ${customerName} wants an appt on ${date} at ${time}`);

        // ==========================================
        // 🚀 YOUR CALENDAR LOGIC GOES HERE
        // For now, we simulate a successful booking, unless they ask for a weekend.
        let bookingResult = '';
        const requestedString = `${date}`.toLowerCase();

        if (requestedString.includes('saturday') || requestedString.includes('sunday')) {
            bookingResult =
                "I'm sorry, but our office is closed on weekends. Could we schedule this for a weekday instead?";
        } else {
            bookingResult = `Success! I have officially booked the appointment for ${customerName} on ${date} at ${time}. I've sent a confirmation to your system.`;
        }
        // ==========================================

        console.log(`✅ Sending result back to AI: ${bookingResult}`);

        return NextResponse.json({
            results: [
                {
                    toolCallId: toolCall.id,
                    result: bookingResult,
                },
            ],
        });
    } catch (error: any) {
        console.error('❌ Booking failed:', error.message);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
