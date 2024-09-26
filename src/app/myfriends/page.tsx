import { MyFriends } from "@/components/page";
import CustomLayout from "@/layout/CustomLayout";
import { Metadata } from "next";

/**
 * Metadata for the My Friends page.
 * @type {Metadata}
 * @property {string} title - The title of the page.
 * @property {string} description - A brief description of the page.
 */
export const metadata: Metadata = {
  title: "Chasing Watts | MyFriends",
  description: "My Friends for Chasing Watts",
};

/**
 * My Friends page component.
 *
 * This page displays the user's friends within the Chasing Watts platform.
 *
 * @returns {JSX.Element} The rendered My Friends page.
 */
const page = (): JSX.Element => {
  return (
    <CustomLayout>
      <MyFriends />
    </CustomLayout>
  );
};

export default page;
