import { Contact } from "@/components/page";
import React from "react";
import { Metadata } from "next";
import CustomLayout from "@/layout/CustomLayout";

export const metadata: Metadata = {
    title: "Chasing Watts | Contact Us",
    description: "Chasing Watts - Connecting Cyclists",
};

const page = () => {
    return(
        <CustomLayout>
          <Contact />;
        </CustomLayout>
      ); 
};

export default page;
