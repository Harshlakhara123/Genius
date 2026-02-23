"use client";

import { useProModal } from "@/hooks/use-pro-modal";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { Badge } from "./ui/badge";

import { Check, CodeIcon, ImageIcon, MessageSquare, Music, VideoIcon, Zap } from "lucide-react";
import { Card } from "./ui/card";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";


const tools = [
    {
        label: "Conversation",
        icon: MessageSquare,
        color: "text-violet-500",
        bgColor: "bg-violet-500/10",
    },
    {
        label: "Music Generation",
        icon: Music,
        color: "text-emerald-500",
        bgColor: "bg-emerald-500/10",
    },
    {
        label: "Image Generation",
        icon: ImageIcon,
        color: "text-pink-700",
        bgColor: "bg-pink-700/10",
    },
    {
        label: "Video Generation",
        icon: VideoIcon,
        color: "text-orange-700",
        bgColor: "bg-orange-700/10",
    },
    {
        label: "Code Generation",
        icon: CodeIcon,
        color: "text-green-700",
        bgColor: "bg-emerald-700/10",
    },

]

export const ProModal = () => {
    const proModal = useProModal();
    const [loading, setLoading] = useState(false);

    const onSubscribe = async () => {
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
        } catch (error: any) {
            toast.error("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <Dialog open={proModal.isOpen} onOpenChange={proModal.onClose}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="flex justify-center items-center flex-col gap-y-4 pb-2">
                            upgrade to genius
                            <div className="flex items-center gap-x-2 font-bold py-1">
                                <Badge variant="premium" className="uppercase text-sm py-1">
                                    pro
                                </Badge>
                            </div>
                        </DialogTitle>
                        <DialogDescription className="sr-only">
                            Upgrade to Genius Pro to unlock all features and get unlimited AI generations.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="text-center pt-2 text-zinc-900 font-medium max-h-[70vh] overflow-y-auto">
                        <div className="space-y-2">
                            {tools.map((tool) => (
                                <Card
                                    key={tool.label}
                                    className="p-3 border-black/5 flex items-center justify-between"
                                >
                                    <div className="flex items-center justify-between w-full">
                                        <div className="flex items-center gap-x-4">
                                            <div className={cn("p-2 w-fit rounded-md", tool.bgColor)}>
                                                <tool.icon className={cn("w-6 h-6", tool.color)} />
                                            </div>
                                            <div className="font-semibold text-sm">{tool.label}</div>
                                        </div>
                                        <Check className="text-primary w-5 h-5 shrink-0" />
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            disabled={loading}
                            onClick={onSubscribe}
                            size="lg"
                            variant="premium"
                            className="w-full"
                        >
                            Upgrade
                            <Zap className="w-4 h-4 ml-2 fill-white" />
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}