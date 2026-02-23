"use client";

import axios from "axios";
import * as z from "zod";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import type OpenAI from "openai";

import { zodResolver } from "@hookform/resolvers/zod";
import { Heading } from "@/components/heading";
import { Code } from "lucide-react";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Empty } from "@/components/empty";
import { Loader } from "@/components/loader";
import { UserAvatar } from "@/components/user-avatar";
import { BotAvatar } from "@/components/bot-avatar";

import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/cjs/styles/prism";
import { formSchema } from "./constants";
import { useProModal } from "@/hooks/use-pro-modal";

// ✅ Language detection helper
function detectLanguage(text: string): string {
  const lower = text.toLowerCase();

  if (lower.includes("#include") || lower.includes("std::")) return "cpp";
  if (lower.includes("public class") || lower.includes("system.out")) return "java";
  if (lower.includes("def ") || lower.includes("import ")) return "python";
  if (lower.includes("function ") || lower.includes("const ") || lower.includes("let ")) return "javascript";
  if (lower.includes("interface ") || lower.includes(": string") || lower.includes(": number")) return "typescript";
  if (lower.includes("<html") || lower.includes("<!doctype")) return "html";
  if (lower.includes("body {") || lower.includes("color:")) return "css";
  if (lower.includes("fn main()") || lower.includes("println!")) return "rust";
  if (lower.includes("void main()") || lower.includes("#include <stdio.h>")) return "c";
  if (lower.includes("import 'package:flutter")) return "dart";
  if (lower.includes("{") && lower.includes("}")) return "json";
  if (lower.includes("return (") && lower.includes("=>")) return "jsx"; // React/Next

  return "plaintext";
}

// ✅ Clean markdown-style ```code``` fences
function cleanCodeBlock(content: string): string {
  return content.replace(/```[a-zA-Z]*\n?/, "").replace(/```$/, "").trim();
}

const CodePage = () => {
  const proModal = useProModal();
  const router = useRouter();
  const [messages, setMessages] = useState<OpenAI.Chat.ChatCompletionMessageParam[]>([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: "",
    },
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const userMessage: OpenAI.Chat.ChatCompletionMessageParam = {
        role: "user",
        content: values.prompt,
      };

      const newMessages = [...messages, userMessage];

      const response = await axios.post("/api/code", {
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
  };

  // ✅ Copy-to-clipboard helper
  const handleCopy = async (code: string) => {
    await navigator.clipboard.writeText(code);
  };

  return (
    <div className="min-h-screen bg-[#000000] text-zinc-50 pb-12">
      <Heading
        title="Code Generation"
        description="Generate robust code from natural language."
        icon={Code}
        iconColor="text-green-400"
        bgColor="bg-green-500/10"
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
                        placeholder="Write an elegant binary search tree in Python."
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

          {messages.length === 0 && !isLoading && <Empty label="No code generated yet." />}

          <div className="flex flex-col-reverse gap-y-6">
            {messages.map((message, index) => {
              const content = typeof message.content === "string" ? cleanCodeBlock(message.content) : "";

              return (
                <div
                  key={index}
                  className={`p-6 rounded-2xl flex flex-col gap-4 ${message.role === "user" ? "bg-zinc-950 border border-zinc-800 text-zinc-200" : "bg-zinc-900/50 text-zinc-300 border border-zinc-800"}`}
                >
                  <div className="flex items-center gap-3">
                    {message.role === "user" ? <UserAvatar /> : <BotAvatar />}
                    <span className="text-sm font-medium text-zinc-400">
                      {message.role === "user" ? "You" : "Genius Code"}
                    </span>
                  </div>

                  <div className="pl-12">
                    {/* ✅ Syntax-highlighted code rendering */}
                    {message.role === "assistant" ? (
                      <div className="relative group">
                        <Button
                          onClick={() => handleCopy(content)}
                          className="absolute right-3 top-3 text-xs bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                          size="sm"
                        >
                          Copy
                        </Button>
                        <SyntaxHighlighter
                          language={detectLanguage(content)}
                          style={vscDarkPlus}
                          wrapLongLines
                          customStyle={{
                            borderRadius: "0.75rem",
                            fontSize: "0.875rem",
                            background: "#09090b",
                            padding: "2.5rem 1.5rem 1.5rem 1.5rem",
                            border: "1px solid #27272a",
                            margin: 0
                          }}
                        >
                          {content}
                        </SyntaxHighlighter>
                      </div>
                    ) : (
                      <p className="text-sm md:text-base leading-relaxed wrap-break-word whitespace-pre-wrap">
                        {content}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodePage;