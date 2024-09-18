"use client";
import React, { ReactNode } from "react"; 
import Footer from "@/components/basic/Footer";
import Navbar from "@/components/basic/Navbar";

interface CustomLayoutProps {
    children: ReactNode;
}

const CustomLayout: React.FC<CustomLayoutProps> = ({ children }) => {
    return (
        <>
            <Navbar />
                {children}
            <Footer />
        </>
    );
};

export default CustomLayout;