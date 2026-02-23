import crypto from "crypto";
import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { ConvexHttpClient } from "convex/browser";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function POST(req: Request) {
    try {
        const user = await currentUser();
        if (!user || user.emailAddresses.length === 0) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const email = user.emailAddresses[0].emailAddress;
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await req.json();

        const body = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
            .update(body.toString())
            .digest("hex");

        const isAuthentic = expectedSignature === razorpay_signature;

        if (!isAuthentic) {
            return new NextResponse("Invalid Signature", { status: 400 });
        }

        const { api } = await import("@/convex/_generated/api");

        // Update the user's plan to pro in Convex
        await convex.mutation(api.subscription.updateSubscription, {
            email,
        });

        return NextResponse.json({ success: true }, { status: 200 });

    } catch (error) {
        console.error("[RAZORPAY_VERIFY_ERROR]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
