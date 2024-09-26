import { LoginPage } from "../../../components/page";
import { Metadata } from "next";

/**
 * Metadata for the Login page.
 * @type {Metadata}
 * @property {string} title - The title of the page.
 * @property {string} description - A brief description of the page.
 */
export const metadata: Metadata = {
  title: "Chasing Watts | Login",
  description: "Log in to Chasing Watts",
};

/**
 * Login page component.
 *
 * This page renders the LoginPage component for users to log in to the platform.
 *
 * @returns {JSX.Element} The rendered Login page.
 */
const Login = (): JSX.Element => {
  return <LoginPage />;
};

export default Login;
