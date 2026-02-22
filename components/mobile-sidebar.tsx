"use client";
import { Menu } from "lucide-react";
import Sidebar from "@/components/sidebar";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { useEffect, useState } from "react";

interface MobileSidebarProps {
    apiLimitCount: number;
}

const MobileSidebar = ({
    apiLimitCount = 0
}: MobileSidebarProps) => {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return null;
    }
    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                    <Menu />
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0">
                <SheetTitle className="sr-only">Menu</SheetTitle>
                <Sidebar apiLimitCount={apiLimitCount} />
            </SheetContent>
        </Sheet>
    );
}

export default MobileSidebar;