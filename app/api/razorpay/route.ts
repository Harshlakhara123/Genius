import Razorpay from "razorpay";
import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID!,
    key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST() {
    try {
        const user = await currentUser();
        if (!user || user.emailAddresses.length === 0) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const options = {
            amount: 50000, // 500 INR in paise
            currency: "INR",
            receipt: "receipt_" + Math.random().toString(36).substring(7),
        };

        const order = await razorpay.orders.create(options);

        return NextResponse.json({ ...order, key_id: process.env.RAZORPAY_KEY_ID });
    } catch (error) {
        console.error("[RAZORPAY_ERROR]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
