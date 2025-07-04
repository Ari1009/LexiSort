"use server";

import type { Email } from "@/app/(main)/inbox/types";
import { AI_PROMPTS, PRIORITY_LEVELS, VECTOR_CONFIG } from "../constants";
import index from "../index";
import { cleanEmail } from "./clean";

// Default model to use for OpenRouter requests
const DEFAULT_MODEL = "meta-llama/llama-3.1-8b-instruct";

/**
 * Make an OpenRouter LLM API call with retry logic
 */
async function callOpenRouter(
    prompt: string,
    options: {
        model?: string;
        temperature?: number;
        maxTokens?: number;
        strict?: boolean; // New option to enforce strict validation
    } = {},
): Promise<string> {
    const { model = DEFAULT_MODEL, temperature = 0.2, maxTokens = 150, strict = false } = options;

    console.log(`Making OpenRouter API call with model: ${model}`);

    // Ensure OpenRouter API key is available
    if (!process.env.OPENROUTER_API_KEY) {
        throw new Error("OPENROUTER_API_KEY not set");
    }

    // Add retry logic for resilience
    let attempts = 0;
    let lastError: Error | null = null;

    while (attempts < VECTOR_CONFIG.RETRY_ATTEMPTS) {
        try {
            const completion = await index.openrouter.chat.completions.create({
                messages: [{ role: "user", content: prompt }],
                model,
                temperature,
                max_tokens: maxTokens,
            });

            const response = completion.choices[0]?.message?.content?.trim() || "";
            console.log(`OpenRouter API call successful, response length: ${response.length}`);
            return response;
        } catch (error) {
            console.error(`OpenRouter API call failed on attempt ${attempts + 1}:`, error);
            lastError = error as Error;
            attempts++;
            if (attempts < VECTOR_CONFIG.RETRY_ATTEMPTS) {
                // Wait before retrying
                await new Promise((resolve) => setTimeout(resolve, VECTOR_CONFIG.RETRY_DELAY_MS));
            }
        }
    }

    throw lastError || new Error("Failed to get response from OpenRouter after multiple attempts");
}

/**
 * Categorize an email using OpenRouter LLM
 */
export async function categorizeEmail(email: Email): Promise<string> {
    try {
        const emailText = cleanEmail(email);
        if (!emailText || emailText.length < 10) {
            return "Uncategorized";
        }

        const prompt = `${AI_PROMPTS.CATEGORIZE}
    
    EMAIL:
    ${emailText.substring(0, 3000)}`;

        const result = await callOpenRouter(prompt, { temperature: 0.1 });
        return result;
    } catch (error) {
        console.error("Error categorizing email with OpenRouter:", error);
        return "Uncategorized";
    }
}

/**
 * Prioritize an email using OpenRouter LLM
 */
export async function prioritizeEmail(email: Email): Promise<string> {
    try {
        const emailText = cleanEmail(email);
        if (!emailText || emailText.length < 10) {
            return "Medium";
        }

        const prompt = `${AI_PROMPTS.PRIORITIZE}
    
    EMAIL:
    ${emailText.substring(0, 3000)}`;

        const result = await callOpenRouter(prompt, { temperature: 0.1 });

        // Validate that the response is a valid priority level
        const validPriorities = Object.values(PRIORITY_LEVELS);
        if (validPriorities.includes(result)) {
            return result;
        }

        // If not valid, return default
        return "Medium";
    } catch (error) {
        console.error("Error prioritizing email with OpenRouter:", error);
        return "Medium";
    }
}

/**
 * Summarize an email using OpenRouter LLM
 */
export async function summarizeEmail(email: Email): Promise<string> {
    try {
        const emailText = cleanEmail(email);
        if (!emailText || emailText.length < 30) {
            return "No summary available";
        }

        const prompt = `${AI_PROMPTS.SUMMARIZE}
    
    EMAIL:
    ${emailText.substring(0, 3000)}`;

        const result = await callOpenRouter(prompt, { temperature: 0.3, maxTokens: 200 });
        return result;
    } catch (error) {
        console.error("Error summarizing email with OpenRouter:", error);
        return "Error generating summary";
    }
}

/**
 * Extract action items from an email using OpenRouter LLM
 */
