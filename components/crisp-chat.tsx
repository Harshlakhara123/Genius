"use client";

import { useEffect } from "react";
import { Crisp } from "crisp-sdk-web";

export const CrispChat = () => {
    useEffect(() => {
        Crisp.configure("22577c6e-5519-42c7-afcd-ca61ecbb3374");
    }, []);

    return null;
};
