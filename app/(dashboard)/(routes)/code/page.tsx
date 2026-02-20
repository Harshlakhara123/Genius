"use client";

import axios from "axios";
import * as z from "zod";
import { useState } from "react";
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
      console.error(error);
    } finally {
      router.refresh();
    }
  };

  // ✅ Copy-to-clipboard helper
  const handleCopy = async (code: string) => {
    await navigator.clipboard.writeText(code);
  };

  return (
    <div>
      <Heading
        title="Code Generation"
        description="Generate code from descriptive text"
        icon={Code}
        iconColor="text-green-700"
        bgColor="bg-green-700/10"
      />

      <div className="px-4 lg:px-8">
        <div>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="rounded-lg border w-full p-4 px-3 md:px-6 focus-within:shadow-sm grid grid-cols-12 gap-2"
            >
              <FormField
                name="prompt"
                render={({ field }) => (
                  <FormItem className="col-span-12 lg:col-span-10">
                    <FormControl className="m-0 p-0">
                      <Input
                        className="border-0 outline-none focus-visible:ring-0 focus-visible:ring-transparent"
                        disabled={isLoading}
                        placeholder="Solve Koko eating bananas problem in C++"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <Button className="col-span-12 lg:col-span-2 w-full" disabled={isLoading}>
                Generate
              </Button>
            </form>
          </Form>
        </div>

        <div className="space-y-4 mt-4">
          {isLoading && (
            <div className="p-8 rounded-lg w-full flex items-center justify-center bg-muted">
              <Loader />
            </div>
          )}

          {messages.length === 0 && !isLoading && <Empty label="No code generated yet" />}

          <div className="flex flex-col-reverse gap-y-4">
            {messages.map((message, index) => {
              const content = typeof message.content === "string" ? cleanCodeBlock(message.content) : "";

              return (
                <div
                  key={index}
                  className={`p-3 rounded-lg ${
                    message.role === "user" ? "bg-violet-500/10 text-violet-700" : "bg-muted"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    {message.role === "user" ? <UserAvatar /> : <BotAvatar />}
                    <span className="text-xs text-gray-500">
                      {message.role === "user" ? "You" : "Code Generator"}
                    </span>
                  </div>

                  {/* ✅ Syntax-highlighted code rendering */}
                  {message.role === "assistant" ? (
                    <div className="relative">
                      <Button
                        onClick={() => handleCopy(content)}
                        className="absolute right-2 top-2 text-xs bg-gray-700 hover:bg-gray-600 text-white"
                        size="sm"
                      >
                        Copy
                      </Button>
                      <SyntaxHighlighter
                        language={detectLanguage(content)}
                        style={vscDarkPlus}
                        wrapLongLines
                        customStyle={{
                          borderRadius: "0.5rem",
                          fontSize: "0.85rem",
                          background: "rgb(30, 30, 30)",
                          paddingTop: "2.5rem",
                        }}
                      >
                        {content}
                      </SyntaxHighlighter>
                    </div>
                  ) : (
                    <p className="text-sm">{content}</p>
                  )}
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