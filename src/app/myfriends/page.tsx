import { MyFriends } from "@/components/page";
import CustomLayout from "@/layout/CustomLayout";
import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Chasing Watts | MyFriends",
  description: "My Friends for Chasing Watts",
};
const page = () => {
  return (
    <CustomLayout>
      <MyFriends />
    </CustomLayout>
  );
};

export default page;
