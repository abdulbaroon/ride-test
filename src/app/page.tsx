import { HomePage } from "../components/page";
import React from "react";
import { Metadata } from "next";
import CustomLayout from "@/layout/CustomLayout";

// Metadata for the Home page
export const metadata: Metadata = {
  title: "Chasing Watts | Home",
  description: "Welcome to Chasing Watts",
};

/**
 * Home component that renders the main landing page.
 *
 * This component wraps the HomePage component inside a CustomLayout
 * to ensure consistent styling and structure across the application.
 *
 * @returns {JSX.Element} The rendered Home component.
 */
const Home = () => {
  return (
    <CustomLayout>
      <HomePage />
    </CustomLayout>
  );
};

export default Home;
