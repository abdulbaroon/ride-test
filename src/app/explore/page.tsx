import { ExploreMap } from "@/components/page";
import CustomLayout from "@/layout/CustomLayout";
import { Metadata } from "next";

/**
 * Metadata for the Explore page.
 * @type {Metadata}
 * @property {string} title - The title of the page.
 * @property {string} description - A brief description of the page.
 */
export const metadata: Metadata = {
  title: "Chasing Watts | Explore",
  description: "Explore for Chasing Watts",
};

/**
 * Explore page component.
 *
 * This page renders the ExploreMap component within a custom layout for users to explore the map.
 *
 * @returns {JSX.Element} The rendered Explore page.
 */
const page = (): JSX.Element => {
  return (
    <CustomLayout>
      <ExploreMap />
    </CustomLayout>
  );
};

export default page;
