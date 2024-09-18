import { Hubs } from "@/components/page";
import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Chasing Watts | Hubs",
    description: "Hubs for Chasing Watts",
};

const page = () => {
    return <Hubs />;
};

export default page;
