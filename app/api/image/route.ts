import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { checkApiLimit, increaseApiLimit } from "@/lib/api-limit";
import { VertexAI } from "@google-cloud/vertexai";

export const maxDuration = 60;

export async function POST(
    req: Request
) {
    try {
        const { userId } = await auth();
        const body = await req.json();
        const { prompt, amount = 1, resolution = "1024x1024" } = body;

        if (!userId) {
            return new NextResponse("Unauthorised", { status: 401 });
        }

        if (!process.env.GOOGLE_CLOUD_PROJECT || !process.env.GOOGLE_CLOUD_LOCATION) {
            return new NextResponse("Google Cloud Vertex AI not configured", { status: 500 });
        }

        if (!prompt) {
            return new NextResponse("prompt is required", { status: 400 });
        }
        if (!amount) {
            return new NextResponse("amount is required", { status: 400 });
        }
        if (!resolution) {
            return new NextResponse("resolution is required", { status: 400 });
        }

        const freeTrial = await checkApiLimit();

        if (!freeTrial) {
            return new NextResponse("Your free limit is exceeded , please upgrade to become a genius", { status: 403 });
        }

        const vertexAI = new VertexAI({ project: process.env.GOOGLE_CLOUD_PROJECT, location: process.env.GOOGLE_CLOUD_LOCATION });
        const model = "imagen-3.0-generate-001";

        const generativeModel = vertexAI.getGenerativeModel({ model });

        const parsedAmount = parseInt(amount, 10);

        const request = {
            instances: [
                { prompt }
            ],
            parameters: {
                sampleCount: parsedAmount,
                aspectRatio: "1:1",
                outputOptions: { mimeType: "image/jpeg" }
            }
        };

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const response = await generativeModel.generateContent(request as any);

        const images = [];

        // Parse through the response to extract images
        // @ts-expect-error - The Vertex AI SDK types are currently slightly incomplete for image predictions
        const predictions = response?.response?.predictions;
        if (predictions) {
            for (const prediction of predictions) {
                const predObj = prediction as { bytesBase64Encoded: string };
                images.push({
                    url: `data:image/jpeg;base64,${predObj.bytesBase64Encoded}`
                });
            }
        }

        await increaseApiLimit();

        return NextResponse.json(images);
    } catch (error) {
        console.log("[IMAGE_ERROR]", error);
        return new NextResponse("Internal error", { status: 500 });
    }
}