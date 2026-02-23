"use client";

import dynamic from "next/dynamic";

const CrispChat = dynamic(() => import("./crisp-chat").then((mod) => mod.CrispChat), {
    ssr: false,
});

export const CrispProvider = () => {
    return <CrispChat />;
};