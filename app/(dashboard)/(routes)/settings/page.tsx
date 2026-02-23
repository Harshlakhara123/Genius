import { Heading } from "@/components/heading";
import { Settings } from "lucide-react";
import { checkSubscription } from "@/lib/subscription";
import { currentUser } from "@clerk/nextjs/server";
import { SubscriptionButton } from "@/components/subscription-button";

const settingsPage = async () => {
    const isPro = await checkSubscription();
    const user = await currentUser();
    const email = user?.emailAddresses?.[0]?.emailAddress ?? "Unknown";

    return (
        <div>
            <Heading
                title="Settings"
                description="Manage your account settings"
                icon={Settings}
                iconColor="text-gray-700"
                bgColor="bg-gray-700/10"
            />
            <div className="px-4 lg:px-8 space-y-4">
                <div className="text-muted-foreground text-sm space-y-2">
                    <div>
                        <span className="font-semibold text-gray-900">Email:</span> {email}
                    </div>
                    <div>
                        <span className="font-semibold text-gray-900">Plan:</span> {isPro ? "Pro Member" : "Free Member"}
                    </div>
                </div>
                <SubscriptionButton isPro={isPro} />
            </div>
        </div>
    );
};

export default settingsPage;