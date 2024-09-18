import { SearchPage } from "@/components/page";
import CustomLayout from "@/layout/CustomLayout";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Chasing Watts | Search",
  description: "Search for Chasing Watts",
};
const Page = () => {
  return (
    <CustomLayout>
      <SearchPage />;
    </CustomLayout>
  );
};

export default Page;
