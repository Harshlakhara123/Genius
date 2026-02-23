"use client";
import axios from "axios";

import * as z from "zod";
import { Heading } from "@/components/heading";
import { Download, ImageIcon } from "lucide-react";
import { useForm } from "react-hook-form";

import { amountOptions, formSchema, resolutionOptions } from "./constants";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Empty } from "@/components/empty";
import { Loader } from "@/components/loader";
import { Card, CardFooter } from "@/components/ui/card";
import Image from "next/image";
import { useProModal } from "@/hooks/use-pro-modal";

const ImagePage = () => {
    const proModal = useProModal();
    const router = useRouter();
    const [images, setImages] = useState<string[]>([]);
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            prompt: "",
            amount: "1",
            resolution: "512x512",
        }
    });


    const isLoading = form.formState.isSubmitting;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            setImages([]);
            const response = await axios.post("/api/image", values);

            const urls = response.data.map((image: { url: string }) => image.url);

            setImages(urls);
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
                title="Image Generation"
                description="Turn your words into breathtaking visuals."
                icon={ImageIcon}
                iconColor="text-pink-400"
                bgColor="bg-pink-500/10"
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
                                    <FormItem className="col-span-12 lg:col-span-6">
                                        <FormControl className="m-0 p-0">
                                            <Input
                                                className="border-0 outline-none focus-visible:ring-0 focus-visible:ring-transparent bg-transparent text-zinc-100 placeholder:text-zinc-500"
                                                disabled={isLoading}
                                                placeholder="A futuristic city with flying cars in cyberpunk style"
                                                {...field}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="amount"
                                render={({ field }) => (
                                    <FormItem className="col-span-12 lg:col-span-2">
                                        <Select
                                            disabled={isLoading}
                                            onValueChange={field.onChange}
                                            value={field.value}
                                            defaultValue={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger className="bg-zinc-900 border-zinc-800 text-zinc-300 focus:ring-0">
                                                    <SelectValue defaultValue={field.value} />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent className="bg-zinc-900 border-zinc-800 text-zinc-200">
                                                {amountOptions.map((option) => (
                                                    <SelectItem
                                                        key={option.value}
                                                        value={option.value}
                                                        className="focus:bg-zinc-800 focus:text-zinc-100 cursor-pointer"
                                                    >
                                                        {option.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="resolution"
                                render={({ field }) => (
                                    <FormItem className="col-span-12 lg:col-span-2">
                                        <Select
                                            disabled={isLoading}
                                            onValueChange={field.onChange}
                                            value={field.value}
                                            defaultValue={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger className="bg-zinc-900 border-zinc-800 text-zinc-300 focus:ring-0">
                                                    <SelectValue defaultValue={field.value} />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent className="bg-zinc-900 border-zinc-800 text-zinc-200">
                                                {resolutionOptions.map((option) => (
                                                    <SelectItem
                                                        key={option.value}
                                                        value={option.value}
                                                        className="focus:bg-zinc-800 focus:text-zinc-100 cursor-pointer"
                                                    >
                                                        {option.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
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

                    {images.length === 0 && !isLoading && (
                        <Empty label="No images generated" />
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-8">
                        {images.map((src) => (
                            <Card
                                key={src}
                                className="rounded-2xl overflow-hidden bg-zinc-950 border border-zinc-800 hover:border-zinc-700 transition-colors shadow-none"
                            >
                                <div className="relative aspect-square">
                                    <Image
                                        alt="Image"
                                        fill
                                        src={src}
                                        className="object-cover"
                                    />
                                </div>
                                <CardFooter className="p-4 bg-zinc-950/80">
                                    <Button
                                        onClick={() => window.open(src)}
                                        variant="secondary"
                                        className="w-full bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-800 transition-colors"
                                    >
                                        <Download className="w-4 h-4 mr-2" />
                                        Download
                                    </Button>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ImagePage;