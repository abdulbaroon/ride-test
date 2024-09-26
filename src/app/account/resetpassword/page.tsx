import { ResetPasswordPage } from "@/components/page";
import React from "react";
import { Metadata } from "next";

/**
 * Metadata for the Reset Password page.
 * @type {Metadata}
 * @property {string} title - The title of the page.
 * @property {string} description - A brief description of the page.
 */
export const metadata: Metadata = {
  title: "Chasing Watts | Reset Password",
  description: "Reset Password for Chasing Watts",
};

/**
 * Reset Password page component.
 *
 * This page renders the ResetPasswordPage component for users to reset their password.
 *
 * @returns {JSX.Element} The rendered Reset Password page.
 */
const Page = (): JSX.Element => {
  return <ResetPasswordPage />;
};

export default Page;
