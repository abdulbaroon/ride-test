import { SearchPage } from "@/components/page";
import CustomLayout from "@/layout/CustomLayout";
import { Metadata } from "next";

/**
 * Metadata for the Search page.
 *
 * This metadata is used for SEO and social media sharing.
 */
export const metadata: Metadata = {
  title: "Chasing Watts | Search",
  description: "Search for Chasing Watts",
};

/**
 * Search page component.
 *
 * This component renders the search functionality for the Chasing Watts application.
 *
 * @returns {JSX.Element} The rendered Search page.
 */
const Page = () => {
  return (
    <CustomLayout>
      <SearchPage />
    </CustomLayout>
  );
};

export default Page;
