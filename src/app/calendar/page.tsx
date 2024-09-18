import { Calender } from "@/components/page";
import CustomLayout from "@/layout/CustomLayout";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Chasing Watts | Calendar",
    description: "Calendar for Chasing Watts",
};

const Page = () => {
    return(
        <CustomLayout>
         <Calender />;
        </CustomLayout>
      ); 
};

export default Page;
