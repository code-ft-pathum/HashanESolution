import { NextRequest, NextResponse } from 'next/server';
import { OpenRouter } from '@openrouter/sdk';

const openrouter = new OpenRouter({
    apiKey: process.env.OPENROUTER_API_KEY || '',
});

// Business context for the AI - public-facing info
const PUBLIC_SYSTEM_PROMPT = `You are "Spark", the intelligent AI assistant for Hashan E Solution — a premier electrical repair and services company based in Sri Lanka.

## About Hashan E Solution
- **Business**: Professional electrical appliance repair and maintenance services
- **Specialties**: Washing machines, refrigerators, air conditioners, TVs, microwaves, irons, fans, water pumps, and all household electrical appliances
- **Location**: Sri Lanka
- **Contact**: Available via WhatsApp and through the website booking system
- **Services**: 
  1. Appliance diagnosis & repair
  2. Preventive maintenance packages
  3. Genuine spare parts supply
  4. On-site & workshop repairs
  5. Emergency repair services
- **Booking**: Customers can book appointments online through the dashboard
- **Working Hours**: Monday to Saturday, 8:00 AM – 6:00 PM

## Your Personality
- Friendly, professional, and knowledgeable
- Respond in English (or Sinhala if asked)
- Keep responses concise but helpful
- Guide users to book appointments when they need repairs
- Do NOT reveal internal business data like finances, revenue, inventory counts, or customer lists

## Guidelines
- Help users understand our services and pricing range
- Encourage booking via our online system
- For urgent issues, mention our WhatsApp contact
- Do not make up specific prices — say "pricing varies by repair type, please book for a free quote"
`;

// Full admin context with business intelligence instructions
const ADMIN_SYSTEM_PROMPT = `You are "Spark", the intelligent AI business assistant for Hashan E Solution — exclusively serving the admin/owner.

## About Hashan E Solution
- **Business**: Professional electrical appliance repair and maintenance services
- **Owner Admin Username**: hashanesolution
- **Specialties**: Washing machines, refrigerators, air conditioners, TVs, microwaves, irons, fans, water pumps, and all household electrical appliances
- **Location**: Sri Lanka
- **Services**: Appliance diagnosis & repair, preventive maintenance, spare parts supply, on-site & workshop repairs, emergency services

## Admin Access Level
You have full access to assist with:
- **Business analytics**: Interpreting appointment stats, revenue trends, and operational KPIs
- **Financial insights**: Analyzing income vs expenses, profit margins, and financial health
- **Inventory management**: Stock tracking, parts ordering recommendations, inventory optimization
- **Appointment management**: Scheduling analysis, peak time identification, resource planning
- **Customer insights**: Booking patterns, service frequency, customer retention analysis
- **Business strategy**: Growth recommendations, marketing timing, service expansion ideas
- **Operational efficiency**: Workflow improvements, technician scheduling, job prioritization

## Your Capabilities
- Analyze business data when the admin shares numbers/stats
- Provide actionable business recommendations
- Help draft customer communications
- Assist with pricing strategy and service packaging
- Provide Sri Lanka market insights for electrical repair industry
- Help identify trends in appointment types and peak seasons

## Tone
- Professional and direct
- Data-driven when possible
- Proactive in offering insights
- Treat the admin as the business owner who needs comprehensive support
`;

export async function POST(req: NextRequest) {
    try {
        const { messages, isAdmin, contextData } = await req.json();

        if (!messages || !Array.isArray(messages)) {
            return NextResponse.json({ error: 'Invalid messages format' }, { status: 400 });
        }

        let systemPrompt = isAdmin ? ADMIN_SYSTEM_PROMPT : PUBLIC_SYSTEM_PROMPT;

        // Inject dynamic business data for admins
        if (isAdmin && contextData) {
            systemPrompt += `\n\n## Current Business Data\nHere is the latest live data from the business dashboard:\n${JSON.stringify(contextData, null, 2)}`;
        }

        const stream = await (openrouter.chat.send as any)({
            model: 'arcee-ai/trinity-large-preview:free',
            messages: [
                { role: 'system', content: systemPrompt },
                ...messages,
            ],
            stream: true,
        });

        // Create a ReadableStream to stream the response
        const encoder = new TextEncoder();
        const readableStream = new ReadableStream({
            async start(controller) {
                try {
                    for await (const chunk of stream as any) {
                        const content = chunk.choices?.[0]?.delta?.content;
                        if (content) {
                            const data = JSON.stringify({ content });
                            controller.enqueue(encoder.encode(`data: ${data}\n\n`));
                        }
                        // Send usage info (including reasoning tokens)
                        if (chunk.usage) {
                            const usageData = JSON.stringify({
                                usage: chunk.usage,
                                reasoningTokens: chunk.usage.reasoningTokens
                            });
                            controller.enqueue(encoder.encode(`data: ${usageData}\n\n`));
                        }
                    }
                    controller.enqueue(encoder.encode('data: [DONE]\n\n'));
                    controller.close();
                } catch (err) {
                    controller.error(err);
                }
            },
        });

        return new Response(readableStream, {
            headers: {
                'Content-Type': 'text/event-stream',
                'Cache-Control': 'no-cache',
                'Connection': 'keep-alive',
            },
        });
    } catch (error) {
        console.error('Chat API error:', error);
        return NextResponse.json(
            { error: 'Failed to process chat request' },
            { status: 500 }
        );
    }
}
