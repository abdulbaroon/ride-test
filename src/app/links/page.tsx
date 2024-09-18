import { Links } from "@/components/page";
import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Chasing Watts | Links",
    description: "Chasing Watts - Connecting Cyclists",
};

const page = () => {
    return <Links />;
};

export default page;
