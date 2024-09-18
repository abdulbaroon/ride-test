import { ProfilePage } from "@/components/page";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Chasing Watts | Profile",
    description: "Chasing Watts Profile",
};

const Profile = () => {
    return <ProfilePage />;
};

export default Profile;
