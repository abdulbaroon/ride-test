import { FeaturesPage } from "@/components/page";
import CustomLayout from "@/layout/CustomLayout";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Chasing Watts | Features",
    description: "Features for Chasing Watts",
};
const page = () => {
    return (
        <>
            <CustomLayout>
            <FeaturesPage />
            </CustomLayout>
        </>
    );
};

export default page;
