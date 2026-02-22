"use client";

import { useEffect, useState } from "react";
import { Zap } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface FreeCounterProps {
    apiLimitCount: number;
}

export const FreeCounter = ({
    apiLimitCount = 0,
}: FreeCounterProps) => {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return null;
    }

    return (
        <div className="px-3 mb-4">
            <Card className="bg-white/10 border-0">
                <CardContent className="py-6">
                    <div className="text-center text-sm text-white mb-4 space-y-2">
                        <p>
                            {apiLimitCount} / 5 Free Generations
                        </p>
                        <Progress
                            className="h-3"
                            value={(apiLimitCount / 5) * 100}
                            indicatorColor="bg-gradient-to-r from-violet-500 via-green-500 to-pink-500"
                        />
                    </div>
                    <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white border-0">
                        Upgrade
                        <Zap className="w-4 h-4 ml-2 fill-white" />
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
};
