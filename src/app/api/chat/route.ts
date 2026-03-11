import { NextRequest, NextResponse } from 'next/server';

// Public chatbot system prompt
const PUBLIC_SYSTEM_PROMPT = `You are "Spark", the expert AI assistant for Hashan E Solution — Sri Lanka's premium electronics and digital meter repair center.

## About Hashan E Solution
- **Owner**: Hashan Madushanka
- **Specialization**: High-tech diagnostics, chip-level repairs, and panel restoration.
- **Key Services**:
    - **TV Repair**: LED/LCD/Smart TVs (Samsung, LG, Sony, Panasonic, TCL, Hisense, Singer, Abans). We fix display/panel issues, power faults, and mainboard failures.
    - **Digital Meter Repair**: Specialized restoration for bike meters (Bajaj Pulsar 150/180/220/NS, TVS Apache, Yamaha FZ, Hero). Fixes for fading displays, lighting, and circuit faults.
    - **Home Appliances**: Microwave Ovens, Refrigerators, Blenders, Rice Cookers, and Electric Irons.
- **Location**: No 09, New Town, Welikanda, Polonnaruwa, Sri Lanka.
- **Contact**: 074 240 9092 (Phone/WhatsApp) | hashanmadushanka9122@gmail.com | www.hashanesolution.netlify.app
- **Working Hours**: Monday to Saturday, 9:00 AM – 6:00 PM.

## Rules
- Be professional, technical yet accessible, and friendly.
- Default to English, but switch to Sinhala if the user uses Sinhala.
- **NEVER** give exact price quotes. Tell users prices depend on the diagnosis and invite them to book an appointment (Free Assessment).
- Guide users to use the "Book Appointment" feature on the website or contact via WhatsApp for urgent issues.
- Keep responses concise and focused on repairs.
`;

// Admin chatbot system prompt
const ADMIN_SYSTEM_PROMPT = `You are "Spark", the AI business intelligence assistant for Hashan Madushanka (Owner of Hashan E Solution).

## Business Overview
- **Store**: Hashan E Solution (Polonnaruwa, Welikanda)
- **Core Business**: Professional electronic repairs (TVs, Bike Meters, Home Appliances).
- **Service Standard**: Premium chip-level diagnostics and genuine part replacements.

## Your Role (Admin Assistant)
- Help Hashan manage operations by analyzing live business data.
- Provide insights on appointments, revenue trends, and inventory needs.
- Suggest growth strategies (e.g., focusing on popular repair types like Pulsar meters or Sony TVs).
- Be direct, data-driven, and proactive.
`;

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { messages, isAdmin, contextData } = body;

        if (!messages || !Array.isArray(messages)) {
            return NextResponse.json({ error: 'Invalid messages format' }, { status: 400 });
        }

        const apiKey = process.env.OPENROUTER_API_KEY;
        if (!apiKey) {
            console.error('OPENROUTER_API_KEY is not set');
            return NextResponse.json({ error: 'Server configuration error: API key missing' }, { status: 500 });
        }

        let systemPrompt = isAdmin ? ADMIN_SYSTEM_PROMPT : PUBLIC_SYSTEM_PROMPT;

        if (isAdmin && contextData) {
            systemPrompt += `\n\n## Live Business Data\n${JSON.stringify(contextData, null, 2)}`;
        }

        const formattedMessages = [
            { role: 'system', content: systemPrompt },
            ...messages.map((m: any) => ({
                role: m.role,
                content: m.content || '',
                ...(m.reasoning_details ? { reasoning_details: m.reasoning_details } : {})
            }))
        ];

        const openRouterRes = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
                'HTTP-Referer': 'https://hashanesolution.netlify.app',
                'X-Title': 'Hashan E Solution',
            },
            body: JSON.stringify({
                model: 'stepfun/step-3.5-flash:free',
                messages: formattedMessages,
                reasoning: { enabled: true }
            }),
            cache: 'no-store'
        });

        if (!openRouterRes.ok) {
            const errText = await openRouterRes.text();
            console.error('OpenRouter API error:', openRouterRes.status, errText);

            let errorMessage = 'AI service error. Please try again.';
            try {
                const errJson = JSON.parse(errText);
                if (errJson.error?.message) errorMessage = errJson.error.message;
            } catch (e) { }

            return NextResponse.json(
                { error: errorMessage },
                { status: openRouterRes.status }
            );
        }

        const result = await openRouterRes.json();
        const reply = result?.choices?.[0]?.message;

        if (!reply) {
            console.error('Incomplete AI response:', JSON.stringify(result));
            return NextResponse.json({ error: 'No response from AI model.' }, { status: 502 });
        }

        return NextResponse.json({
            content: reply.content || '',
            role: reply.role || 'assistant',
            reasoning_details: reply.reasoning_details || null
        });

    } catch (error: any) {
        console.error('Chat route error:', error?.message || error);
        return NextResponse.json(
            { error: 'Something went wrong. Please try again.' },
            { status: 500 }
        );
    }
}