export async function extractActionItems(email: Email): Promise<string[]> {
    try {
        const emailText = cleanEmail(email);
        if (!emailText || emailText.length < 30) {
            return [];
        }

        const prompt = `${AI_PROMPTS.EXTRACT_ACTION_ITEMS}
    
    EMAIL:
    ${emailText.substring(0, 3000)}
    
    Format your response as a JSON array, with each item as a string. If no action items, return an empty array [].
    IMPORTANT: ONLY return the valid JSON array with no other text before or after.`;

        // Maximum retries for getting valid JSON
        const MAX_RETRIES = 3;
        let retries = 0;
        let actionItems: string[] = [];

        while (retries < MAX_RETRIES) {
            const temperature = 0.2 + retries * 0.1; // Increase temperature slightly on retries
            const result = await callOpenRouter(prompt, {
                temperature,
                maxTokens: 400,
                model: retries > 0 ? "mistralai/ministral-3b" : DEFAULT_MODEL, // Try better model on retry
            });

            // Try parsing as JSON
            const parsedItems = tryParseJson<string[]>(
                result,
                (data) => Array.isArray(data) && data.every((item) => typeof item === "string"),
            );

            if (parsedItems !== null) {
                return parsedItems;
            }

            // Fallback parsing if JSON parse failed
            try {
                // Traditional array extraction
                const match = result.match(/\[([\s\S]*?)\]/);
                if (match) {
                    // Clean up the JSON before parsing
                    const jsonStr = match[0].replace(/'/g, '"').replace(/,\s*]/g, "]");

                    const jsonArray = JSON.parse(jsonStr);
                    if (Array.isArray(jsonArray)) {
                        return jsonArray.filter((item) => typeof item === "string");
                    }
                }

                // Fallback: extract bullet points or numbered items
                const bulletItems = result.match(/(?:^|\n)[-*•]\s*(.+)(?:\n|$)/g);
                if (bulletItems?.length) {
                    actionItems = bulletItems.map((item) => item.replace(/^[-*•]\s*/, "").trim());
                    return actionItems;
                }

                const numberedItems = result.match(/(?:^|\n)\d+\.\s*(.+)(?:\n|$)/g);
                if (numberedItems?.length) {
                    actionItems = numberedItems.map((item) => item.replace(/^\d+\.\s*/, "").trim());
                    return actionItems;
                }
            } catch (error) {
                console.error("Error in fallback parsing:", error);
            }

            retries++;
        }

        return actionItems;
    } catch (error) {
        console.error("Error extracting action items with OpenRouter:", error);
        return [];
    }
}

/**
 * Extract contact information from an email using OpenRouter LLM
 */
