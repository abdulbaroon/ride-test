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
import CustomLayout from "@/layout/CustomLayout";
import Chakra from "@/shared/providers/Chakra";
import MainLayout from "@/shared/providers/MainLayout";
import Navbar from "@/components/basic/Navbar";
import { registerLicense } from "@syncfusion/ej2-base";

import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
config.autoAddCss = false;

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "ChasingWattsWeb",
    description: "ChasingWattsWeb next app",
    openGraph: {
        images:  "https://dev.chasingwatts.com/ridepictures/ridepicture_32497_981.png" 
      },
};
registerLicense(
    "Ngo9BigBOggjHTQxAR8/V1NCaF1cWWhAYVVpR2Nbe055flRBalxZVAciSV9jS3pTfkZjWXZfd3RdT2JYWQ=="
);

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
                        <Chakra>
                            <CustomLayout>
                                <Navbar />
                                {children}
                            </CustomLayout>
                        </Chakra>
                    </MainLayout>
                </ReduxProvider>
            </body>
        </html>
    );
}
