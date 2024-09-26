import { ProfilePage } from "@/components/page";
import { Metadata } from "next";

/**
 * Metadata for the Profile page.
 * @type {Metadata}
 * @property {string} title - The title of the page.
 * @property {string} description - A brief description of the page.
 */
export const metadata: Metadata = {
  title: "Chasing Watts | Profile",
  description: "Chasing Watts Profile",
};

/**
 * Profile page component.
 *
 * This page renders the ProfilePage component, which displays user profile information.
 *
 * @returns {JSX.Element} The rendered Profile page.
 */
const Profile = (): JSX.Element => {
  return <ProfilePage />;
};

export default Profile;
