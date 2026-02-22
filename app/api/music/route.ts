import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { checkApiLimit, increaseApiLimit } from "@/lib/api-limit";
import Replicate from "replicate";

const replicate = new Replicate({
    auth: process.env.REPLICATE_API_TOKEN!
});

export async function POST(
    req: Request
) {
    try {
        const { userId } = await auth();
        const body = await req.json();
        const { prompt } = body;

        if (!userId) {
            return new NextResponse("Unauthorised", { status: 401 });
        }

        if (!prompt) {
            return new NextResponse("prompt is required", { status: 400 });
        }

        const freeTrial = await checkApiLimit();

        if (!freeTrial) {
            return new NextResponse("Your free limit is exceeded , please upgrade to become a genius", { status: 403 });
        }



        const response = await replicate.run("riffusion/riffusion:8cf61ea6c56afd61d8f5b9ffd14d7c216c0a93844ce2d82ac1c9ecc9c7f24e05", {
            input: {
                prompt: prompt
            }
        });

        await increaseApiLimit();

        return NextResponse.json({
            role: "assistant",
            content: response,
        });
    } catch (error) {
        console.log("[MUSIC_ERROR]", error);
        return new NextResponse("Internal error", { status: 500 });
    }
}