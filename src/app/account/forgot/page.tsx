import { ForgotPage } from "../../../components/page";
import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Chasing Watts | Forgot Password",
    description: "Reset your password for Chasing Watts",
};

const ForgotPassword = () => {
    return <ForgotPage />;
};

export default ForgotPassword;
