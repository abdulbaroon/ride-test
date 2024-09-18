import { Friend } from "@/components/page";
import React, { FC } from "react";
import { Metadata } from "next";
import CustomLayout from "@/layout/CustomLayout";

export const metadata: Metadata = {
    title: "Chasing Watts | Friend",
    description: "Friends for Chasing Watts",
};

interface PageProps {
    params: {
        id: number;
    };
}

const Page: FC<PageProps> = ({ params }) => {
    const { id } = params;

    return(
        <CustomLayout>
          <Friend id={id} />
        </CustomLayout>
      );
};

export default Page;
