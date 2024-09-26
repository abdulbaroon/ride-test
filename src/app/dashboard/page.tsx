import { DashboardPage } from "@/components/page";
import { Metadata } from "next";
import CustomLayout from "@/layout/CustomLayout";

/**
 * Metadata for the Dashboard page.
 * @type {Metadata}
 * @property {string} title - The title of the page.
 * @property {string} description - A brief description of the page.
 */
export const metadata: Metadata = {
  title: "Chasing Watts | Dashboard",
  description: "Dashboard for Chasing Watts",
};

/**
 * Dashboard page component.
 *
 * This page renders the DashboardPage component within a custom layout for users to view their dashboard.
 *
 * @returns {JSX.Element} The rendered Dashboard page.
 */
const Dashboard = (): JSX.Element => {
  return (
    <CustomLayout>
      <DashboardPage />
    </CustomLayout>
  );
};

export default Dashboard;
