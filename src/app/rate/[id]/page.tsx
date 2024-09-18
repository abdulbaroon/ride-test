import { RatingPage } from "@/components/page";
import React, { FC } from "react";
interface PageProps {
  params: {
    id: number;
  };
}

import { Metadata } from "next";
import CustomLayout from "@/layout/CustomLayout";

export const metadata: Metadata = {
  title: "Chasing Watts | Ride Rating",
  description: "Rating for Chasing Watts",
};

const Page: FC<PageProps> = ({ params }) => {
  const { id } = params;
  return (
    <CustomLayout>
      <RatingPage id={id} />;
    </CustomLayout>
  );
};

export default Page;