export async function extractContactInfo(email: Email): Promise<Record<string, string>> {
    try {
        const emailText = cleanEmail(email);
        if (!emailText || emailText.length < 30) {
            return {};
        }

        const prompt = `${AI_PROMPTS.EXTRACT_CONTACT_INFO}
    
    EMAIL:
    ${emailText.substring(0, 3000)}
    
    Format your response as a JSON object with contact details as key-value pairs. If no contact info, return an empty object {}.
    IMPORTANT: ONLY return the valid JSON object with no other text before or after.`;

        // Maximum retries for getting valid JSON
        const MAX_RETRIES = 3;
        let retries = 0;

        while (retries < MAX_RETRIES) {
            const temperature = 0.1 + retries * 0.1; // Increase temperature slightly on retries
            const result = await callOpenRouter(prompt, {
                temperature,
                maxTokens: 300,
                model: retries > 0 ? "mistralai/ministral-3b" : DEFAULT_MODEL, // Try better model on retry
            });

            // Try parsing as JSON
            const parsedInfo = tryParseJson<Record<string, string>>(
                result,
                (data) => typeof data === "object" && data !== null && !Array.isArray(data),
            );

            if (parsedInfo !== null) {
                return parsedInfo;
            }

            // If JSON parsing failed, try fallback extraction
            const contactInfo: Record<string, string> = {};

            // Look for Email: something@example.com patterns
            const emailMatch = result.match(
                /email:?\s*([a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/i,
            );
            if (emailMatch?.[1]) contactInfo.email = emailMatch[1].trim();

            // Look for Phone: 123-456-7890 patterns
            const phoneMatch = result.match(/phone:?\s*([\d\s+\-()]{7,})/i);
            if (phoneMatch?.[1]) contactInfo.phone = phoneMatch[1].trim();

            // Look for Name: John Doe patterns
            const nameMatch = result.match(/name:?\s*([^:,\n]{2,})/i);
            if (nameMatch?.[1]) contactInfo.name = nameMatch[1].trim();

            if (Object.keys(contactInfo).length > 0) {
                return contactInfo;
            }

            retries++;
        }

        return {}; // If all attempts fail, return empty object
    } catch (error) {
        console.error("Error extracting contact info with OpenRouter:", error);
        return {};
    }
}

/**
 * Process all AI enhancements for an email in a single call
 */
export async function processEmail(email: Email, userSettings?: any) {
    try {
        console.log(`Starting AI processing for email ${email.id}`);
        
        // Prepare email text once to avoid repetitive cleaning
        const emailText = cleanEmail(email);
        console.log(`Email text length after cleaning: ${emailText?.length || 0}`);

        if (!emailText || emailText.length < 30) {
            console.log(`Email content too short for processing: ${emailText?.length || 0} characters`);
            return {
                category: "Uncategorized",
                priority: "Medium",
                priorityExplanation: "Email content too short to analyze",
                summary: "No summary available",
                actionItems: [],
                contactInfo: {},
            };
        }

        // Add the user's custom prompt if it exists
        const customPromptSection = userSettings?.customPrompt
            ? `
IMPORTANT - USER'S CUSTOM INSTRUCTIONS:
${userSettings.customPrompt}

THE ABOVE INSTRUCTIONS FROM THE USER TAKE PRECEDENCE OVER ANY CONFLICTING STANDARD INSTRUCTIONS BELOW.
`
            : "";

        // Create a comprehensive prompt that extracts all information at once
        const prompt = `Analyze this email that was sent directly to the user and provide insights with a personal touch.
    
${customPromptSection}Your output must follow this JSON format with all fields properly quoted:
{
  "category": "Choose ONLY the ones that apply from this list if you're confident: ${AI_PROMPTS.CATEGORIZE}",
  "priority": "Choose one from this list: ${Object.values(PRIORITY_LEVELS).join(", ")}",
  "priorityExplanation": "Briefly explain why this matters to the user, addressing them directly with 'you' and 'your'",
  "summary": "Write a personalized 2-3 sentence summary in the format 'You have...' or 'You need to...' - always use second-person perspective. Make it feel like it's written directly to the user.",
  "actionItems": ["Specific actions with verbs like 'Review the Q3 report' or 'Respond to John by Friday', not generic labels like 'URGENT' or 'MEETING', only include 1-3 actions"],
  "importantDates": ["Format as 'Meeting with Team: 2023-05-15' or 'Project Deadline: 2023-06-01' with descriptive event names"],
  "deadlines": {
    "meeting1": {"event": "Meeting with Team", "date": "2023-05-15", "description": "Weekly team sync at 10:00 AM"},
    "deadline1": {"event": "Project Deadline", "date": "2023-06-01", "description": "Final deliverables due"}
  },
  "contactInfo": {"name": "Sender's name", "email": "sender's email if found", "phone": "phone if found"}
}
    
EMAIL SENT AT ${email.internalDate?.toLocaleString()}:
${emailText.substring(0, 3000)}

Guidelines:
1. For "importantDates" and "deadlines":
   - Use descriptive event names that clearly identify what the event is (not generic terms like "Event")
   - All dates should be in YYYY-MM-DD format
   - Include time information in the description when available
   - The "event" field should be a clear title like "Team Meeting" or "Project Deadline" 

2. For "actionItems":
   - List ONLY specific actionable tasks the user needs to complete
   - Each action item MUST start with a verb and include details (e.g., "Review the budget proposal")
   - DO NOT include generic category labels like "URGENT", "DEADLINE", or "MEETING" as separate items
   - Include 2-4 specific, detailed actions - quality over quantity
   - If there are truly no actions required, use an empty array []

3. For all fields:
   - Make insights feel personal and directly relevant to the user
   - Always use second-person language (you/your)
   - Don't include placeholder text or template language
   - Make sure all JSON keys and values are properly escaped and formatted

You MUST ONLY return a valid JSON object without any other text before or after. This is critical - no explanatory text, just return the properly formatted JSON.`;

        // Max retries for parsing the JSON response
        const MAX_JSON_PARSING_RETRIES = 3;
        let jsonParsingAttempts = 0;

        // Loop until we get valid JSON or hit retry limit
        while (jsonParsingAttempts < MAX_JSON_PARSING_RETRIES) {
            // Increase temperature slightly on retries to get different responses
            const retryTemperature = 0.2 + jsonParsingAttempts * 0.1;

            // Use a more powerful model for comprehensive analysis
            const result = await callOpenRouter(prompt, {
                model:
                    jsonParsingAttempts === 0
                        ? "google/gemini-flash-1.5-8b"
                        : "mistralai/ministral-3b",
                temperature: retryTemperature,
                maxTokens: 800,
            });

            console.log(`OpenRouter response length: ${result?.length || 0}`);
            console.log(`OpenRouter response preview: ${result?.substring(0, 200)}...`);

            // Try to extract JSON from the response
            try {
                // First check if response is wrapped in code blocks (```json ... ```)
                let cleanedResult = result;

                // Remove markdown code block formatting if present
                const codeBlockMatch = result.match(/```(?:json)?\s*([\s\S]*?)```/);
                if (codeBlockMatch?.[1]) {
                    cleanedResult = codeBlockMatch[1].trim();
                }

                // Parse the JSON
                const parsedData = JSON.parse(cleanedResult);

                // Validate required fields exist
                if (!parsedData.category || !parsedData.priority || !parsedData.summary) {
                    jsonParsingAttempts++;
                } else {
                    // Successfully parsed valid JSON with required fields

                    // If we successfully parsed JSON data, return it
                    return {
                        category: parsedData.category || "Uncategorized",
                        priority: parsedData.priority || "Medium",
                        priorityExplanation: parsedData.priorityExplanation || "",
                        summary: parsedData.summary || "No summary available",
                        actionItems: Array.isArray(parsedData.actionItems)
                            ? parsedData.actionItems
                            : [],
                        importantDates: Array.isArray(parsedData.importantDates)
                            ? parsedData.importantDates
                            : [],
                        deadlines:
                            typeof parsedData.deadlines === "object" ? parsedData.deadlines : {},
                        contactInfo:
                            typeof parsedData.contactInfo === "object"
                                ? parsedData.contactInfo
                                : {},
                    };
                }
            } catch (error) {
                console.error(`JSON parsing error on attempt ${jsonParsingAttempts + 1}:`, error);
                jsonParsingAttempts++;

                // If we're at the last attempt, no need to log about retrying
                if (jsonParsingAttempts < MAX_JSON_PARSING_RETRIES) {
                    console.log("Retrying with different model/parameters...");
                }
            }
        }

        // If we couldn't get valid JSON after all retries, fall back to individual processing
        console.log("Falling back to individual processing methods after JSON parsing failures");

        // Get priority with explanation
        const priorityInfo = await getPriorityWithExplanation(email);

        return {
            category: await categorizeEmail(email),
            priority: priorityInfo.priority,
            priorityExplanation: priorityInfo.explanation,
            summary: await summarizeEmail(email),
            actionItems: await extractActionItems(email),
            contactInfo: await extractContactInfo(email),
        };
    } catch (error) {
        console.error("Error in comprehensive email processing:", error);
        return {
            category: "Uncategorized",
            priority: "Medium",
            priorityExplanation: "Error during processing",
            summary: "Error processing email",
            actionItems: [],
            importantDates: [],
            deadlines: {},
            contactInfo: {},
        };
    }
}

/**
 * Helper function to safely parse JSON with validation
 */
function tryParseJson<T>(jsonString: string, validator?: (data: any) => boolean): T | null {
    try {
        // Try to extract from code blocks first
        let cleanedJson = jsonString;
        const codeBlockMatch = jsonString.match(/```(?:json)?\s*([\s\S]*?)```/);
        if (codeBlockMatch?.[1]) {
            cleanedJson = codeBlockMatch[1].trim();
        }

        // Parse JSON
        const parsed = JSON.parse(cleanedJson);

        // Validate if validator function provided
        if (validator && !validator(parsed)) {
            return null;
        }

        return parsed as T;
    } catch (e) {
        return null;
    }
}

/**
 * Get priority with explanation for an email
 */
async function getPriorityWithExplanation(
    email: Email,
): Promise<{ priority: string; explanation: string }> {
    try {
        const emailText = cleanEmail(email);
        if (!emailText || emailText.length < 10) {
            return {
                priority: "Medium",
                explanation: "Email content too short to analyze",
            };
        }

        const prompt = `Based on the content, urgency, and importance of this email to the user receiving it, assign a priority level from these options: 
    ${Object.values(PRIORITY_LEVELS).join(", ")}. 
    
    Consider how important and time-sensitive it is for the user to respond or take action on this email.
    First provide the priority level, then explain why you assigned this priority from the user's perspective in a separate paragraph.
    
    EMAIL:
    ${emailText.substring(0, 3000)}`;

        const result = await callOpenRouter(prompt, { temperature: 0.1, maxTokens: 300 });

        // Extract priority level (first line or word)
        let priority = "Medium";
        let explanation = "";

        // Try to parse the response
        const lines = result.split("\n").filter((line) => line.trim().length > 0);
        if (lines.length > 0) {
            // First line or word should be the priority
            const firstLine = lines[0].trim();
            const validPriorities = Object.values(PRIORITY_LEVELS);

            // Check if the first line is just a priority
            if (validPriorities.includes(firstLine)) {
                priority = firstLine;
                // Explanation is everything after the first line
                explanation = lines.slice(1).join("\n").trim();
            } else {
                // Try to extract a valid priority from the first line/word
                for (const validPriority of validPriorities) {
                    if (firstLine.includes(validPriority)) {
                        priority = validPriority;
                        break;
                    }
                }
                // Everything else is the explanation
                explanation = result.replace(priority, "").trim();
            }
        }

        return {
            priority,
            explanation:
                explanation || `Determined to be ${priority} priority based on content analysis.`,
        };
    } catch (error) {
        console.error("Error determining priority with explanation:", error);
        return {
            priority: "Medium",
            explanation: "Error during priority analysis",
        };
    }
}
