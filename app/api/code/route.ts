import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { checkApiLimit, increaseApiLimit } from "@/lib/api-limit";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || "");

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    const body = await req.json();
    const { messages } = body;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!process.env.GOOGLE_API_KEY) {
      return new NextResponse("Google API key not configured", { status: 500 });
    }

    if (!messages || messages.length === 0) {
      return new NextResponse("Messages are required", { status: 400 });
    }

    const freeTrial = await checkApiLimit();

    if (!freeTrial) {
      return new NextResponse("Your free limit is exceeded , please upgrade to become a genius", { status: 403 });
    }

    //  Use Gemini model
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    //  Strong system instruction to steer model
    const systemInstruction = `
      You are a professional code generator.
      Your responses must always include complete code blocks,
      with inline comments explaining key parts of the code.
      Do not include greetings, markdown syntax, or conversational text.
    `;

    // Build chat history, starting with system instruction
    const history = [
      {
        role: "user",
        parts: [{ text: systemInstruction }],
      },
      ...messages.slice(0, -1).map((msg: { role: string; content: string }) => ({
        role: msg.role === "assistant" ? "model" : "user",
        parts: [{ text: msg.content }],
      })),
    ];

    const prompt = messages[messages.length - 1].content;

    //  Start a chat session with memory
    const chat = model.startChat({ history });

    // Generate code based on current user prompt
    const result = await chat.sendMessage(prompt);
    const response = await result.response;
    const text = response.text();

    await increaseApiLimit();

    return NextResponse.json({
      role: "assistant",
      content: text,
    });
  } catch (error) {
    console.error("[CODE_GENERATOR_ERROR]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}