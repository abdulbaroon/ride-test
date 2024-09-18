import { DashboardPage } from "@/components/page";
import React from "react";
import { Metadata } from "next";
import CustomLayout from "@/layout/CustomLayout";

export const metadata: Metadata = {
    title: "Chasing Watts | Dashboard",
    description: "Dashboard for Chasing Watts",
};

const Dashboard = () => {
    return(
        <CustomLayout>
          <DashboardPage />;
        </CustomLayout>
      );
};

export default Dashboard;
