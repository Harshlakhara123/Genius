"use client";

import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export default function Header() {
  const router = useRouter();

  return (
    <header className="flex justify-end items-center p-4 gap-4 h-16 absolute top-0 right-0 z-50">
      <SignedOut>
        <SignInButton>
          <button
            onClick={() => router.push("/sign-in")}
            className="border border-gray-400 text-white bg-transparent rounded-full px-4 py-2 hover:bg-white/10 transition"
          >
            Sign In
          </button>
        </SignInButton>

        <SignUpButton>
          <button
            onClick={() => router.push("/sign-up")}
            className="bg-[#6c47ff] text-white rounded-full font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 cursor-pointer hover:bg-[#5b38e0] transition"
          >
            Sign Up
          </button>
        </SignUpButton>
      </SignedOut>

      <SignedIn>
        <UserButton />
      </SignedIn>
    </header>
  );
}
