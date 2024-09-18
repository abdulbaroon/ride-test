import { HomePage } from "../components/page";
import React from "react";
import { Metadata } from "next";
import CustomLayout from "@/layout/CustomLayout";

export const metadata: Metadata = {
  title: "Chasing Watts | Home",
  description: "Welcome to Chasing Watts",
};
const Home = () => {
  return (
    <>
      <CustomLayout>
        <HomePage />
      </CustomLayout>
    </>
  );
};

export default Home;
