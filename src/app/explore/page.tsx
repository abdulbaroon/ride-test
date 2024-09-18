import { ExploreMap } from "@/components/page";
import CustomLayout from "@/layout/CustomLayout";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Chasing Watts | Explore",
    description: "Explore for Chasing Watts",
};
const page = () => {
    return(
        <CustomLayout>
         <ExploreMap />
        </CustomLayout>
      ); 

};

export default page;
