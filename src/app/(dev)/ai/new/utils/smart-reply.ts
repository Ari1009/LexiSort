"use server";

import { AI_PROMPTS } from "../constants";
import index from "../index";

/**
 * Generate a smart reply for an email based on its tone and content
 */
export async function generateSmartReply(
    originalEmail: {
        subject: string;
        body: string;
        from: string;
        aiMetadata?: {
            category?: string;
            priority?: string;
            summary?: string;
        };
    },
    userEmail: string,
    userName?: string,
): Promise<string> {
    try {
        // Clean the email content
        const cleanSubject = originalEmail.subject || "";
        const cleanBody = originalEmail.body || "";
        
        // Extract email content for analysis
        const emailContent = `${cleanSubject}\n\n${cleanBody}`.substring(0, 3000);
        
        // Determine the tone and context from AI metadata if available
        const category = originalEmail.aiMetadata?.category || "General";
        const priority = originalEmail.aiMetadata?.priority || "Medium";
        const summary = originalEmail.aiMetadata?.summary || "";
        
        // Create a comprehensive prompt for smart reply generation
        const prompt = `You are an AI assistant helping to draft a professional email reply. 

ORIGINAL EMAIL:
From: ${originalEmail.from}
Subject: ${cleanSubject}
Content: ${emailContent}

CONTEXT:
- Email Category: ${category}
- Priority Level: ${priority}
- Summary: ${summary}

TASK:
Generate a professional email reply that:
1. Matches the tone and formality level of the original email
2. Addresses the key points from the original email
3. Is appropriate for the email category and priority level
4. Includes a proper greeting and closing
5. Is concise but comprehensive (2-4 sentences for the main content)
6. Uses the recipient's name if available, or a generic greeting if not
7. Maintains professional etiquette

GUIDELINES:
- If the original email is formal, keep the reply formal
- If the original email is casual, you can be more relaxed
- If it's urgent/high priority, acknowledge the urgency
- If it's work-related, maintain professional tone
- If it's personal, be more friendly
- Always be polite and respectful
- Include a proper email signature format

Generate ONLY the email reply content (no explanations or markdown). Start with the greeting and end with a proper closing.`;

        // Call the AI to generate the reply using OpenRouter
        const completion = await index.openrouter.chat.completions.create({
            messages: [{ role: "user", content: prompt }],
            model: "meta-llama/llama-3.1-8b-instruct",
            temperature: 0.3,
            max_tokens: 400,
        });

        const reply = completion.choices[0]?.message?.content?.trim() || "";
        return reply || "I apologize, but I'm unable to generate a smart reply at the moment. Please compose your reply manually.";
    } catch (error) {
        console.error("Error generating smart reply:", error);
        return "I apologize, but I'm unable to generate a smart reply at the moment. Please compose your reply manually.";
    }
}

/**
 * Analyze the tone of an email to help with reply generation
 */
export async function analyzeEmailTone(emailContent: string): Promise<{
    tone: "formal" | "casual" | "urgent" | "friendly" | "professional";
    formality: "high" | "medium" | "low";
    sentiment: "positive" | "neutral" | "negative";
}> {
    try {
        const prompt = `Analyze the tone of this email and return a JSON object with the following structure:
{
  "tone": "formal|casual|urgent|friendly|professional",
  "formality": "high|medium|low", 
  "sentiment": "positive|neutral|negative"
}

EMAIL CONTENT:
${emailContent.substring(0, 2000)}

Return ONLY the JSON object, no other text.`;

        const completion = await index.openrouter.chat.completions.create({
            messages: [{ role: "user", content: prompt }],
            model: "meta-llama/llama-3.1-8b-instruct",
            temperature: 0.1,
            max_tokens: 100,
        });

        const result = completion.choices[0]?.message?.content?.trim() || "";

        // Try to parse the JSON response
        try {
            const parsed = JSON.parse(result);
            return {
                tone: parsed.tone || "professional",
                formality: parsed.formality || "medium",
                sentiment: parsed.sentiment || "neutral",
            };
        } catch (parseError) {
            console.error("Error parsing tone analysis:", parseError);
            return {
                tone: "professional",
                formality: "medium",
                sentiment: "neutral",
            };
        }
    } catch (error) {
        console.error("Error analyzing email tone:", error);
        return {
            tone: "professional",
            formality: "medium",
            sentiment: "neutral",
        };
    }
} 