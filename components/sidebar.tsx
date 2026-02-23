"use client";

import Image from "next/image";
import Link from "next/link";
import { Montserrat } from "next/font/google";
import { cn } from "@/lib/utils";
import {
  Code,
  ImageIcon,
  LayoutDashboard,
  MessageSquare,
  Music,
  Settings,
  VideoIcon,
} from "lucide-react";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { FreeCounter } from "@/components/free-counter";

const montserrat = Montserrat({
  weight: "600",
  subsets: ["latin"],
});

const routes = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    href: "/dashboard",
    color: "text-zinc-200",
  },
  {
    label: "Conversation",
    icon: MessageSquare,
    href: "/conversation",
    color: "text-zinc-300",
  },
  {
    label: "Image Generation",
    icon: ImageIcon,
    href: "/image",
    color: "text-zinc-300",
  },
  {
    label: "Video Generation",
    icon: VideoIcon,
    href: "/video",
    color: "text-zinc-300",
  },
  {
    label: "Music Generation",
    icon: Music,
    href: "/music",
    color: "text-zinc-300",
  },
  {
    label: "Code Generation",
    icon: Code,
    href: "/code",
    color: "text-zinc-300",
  },
  {
    label: "Settings",
    icon: Settings,
    href: "/settings",
    color: "text-zinc-400",
  },
];

interface SidebarProps {
  apiLimitCount: number;
  isPro: boolean;
}

const Sidebar = ({
  apiLimitCount = 0,
  isPro = false,
}: SidebarProps) => {
  const pathname = usePathname();
  return (
    <div className="space-y-4 py-4 flex flex-col h-full bg-[#000000] text-zinc-300 border-r border-zinc-900 z-50">
      {/* Logo Section */}
      <div className="px-3 py-2 flex-1 relative">
        <Link href="/dashboard" className="flex items-center pl-3 mb-14 transition-opacity hover:opacity-80">
          <div className="relative w-8 h-8 mr-4">
            <Image fill alt="Logo" src="/logo_Genius.png" />
          </div>
          <h1 className={cn("text-2xl font-bold tracking-tight text-zinc-100", montserrat.className)}>
            Genius
          </h1>
        </Link>

        {/* Routes Section */}
        <div className="space-y-2">
          {routes.map((route, i) => (
            <motion.div
              key={route.href}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Link
                href={route.href}
                className={cn(
                  "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer rounded-xl transition-all duration-300 hover:text-white hover:bg-zinc-900/80 border border-transparent",
                  pathname === route.href ? "text-white bg-zinc-900 border-zinc-800 shadow-sm" : "text-zinc-400"
                )}
              >
                {/* Icon */}
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  whileTap={{ scale: 0.95 }}
                  className="mr-3 flex items-center justify-center"
                >
                  <route.icon
                    className={cn(
                      "h-5 w-5 transition-colors duration-300 group-hover:text-white",
                      pathname === route.href ? "text-white" : route.color
                    )}
                  />
                </motion.div>

                {/* Label */}
                <span className="text-sm font-medium transition-colors duration-300 group-hover:text-white flex items-center">
                  {route.label}
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="px-3 relative z-10 w-full mb-4">
        <FreeCounter isPro={isPro} apiLimitCount={apiLimitCount} />
      </div>
    </div>
  );
};

export default Sidebar;
