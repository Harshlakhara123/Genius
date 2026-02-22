"use client";

import { ConvexProviderWithClerk } from "convex/react-clerk";
import { ConvexReactClient, useMutation } from "convex/react";
import { useAuth, useUser } from "@clerk/nextjs";
import { ReactNode, useEffect } from "react";
import { api } from "@/convex/_generated/api";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

function AuthSync() {
  const { user, isLoaded } = useUser();
  const createUser = useMutation(api.user.create);

  useEffect(() => {
    if (isLoaded && user) {
      const email = user.emailAddresses[0]?.emailAddress;
      if (email) {
        createUser({
          email,
          plan: "free",
          maxCredits: 5,
        }).catch((err) => {
          console.error("Failed to create user during sync:", err);
        });
      }
    }
  }, [user, isLoaded, createUser]);

  return null;
}

export function ConvexClientProvider({ children }: { children: ReactNode }) {
  return (
    <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
      <AuthSync />
      {children}
    </ConvexProviderWithClerk>
  );
}