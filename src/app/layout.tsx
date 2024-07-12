import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css"
import ReduxProvider from "@/shared/providers/ReduxProvider";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import NavBar from "@/components/basic/Navbar";
import Footer from "@/components/basic/Footer";
import NextTopLoader from "nextjs-toploader";
import 'react-quill/dist/quill.snow.css';
import CustomLayout from "@/layout/CustomLayout";

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
          <ToastContainer position="top-right" />
          <NextTopLoader
            color="#29a9e1"
            initialPosition={0.08}
            crawlSpeed={200}
            height={4}
            crawl={true}
            showSpinner={true}
            easing="ease"
            speed={200}
            shadow="0 0 10px #d8ae76,0 0 5px #d8ae76"
            zIndex={1600}
            showAtBottom={false}
          />
          <CustomLayout>
            {children}
          </CustomLayout>
        </ReduxProvider>
      </body>
    </html>
  );
}
