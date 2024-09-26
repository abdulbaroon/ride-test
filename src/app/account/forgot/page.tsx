import { ForgotPage } from "../../../components/page";
import React from "react";
import { Metadata } from "next";

/**
 * Metadata for the Forgot Password page.
 * @type {Metadata}
 * @property {string} title - The title of the page.
 * @property {string} description - A brief description of the page.
 */
export const metadata: Metadata = {
  title: "Chasing Watts | Forgot Password",
  description: "Reset your password for Chasing Watts",
};

/**
 * Forgot Password page component.
 *
 * This page renders the ForgotPage component for users to reset their password.
 *
 * @returns {JSX.Element} The rendered Forgot Password page.
 */
const ForgotPassword = (): JSX.Element => {
  return <ForgotPage />;
};

export default ForgotPassword;
