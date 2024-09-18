import { ResetPasswordPage } from "@/components/page";
import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Chasing Watts | Reset Password",
    description: "ResetPassword for Chasing Watts",
};

const Page = () => {
    return <ResetPasswordPage />;
};

export default Page;
