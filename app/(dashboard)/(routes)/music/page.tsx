"use client";
import axios from "axios";

import * as z from "zod";
import { Heading } from "@/components/heading";
import { Music } from "lucide-react";
import { useForm } from "react-hook-form";

import { formSchema } from "./constants";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { Empty } from "@/components/empty";
import { Loader } from "@/components/loader";
import { useProModal } from "@/hooks/use-pro-modal";

const MusicPage = () => {
    const proModal = useProModal();
    const router = useRouter();

    const [music, setMusic] = useState<string>();
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            prompt: ""
        }
    });


    const isLoading = form.formState.isSubmitting;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            setMusic(undefined);

            const response = await axios.post("/api/music", values);
            setMusic(response.data.audio);
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
                title="Generate Music"
                description="Hear the power of AI-generated audio."
                icon={Music}
                iconColor="text-emerald-400"
                bgColor="bg-emerald-500/10"
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
                                                placeholder="A relaxing piano lo-fi beat..."
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

                    {!music && !isLoading && (
                        <Empty label="No music generated yet." />
                    )}

                    {music && (
                        <div className="p-8 rounded-2xl border border-zinc-800 bg-zinc-950 flex flex-col items-center justify-center">
                            <audio controls className="w-full max-w-md filter drop-shadow-lg">
                                <source src={music} />
                            </audio>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default MusicPage;