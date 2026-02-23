"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useAuth } from "@clerk/nextjs";
import { useEffect } from "react";
import Header from "@/components/Header";
import { ArrowRight, ImageIcon, Video, Music, Code, Zap } from "lucide-react";

export default function Home() {
  const router = useRouter();
  const { isSignedIn } = useAuth();

  useEffect(() => {
    if (isSignedIn) {
      router.push("/dashboard");
    }
  }, [isSignedIn, router]);

  const features = [
    {
      title: "Image Generation",
      desc: "Turn your text into breathtaking, high-resolution visuals.",
      icon: <ImageIcon className="w-5 h-5 text-pink-400" />,
      color: "from-pink-500 to-purple-500",
      img: "/features/image-gen.png",
    },
    {
      title: "Video Generation",
      desc: "Create engaging, fluid videos instantly from your prompts.",
      icon: <Video className="w-5 h-5 text-orange-400" />,
      color: "from-orange-500 to-amber-500",
      img: "/features/video-gen.png",
    },
    {
      title: "Voice Generation",
      desc: "Generate realistic, human-like AI voices in seconds.",
      icon: <Music className="w-5 h-5 text-emerald-400" />,
      color: "from-emerald-500 to-teal-500",
      img: "/features/voice-gen.png",
    },
    {
      title: "Code Generation",
      desc: "Let AI write clean, efficient, and production-ready code.",
      icon: <Code className="w-5 h-5 text-indigo-400" />,
      color: "from-indigo-500 to-blue-500",
      img: "/features/code-gen.png",
    },
  ];

  return (
    <main className="min-h-screen bg-[#000000] text-zinc-50 flex flex-col items-center overflow-x-hidden relative selection:bg-zinc-800">
      {/* Subtle Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[24px_24px] pointer-events-none z-0" />

      {/* Background Glows */}
      <div className="absolute top-0 w-full h-[500px] bg-indigo-500/10 blur-[120px] rounded-[100%] pointer-events-none -translate-y-1/2 z-0" />

      <Header />

      <div className="flex-1 flex flex-col items-center justify-center w-full mt-32 px-6 z-10 mb-32">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex flex-col items-center max-w-5xl text-center"
        >
          {/* Linear-style Pill */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-zinc-800 bg-zinc-900/50 backdrop-blur-md mb-8 shadow-sm cursor-default"
          >
            <Zap className="w-4 h-4 text-indigo-400 fill-indigo-400/20" />
            <span className="text-sm font-medium text-zinc-300">Genius AI is now available</span>
          </motion.div>

          {/* Heading */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-8 leading-[1.1] text-zinc-100">
            Create at the speed <br className="hidden md:block" />
            of <span className="text-transparent bg-clip-text bg-linear-to-r from-zinc-400 to-zinc-600">thought.</span>
          </h1>

          {/* Subtext */}
          <p className="text-lg md:text-xl text-zinc-400 mb-10 max-w-2xl leading-relaxed">
            The ultimate AI creative tool suite. Generate high-quality images, videos, audio, and code seamlessly — all in one unified workspace.
          </p>

          {/* CTA Group */}
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
            <Button
              onClick={() => router.push("/sign-in")}
              className="h-14 px-8 text-base rounded-full bg-zinc-100 text-zinc-900 hover:bg-white hover:scale-105 transition-all duration-300 font-medium border border-transparent shadow-[0_0_40px_rgba(255,255,255,0.1)] group flex items-center gap-2 w-full sm:w-auto"
            >
              Start creating free
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button
              variant="outline"
              onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })}
              className="h-14 px-8 text-base rounded-full bg-zinc-900/50 text-zinc-300 hover:text-white hover:bg-zinc-800 hover:border-zinc-700 border-zinc-800 transition-all font-medium backdrop-blur-md w-full sm:w-auto"
            >
              Explore features
            </Button>
          </div>
        </motion.div>

        {/* Linear style Feature Grid */}
        <motion.section
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="mt-32 w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-6 px-4"
        >
          {features.map((feature, idx) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + idx * 0.1, duration: 0.6 }}
              key={feature.title}
              className="group relative overflow-hidden bg-zinc-950/80 border border-zinc-900 rounded-[2rem] p-8 md:p-10 transition-all duration-500 hover:bg-zinc-900 hover:border-zinc-800 backdrop-blur-xl flex flex-col justify-between"
            >
              {/* Subtle gradient background based on feature */}
              <div className={`absolute top-0 right-0 w-64 h-64 bg-linear-to-br ${feature.color} blur-[100px] opacity-0 group-hover:opacity-10 transition-opacity duration-700 pointer-events-none`} />

              <div className="relative z-10 flex flex-col mb-10">
                <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center mb-6 shadow-sm">
                  {feature.icon}
                </div>
                <h3 className="font-semibold text-2xl text-zinc-100 mb-3 tracking-tight">{feature.title}</h3>
                <p className="text-zinc-400 leading-relaxed text-base md:text-lg max-w-md">{feature.desc}</p>
                <div className="mt-8 flex items-center text-sm font-medium text-zinc-300 group-hover:text-white transition-colors duration-300">
                  <span className="border-b border-transparent group-hover:border-zinc-300 transition-colors pb-0.5">
                    Explore {feature.title.split(' ')[0]}
                  </span>
                  <ArrowRight className="w-4 h-4 ml-2 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                </div>
              </div>

              {/* Enhanced image presentation */}
              <div className="relative w-full h-48 md:h-64 mt-auto rounded-xl overflow-hidden bg-zinc-900/50 border border-zinc-800/50 group-hover:border-zinc-700/50 transition-colors duration-500 flex items-center justify-center p-4">
                <div className="relative w-full h-full opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 drop-shadow-2xl">
                  <Image
                    src={feature.img}
                    alt={feature.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority={idx < 2}
                    className="object-contain"
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </motion.section>
      </div>

      {/* Bottom fade out */}
      <div className="relative w-full h-32 bg-linear-to-t from-black to-transparent pointer-events-none mt-auto" />
    </main>
  );
}
