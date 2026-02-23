"use client";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ArrowRightIcon, CodeIcon, ImageIcon, MessageSquare, Music, VideoIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

const tools = [
  {
    label: "Conversation",
    icon: MessageSquare,
    color: "text-violet-500",
    bgColor: "bg-violet-500/10",
    href: "/conversation"
  },
  {
    label: "Music Generation",
    icon: Music,
    color: "text-emerald-500",
    bgColor: "bg-emerald-500/10",
    href: "/music"
  },
  {
    label: "Image Generation",
    icon: ImageIcon,
    color: "text-pink-700",
    bgColor: "bg-pink-700/10",
    href: "/image"
  },
  {
    label: "Video Generation",
    icon: VideoIcon,
    color: "text-orange-700",
    bgColor: "bg-orange-700/10",
    href: "/video"
  },
  {
    label: "Code Generation",
    icon: CodeIcon,
    color: "text-green-700",
    bgColor: "bg-emerald-700/10",
    href: "/code"
  },

]

const DashBoardPage = () => {
  const router = useRouter();
  return (
    <div className="min-h-screen bg-[#000000] text-zinc-50 py-12">
      {/* Background Subtle elements */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[24px_24px] pointer-events-none z-0" />

      <div className="relative z-10">
        <div className="mb-12 space-y-6 flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-zinc-800 bg-zinc-900/50 backdrop-blur-md shadow-sm"
          >
            <span className="text-xs font-medium text-zinc-300 uppercase tracking-widest">Dashboard</span>
          </motion.div>
          <h2 className="text-4xl md:text-6xl font-extrabold text-center tracking-tight text-zinc-100">
            Explore the power of <span className="text-transparent bg-clip-text bg-linear-to-r from-zinc-300 to-zinc-600">AI</span>
          </h2>
          <p className="text-zinc-400 font-medium text-base md:text-xl text-center max-w-2xl">
            Interact with the smartest AI in a unified, premium workspace.
          </p>
        </div>

        <div className="px-4 md:px-20 lg:px-40 space-y-4 max-w-6xl mx-auto">
          {tools.map((tool, index) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              key={tool.href}
            >
              <Card
                onClick={() => router.push(tool.href)}
                className="p-4 border border-zinc-900 bg-zinc-950/50 backdrop-blur-md hover:bg-zinc-900 hover:border-zinc-800 transition-all duration-300 cursor-pointer group shadow-none"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-x-6">
                    <div className={cn("p-3 w-fit rounded-xl border border-zinc-800 shadow-sm", tool.bgColor)}>
                      <tool.icon className={cn("w-6 h-6", tool.color)} />
                    </div>
                    <div className="font-semibold text-zinc-200 text-lg tracking-tight group-hover:text-white transition-colors">{tool.label}</div>
                  </div>

                  <ArrowRightIcon className="w-6 h-6 text-zinc-600 group-hover:text-zinc-300 group-hover:translate-x-1 transition-all duration-300" />
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default DashBoardPage;
