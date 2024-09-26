import { HubDetails } from "@/components/page";
import React, { FC } from "react";
import { Metadata } from "next";

/**
 * Metadata for the Hub Detail page.
 * @type {Metadata}
 * @property {string} title - The title of the page.
 * @property {string} description - A brief description of the page.
 */
export const metadata: Metadata = {
  title: "Chasing Watts | Hub Detail",
  description: "Hubs for Chasing Watts",
};

/**
 * Props for the Page component.
 * @typedef {Object} PageProps
 * @property {Object} params - The route parameters.
 * @property {number} params.id - The ID of the hub.
 */
interface PageProps {
  params: {
    id: number;
  };
}

/**
 * Hub Detail page component.
 *
 * This page renders the HubDetails component for a specific hub, identified by its ID.
 *
 * @param {PageProps} props - The component props.
 * @returns {JSX.Element} The rendered Hub Detail page.
 */
const Page: FC<PageProps> = ({ params }) => {
  const { id } = params;
  return <HubDetails hubId={id} />;
};

export default Page;
