import type { Metadata } from "next";
import { Inter } from "next/font/google";
import ReduxProvider from "@/shared/providers/ReduxProvider";
import { ToastContainer } from "react-toastify";
import "./globals.css"
import 'react-toastify/dist/ReactToastify.css';
import 'react-quill/dist/quill.snow.css';
import "react-datepicker/dist/react-datepicker.css";
import '@progress/kendo-theme-default/dist/all.css';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import NextTopLoader from "nextjs-toploader";
import CustomLayout from "@/layout/CustomLayout";
import Chakra from "@/shared/providers/Chakra";
import MainLayout from "@/shared/providers/MainLayout";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ChasingWattsWeb",
  description: "ChasingWattsWeb next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body >
        <ReduxProvider>
          <MainLayout>
            <Chakra>
              <CustomLayout>
                {children}
              </CustomLayout>
            </Chakra>
          </MainLayout>
        </ReduxProvider>
      </body>
    </html>
  );
}
