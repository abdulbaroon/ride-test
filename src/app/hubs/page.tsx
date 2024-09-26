import { Hubs } from "@/components/page";
import React from "react";
import { Metadata } from "next";

/**
 * Metadata for the Hubs page.
 * @type {Metadata}
 * @property {string} title - The title of the page.
 * @property {string} description - A brief description of the page.
 */
export const metadata: Metadata = {
  title: "Chasing Watts | Hubs",
  description: "Hubs for Chasing Watts",
};

/**
 * Hubs page component.
 *
 * This page renders the Hubs component, displaying available hubs for users.
 *
 * @returns {JSX.Element} The rendered Hubs page.
 */
const page = (): JSX.Element => {
  return <Hubs />;
};

export default page;
