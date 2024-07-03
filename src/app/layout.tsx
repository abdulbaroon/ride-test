import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css"
import ReduxProvider from "@/shared/providers/ReduxProvider";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { Header } from "@/layout";
import NavBar from "@/components/basic/Navbar";
import Footer from "@/components/basic/Footer";

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
          {/* <NavBar /> */}
        <Header />
          {children}
          <Footer />
        </ReduxProvider>
      </body>
    </html>
  );
}
