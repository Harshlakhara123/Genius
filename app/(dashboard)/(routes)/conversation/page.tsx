"use client";
import axios from "axios";

import * as z from "zod";
import { Heading } from "@/components/heading";
import { MessageSquare } from "lucide-react";
import { useForm } from "react-hook-form";

import { formSchema } from "./constants";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import type OpenAI from "openai";
import { Empty } from "@/components/empty";
import { Loader } from "@/components/loader";
import { UserAvatar } from "@/components/user-avatar";
import { BotAvatar } from "@/components/bot-avatar";
import { useProModal } from "@/hooks/use-pro-modal";

const ConversationPage = () => {
    const proModal = useProModal();
    const router = useRouter();

    const [messages, setMessages] = useState<OpenAI.Chat.ChatCompletionMessageParam[]>([]);
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            prompt: ""
        }
    });

    const isLoading = form.formState.isSubmitting;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const userMessage: OpenAI.Chat.ChatCompletionMessageParam = {
                role: "user",
                content: values.prompt,
            };

            const newMessages = [...messages, userMessage];

            const response = await axios.post("/api/conversation", {
                messages: newMessages,
            });

            setMessages((current) => [...current, userMessage, response.data]);
            form.reset();
        } catch (error: any) {
            if (error?.response?.status === 403) {
                proModal.onOpen();
            } else {
                toast.error("Something went wrong");
            }
        } finally {
            router.refresh();
        }
    }

    return (
        <div className="min-h-screen bg-[#000000] text-zinc-50 pb-12">
            <Heading
                title="Conversation"
                description="Advanced conversation model."
                icon={MessageSquare}
                iconColor="text-violet-400"
                bgColor="bg-violet-500/10"
            />
            <div className="px-4 lg:px-8 mt-4">
                <div>
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="rounded-2xl border border-zinc-800 w-full p-4 px-3 md:px-6 focus-within:shadow-sm focus-within:border-zinc-700 bg-zinc-950/80 backdrop-blur-xl grid grid-cols-12 gap-4 transition-all"
                        >
                            <FormField
                                name="prompt"
                                render={({ field }) => (
                                    <FormItem className="col-span-12 lg:col-span-10">
                                        <FormControl className="m-0 p-0">
                                            <Input
                                                className="border-0 outline-none focus-visible:ring-0 focus-visible:ring-transparent bg-transparent text-zinc-100 placeholder:text-zinc-500"
                                                disabled={isLoading}
                                                placeholder="How do I calculate the radius of a circle?"
                                                {...field}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <Button className="col-span-12 lg:col-span-2 w-full bg-zinc-100 hover:bg-white text-zinc-900 rounded-xl font-medium transition-all" disabled={isLoading}>
                                Generate
                            </Button>
                        </form>
                    </Form>
                </div>
                <div className="space-y-6 mt-8">
                    {isLoading && (
                        <div className="p-8 rounded-2xl w-full flex items-center justify-center bg-zinc-900/50 border border-zinc-800">
                            <Loader />
                        </div>
                    )}

                    {messages.length === 0 && !isLoading && (
                        <Empty label="No conversation started." />
                    )}

                    <div className="flex flex-col-reverse gap-y-6">
                        {messages.map((message, index) => (
                            <div
                                key={index}
                                className={`p-6 rounded-2xl flex items-start gap-x-4 ${message.role === "user"
                                    ? "bg-zinc-950 border border-zinc-800 text-zinc-200"
                                    : "bg-zinc-900/50 text-zinc-300 border border-zinc-800"
                                    }`}
                            >
                                <div className="mt-1">
                                    {message.role === "user" ? <UserAvatar /> : <BotAvatar />}
                                </div>
                                <p className="text-sm md:text-base leading-relaxed wrap-break-word whitespace-pre-wrap flex-1">
                                    {typeof message.content === "string" ? message.content : null}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ConversationPage;