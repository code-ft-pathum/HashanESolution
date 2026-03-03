import { NextRequest, NextResponse } from 'next/server';

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

interface ChatMessage {
    role: string;
    content: string;
    reasoning_details?: string;
}

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

        const formattedMessages = [
            { role: 'system', content: systemPrompt },
            ...messages
        ];

        // Call OpenRouter API directly
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "model": "arcee-ai/trinity-large-preview:free",
                "messages": formattedMessages,
                "reasoning": { "enabled": true }
            })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error?.error?.message || 'OpenRouter API failed');
        }

        const result = await response.json();
        const assistantMessage = result.choices?.[0]?.message;

        if (!assistantMessage) {
            throw new Error('No response from AI');
        }

        // Return the full message object including reasoning_details
        return NextResponse.json({
            content: assistantMessage.content,
            reasoning_details: assistantMessage.reasoning_details || null,
            role: assistantMessage.role
        });

    } catch (error: any) {
        console.error('Chat API error:', error);
        return NextResponse.json(
            { error: error?.message || 'Failed to process chat request' },
            { status: 500 }
        );
    }
}
