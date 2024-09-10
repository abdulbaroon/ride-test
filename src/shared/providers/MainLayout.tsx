"use client"
import { BackToTop } from '@/components/basic/BackToTop';
import NextTopLoader from 'nextjs-toploader';
import React, { ReactNode } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/ReactToastify.css';
interface MainLayoutProps {
    children: ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
    return (
        <>
            <ToastContainer position="top-right" />
            <BackToTop/>
            <NextTopLoader
                color="#29a9e1"
                initialPosition={0.08}
                crawlSpeed={200}
                height={4}
                crawl={true}
                showSpinner={false}
                easing="ease"
                speed={200}
                shadow="0 0 10px #d8ae76,0 0 5px #d8ae76"
                zIndex={1600}
                showAtBottom={false}
            />
            {children}
        </>
    );
};

export default MainLayout;