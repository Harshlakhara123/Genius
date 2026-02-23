import { auth, currentUser } from "@clerk/nextjs/server";
import { ConvexHttpClient } from "convex/browser";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export const checkSubscription = async () => {
    const user = await currentUser();

    if (!user || user.emailAddresses.length === 0) {
        return false;
    }

    const email = user.emailAddresses[0].emailAddress;

    const { api } = await import("@/convex/_generated/api");

    const isPro = await convex.query(api.subscription.checkSubscription, {
        email,
    });

    return isPro;
};
