"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const ProModal = dynamic(() => import("@/components/pro-modal").then(mod => mod.ProModal), { ssr: false });

export const ModalProvider = () => {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return null;
    }
    return (
        <>
            <ProModal />
        </>
    )
}