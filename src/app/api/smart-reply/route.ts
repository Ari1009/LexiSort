import { NextRequest, NextResponse } from "next/server";
import { generateSmartReply } from "@/app/(dev)/ai/new/utils/smart-reply";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { originalEmail, userEmail, userName } = body;

        if (!originalEmail || !userEmail) {
            return NextResponse.json(
                { error: "Missing required fields: originalEmail and userEmail" },
                { status: 400 }
            );
        }

        // Generate the smart reply
        const smartReply = await generateSmartReply(originalEmail, userEmail, userName);

        return NextResponse.json({ reply: smartReply });
    } catch (error) {
        console.error("Error in smart reply API:", error);
        return NextResponse.json(
            { error: "Failed to generate smart reply" },
            { status: 500 }
        );
    }
} 