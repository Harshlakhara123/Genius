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



        const response = await replicate.run("anotherjesse/zeroscope-v2-xl:9f747673945c62801b13b84701c783929c0ee784e4748ec062204894dda1a351", {
            input: {
                prompt
            }
        });

        await increaseApiLimit();

        return NextResponse.json({
            role: "assistant",
            content: response,
        });
    } catch (error) {
        console.log("[VIDEO_ERROR]", error);
        return new NextResponse("Internal error", { status: 500 });
    }
}