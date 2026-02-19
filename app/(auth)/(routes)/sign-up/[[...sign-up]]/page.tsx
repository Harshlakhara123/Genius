"use client";

import { useEffect } from "react";
import { useUser, SignUp } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export default function SignUpPage() {
  const { isSignedIn } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isSignedIn) {
      router.push("/dashboard"); // ✅ same route
    }
  }, [isSignedIn, router]);

  return (
    <div className="flex items-center justify-center h-screen">
      <SignUp forceRedirectUrl="/dashboard" />
    </div>
  );
}
