import type { Metadata } from "next";
import { Inter } from "next/font/google";
import ReduxProvider from "@/shared/providers/ReduxProvider";
import "./globals.css";
import "react-toastify/ReactToastify.css";
import "react-quill/dist/quill.snow.css";
import "react-datepicker/dist/react-datepicker.css";
import "@progress/kendo-theme-default/dist/all.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Chakra from "@/shared/providers/Chakra";
import MainLayout from "@/shared/providers/MainLayout";

// Import FontAwesome for icons
import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
config.autoAddCss = false;

// Load the Inter font from Google Fonts
const inter = Inter({ subsets: ["latin"] });

/**
 * Metadata for the application.
 *
 * This metadata is used for SEO and social media sharing.
 */
export const metadata: Metadata = {
    title: "Chasing Watts",
    description: "Chasing Watts - Connecting Cyclists",
    openGraph: {
        images: "https://chasingwatts.com/images/chasingwatts.svg",
    },
};

/**
 * Root layout component for the application.
 *
 * This component wraps all pages and includes providers for state management
 * and UI libraries.
 *
 * @param {React.ReactNode} children - The child components to be rendered within this layout.
 * @returns {JSX.Element} The rendered layout.
 */
export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang='en'>
            <body>
                <ReduxProvider>
                    <MainLayout>
                        <Chakra>{children}</Chakra>
                    </MainLayout>
                </ReduxProvider>
            </body>
        </html>
    );
}
