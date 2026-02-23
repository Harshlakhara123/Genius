"use client";

import axios from "axios";
import { useState } from "react";
import { Zap } from "lucide-react";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";

interface SubscriptionButtonProps {
    isPro: boolean;
}

export const SubscriptionButton = ({
    isPro = false
}: SubscriptionButtonProps) => {
    const [loading, setLoading] = useState(false);

    const onClick = async () => {
        try {
            setLoading(true);

            // Load Razorpay Script
            const res = await new Promise((resolve) => {
                const script = document.createElement("script");
                script.src = "https://checkout.razorpay.com/v1/checkout.js";
                script.onload = () => resolve(true);
                script.onerror = () => resolve(false);
                document.body.appendChild(script);
            });

            if (!res) {
                toast.error("Razorpay SDK failed to load");
                return;
            }

            const response = await axios.post("/api/razorpay");
            const data = response.data;
            const key_id = data.key_id;

            const options = {
                key: key_id,
                amount: data.amount,
                currency: data.currency,
                name: "Genius Pro",
                description: "Unlimited AI Generations",
                order_id: data.id,
                handler: async function (response: any) {
                    try {
                        const verifyRes = await axios.post("/api/razorpay/verify", response);
                        if (verifyRes.data.success) {
                            toast.success("Payment successful!");
                            window.location.href = "/dashboard";
                        }
                    } catch (error) {
                        toast.error("Payment verification failed");
                    }
                },
                theme: {
                    color: "#000000",
                },
            };

            const paymentObject = new (window as any).Razorpay(options);
            paymentObject.open();

        } catch (error) {
            toast.error("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    if (isPro) {
        return null;
    }

    return (
        <Button variant={isPro ? "default" : "premium"} onClick={onClick} disabled={loading}>
            {isPro ? "Manage Subscription" : "Upgrade"}
            {!isPro && <Zap className="w-4 h-4 ml-2 fill-white" />}
        </Button>
    )
};
