import { Calender } from "@/components/page";
import CustomLayout from "@/layout/CustomLayout";
import { Metadata } from "next";

/**
 * Metadata for the Calendar page.
 * @type {Metadata}
 * @property {string} title - The title of the page.
 * @property {string} description - A brief description of the page.
 */
export const metadata: Metadata = {
  title: "Chasing Watts | Calendar",
  description: "Calendar for Chasing Watts",
};

/**
 * Calendar page component.
 *
 * This page renders the Calendar component within a custom layout.
 *
 * @returns {JSX.Element} The rendered Calendar page.
 */
const Page = (): JSX.Element => {
  return (
    <CustomLayout>
      <Calender />
    </CustomLayout>
  );
};

export default Page;
