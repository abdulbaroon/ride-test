import { LoginPage } from "../../../components/page";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Chasing Watts | Login",
    description: "Log in to Chasing Watts",
};

const Login = () => {
    return <LoginPage />;
};

export default Login;
