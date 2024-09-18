import { ManageNotification } from "@/components/page";
import CustomLayout from "@/layout/CustomLayout";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Chasing Watts | Notification",
  description: "Notification for Chasing Watts",
};
const page = () => {
  return (
    <CustomLayout>
      <ManageNotification />;
    </CustomLayout>
  );
};

export default page;
