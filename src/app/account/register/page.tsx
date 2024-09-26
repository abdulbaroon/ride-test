import { RegisterPage } from "../../../components/page";
import React from "react";
import { Metadata } from "next";

/**
 * Metadata for the Register page.
 * @type {Metadata}
 * @property {string} title - The title of the page.
 * @property {string} description - A brief description of the page.
 */
export const metadata: Metadata = {
  title: "Chasing Watts | Register",
  description: "Create a Chasing Watts account",
};

/**
 * Register page component.
 *
 * This page renders the RegisterPage component to allow users to create a new Chasing Watts account.
 *
 * @returns {JSX.Element} The rendered Register page.
 */
const Register = (): JSX.Element => {
  return <RegisterPage />;
};

export default Register;
