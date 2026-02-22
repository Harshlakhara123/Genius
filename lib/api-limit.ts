import { auth, currentUser } from "@clerk/nextjs/server";
import { ConvexHttpClient } from "convex/browser";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export const checkApiLimit = async () => {
    const user = await currentUser();

    if (!user || user.emailAddresses.length === 0) {
        return false;
    }

    const email = user.emailAddresses[0].emailAddress;

    const { api } = await import("@/convex/_generated/api");

    const hasAccess = await convex.query(api.apiLimit.checkApiLimit, {
        email,
    });

    return hasAccess;
};

export const increaseApiLimit = async () => {
    const user = await currentUser();

    if (!user || user.emailAddresses.length === 0) {
        return;
    }

    const email = user.emailAddresses[0].emailAddress;

    const { api } = await import("@/convex/_generated/api");

    await convex.mutation(api.apiLimit.increaseApiLimit, {
        email,
    });
};

export const getApiLimitCount = async () => {
    const user = await currentUser();

    if (!user || user.emailAddresses.length === 0) {
        return 0;
    }

    const email = user.emailAddresses[0].emailAddress;

    const { api } = await import("@/convex/_generated/api");

    const limitCount = await convex.query(api.apiLimit.getApiLimitCount, {
        email,
    });

    return limitCount;
};
