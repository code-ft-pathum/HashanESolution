import { NextRequest, NextResponse } from 'next/server';

// Public chatbot system prompt
const PUBLIC_SYSTEM_PROMPT = `You are "Spark", the helpful AI assistant for Hashan E Solution — a professional electrical appliance repair company in Sri Lanka.

## About Hashan E Solution
- Repairs: Washing machines, refrigerators, air conditioners, TVs, microwaves, irons, fans, water pumps, and all household electrical appliances
- Location: Sri Lanka
- Contact: WhatsApp and the website booking system
- Services: Appliance diagnosis & repair, preventive maintenance, spare parts, on-site & workshop repairs, emergency repairs
- Booking: Customers book appointments online
- Working Hours: Monday to Saturday, 8:00 AM – 6:00 PM

## Rules
- Be friendly, helpful, and professional
- Reply in English (switch to Sinhala if the user writes in Sinhala)
- Keep replies short and clear
- NEVER mention prices or costs. If asked, say you cannot provide pricing — they should book an appointment for a free assessment
- Only answer questions related to Hashan E Solution services
- Guide users to book an appointment for any repair needs
`;

// Admin chatbot system prompt
const ADMIN_SYSTEM_PROMPT = `You are "Spark", the AI business assistant for Hashan E Solution — serving the admin/owner only.

## About Hashan E Solution
- Professional electrical appliance repair company in Sri Lanka
- Services: Appliance diagnosis & repair, preventive maintenance, spare parts supply, on-site & workshop repairs, emergency services

## You can help the admin with
- Business analytics and appointment statistics
- Revenue trends and financial insights
- Inventory management advice
- Customer behavior patterns
- Business strategy and growth recommendations
- Operational efficiency improvements

## Tone
- Professional and direct
- Data-driven when possible
- Proactive in giving insights
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
            // Pass all messages including previous reasoning_details for continuation
            ...messages.map((m: any) => ({
                role: m.role,
                content: String(m.content),
                ...(m.reasoning_details ? { reasoning_details: m.reasoning_details } : {})
            }))
        ];

        const openRouterRes = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
                'HTTP-Referer': 'https://hashanesolution.netlify.app',
                'X-Title': 'Hashan E Solution'
            },
            body: JSON.stringify({
                model: 'stepfun/step-3.5-flash:free',
                messages: formattedMessages,
                reasoning: { enabled: true }
            })
        });

        if (!openRouterRes.ok) {
            const errText = await openRouterRes.text();
            console.error('OpenRouter API error:', openRouterRes.status, errText);
            return NextResponse.json(
                { error: `AI service error (${openRouterRes.status}). Please try again.` },
                { status: 502 }
            );
        }

        const result = await openRouterRes.json();
        const reply = result?.choices?.[0]?.message;

        if (!reply || !reply.content) {
            console.error('Empty AI response:', JSON.stringify(result));
            return NextResponse.json({ error: 'No response from AI. Please try again.' }, { status: 502 });
        }

        return NextResponse.json({
            content: reply.content,
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
