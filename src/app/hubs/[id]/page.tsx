import { HubDetails } from "@/components/page";
import React, { FC } from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Chasing Watts | Hub Detail",
    description: "Hubs for Chasing Watts",
};

interface PageProps {
    params: {
        id: number;
    };
}
const Page: FC<PageProps> = ({ params }) => {
    const { id } = params;
    return <HubDetails hubId={id} />;
};

export default Page;
