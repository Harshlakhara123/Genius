"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useAuth } from "@clerk/nextjs";
import { useEffect } from "react";
import Header from "@/components/Header";

export default function Home() {
  const router = useRouter();
  const { isSignedIn } = useAuth();

  useEffect(() => {
    if (isSignedIn) {
      router.push("/dashboard");
    }
  }, [isSignedIn, router]);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center text-white bg-linear-to-br from-gray-900 via-gray-800 to-gray-900 relative overflow-hidden px-6">
      <Header />
      {/* Background Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(108,71,255,0.3),transparent_70%)]" />

      {/* Logo */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative w-56 h-56 mb-8 z-10"
      >
        <Image
          src="/logo_Genius.png"
          alt="Genius Logo"
          fill
          className="object-contain"
          priority
        />
      </motion.div>

      {/* Title */}
      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-4xl md:text-5xl font-bold mb-4 text-center"
      >
        Empower Your Creativity with <span className="text-[#6c47ff]">Genius</span>
      </motion.h1>

      {/* Subtitle */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-gray-300 max-w-2xl text-center mb-8 leading-relaxed"
      >
        Transform your ideas into stunning visuals, videos, voices, and code —
        all powered by AI.
      </motion.p>

      {/* Get Started Button */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
      >
        <Button
          onClick={() => router.push("/sign-in")}
          className="bg-[#6c47ff] hover:bg-[#5b38e0] text-lg px-8 py-3 rounded-full"
        >
          Get Started
        </Button>
      </motion.div>

      {/* Feature Grid */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 z-10 max-w-8xl"
      >
        {[
          {
            title: "Image Generation",
            desc: "Turn your text into breathtaking visuals.",
            img: "/features/image-gen.png",
          },
          {
            title: "Video Generation",
            desc: "Create engaging videos from your prompts.",
            img: "/features/video-gen.png",
          },
          {
            title: "Voice Generation",
            desc: "Generate realistic human-like voices.",
            img: "/features/voice-gen.png",
          },
          {
            title: "Code Generation",
            desc: "Let AI write clean, efficient code from text.",
            img: "/features/code-gen.png",
          },
        ].map((feature) => (
          <div
            key={feature.title}
            className="bg-white/5 rounded-2xl p-6 flex flex-col items-center text-center hover:bg-white/10 transition"
          >
            <div className="relative w-32 h-32 mb-4">
              <Image
                src={feature.img}
                alt={feature.title}
                fill
                className="object-contain"
              />
            </div>
            <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
            <p className="text-sm text-gray-400">{feature.desc}</p>
          </div>
        ))}
      </motion.section>
    </main>
  );
}
