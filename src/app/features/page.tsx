import { FeaturesPage } from "@/components/page";
import CustomLayout from "@/layout/CustomLayout";
import { Metadata } from "next";

/**
 * Metadata for the Features page.
 * @type {Metadata}
 * @property {string} title - The title of the page.
 * @property {string} description - A brief description of the page.
 */
export const metadata: Metadata = {
  title: "Chasing Watts | Features",
  description: "Features for Chasing Watts",
};

/**
 * Features page component.
 *
 * This page renders the FeaturesPage component within a custom layout to showcase the features of Chasing Watts.
 *
 * @returns {JSX.Element} The rendered Features page.
 */
const page = (): JSX.Element => {
  return (
    <CustomLayout>
      <FeaturesPage />
    </CustomLayout>
  );
};

export default page;

