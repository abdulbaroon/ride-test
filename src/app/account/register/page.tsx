import { RegisterPage } from "../../../components/page";
import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Chasing Watts | Register",
    description: "Create a Chasing Watts account",
};
const Register = () => {
    return <RegisterPage />;
};

export default Register;
