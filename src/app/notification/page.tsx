import { ManageNotification } from "@/components/page";
import CustomLayout from "@/layout/CustomLayout";
import { Metadata } from "next";

/**
 * Metadata for the Notification page.
 * @type {Metadata}
 * @property {string} title - The title of the page.
 * @property {string} description - A brief description of the page.
 */
export const metadata: Metadata = {
  title: "Chasing Watts | Notification",
  description: "Notification for Chasing Watts",
};

/**
 * Notification management page component.
 *
 * This page allows users to manage their notifications within the Chasing Watts platform.
 *
 * @returns {JSX.Element} The rendered Notification management page.
 */
const page = (): JSX.Element => {
  return (
    <CustomLayout>
      <ManageNotification />
    </CustomLayout>
  );
};

export default page;
