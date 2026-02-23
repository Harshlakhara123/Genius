import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { checkApiLimit, increaseApiLimit } from "@/lib/api-limit";
import { GoogleGenerativeAI } from "@google/generative-ai";

export const maxDuration = 60;

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || "");

export async function POST(
    req: Request
) {
    try {
        const { userId } = await auth();
        const body = await req.json();
        const { messages } = body;

        if (!userId) {
            return new NextResponse("Unauthorised", { status: 401 });
        }

        if (!process.env.GOOGLE_API_KEY) {
            return new NextResponse("Google API key not configured", { status: 500 });
        }

        if (!messages || messages.length === 0) {
            return new NextResponse("messages are required", { status: 400 });
        }

        const freeTrial = await checkApiLimit();

        if (!freeTrial) {
            return new NextResponse("Your free limit is exceeded , please upgrade to become a genius", { status: 403 });
        }

        const model = genAI.getGenerativeModel({
            model: "gemini-2.5-flash",
            systemInstruction: "You are a helpful AI assistant. Always respond in plain text without any markdown formatting like asterisks, bolding, italics, or hashtags. Never output character symbols for text decoration."
        });

        const prompt = messages[messages.length - 1].content;

        const history = messages.slice(0, -1).map((msg: { role: string; content: string }) => ({
            role: msg.role === "assistant" ? "model" : "user",
            parts: [{ text: msg.content }],
        }));

        const chat = model.startChat({
            history,
        });

        const result = await chat.sendMessage(prompt);
        const response = await result.response;
        const text = response.text();

        await increaseApiLimit();

        return NextResponse.json({
            role: "assistant",
            content: text,
        });
    } catch (error) {
        console.log("[CONVERSATION_ERROR]", error);
        return new NextResponse("Internal error", { status: 500 });
    }
}