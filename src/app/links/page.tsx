import { Links } from "@/components/page";
import React from "react";
import { Metadata } from "next";

/**
 * Metadata for the Links page.
 * @type {Metadata}
 * @property {string} title - The title of the page.
 * @property {string} description - A brief description of the page.
 */
export const metadata: Metadata = {
  title: "Chasing Watts | Links",
  description: "Chasing Watts - Connecting Cyclists",
};

/**
 * Links page component.
 *
 * This page displays the various links relevant to Chasing Watts.
 *
 * @returns {JSX.Element} The rendered Links page.
 */
const page = (): JSX.Element => {
  return <Links />;
};

export default page;
