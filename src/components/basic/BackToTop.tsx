'use client'
import {motion, useAnimationControls, useScroll} from 'framer-motion'
import { useEffect } from 'react';
import { FaArrowUp } from 'react-icons/fa';
import { IoIosArrowUp } from 'react-icons/io';

const isBrowser = () => typeof window !== 'undefined'; 

function scrollToTop() {
    if (!isBrowser()) return;
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

const ScrollToTopContainerVariants = {
    hide: { opacity: 0, x: 100 },
    show: { opacity: 1, x: 0 },
};

export function BackToTop() {
    const { scrollYProgress } = useScroll();
    const controls = useAnimationControls();

    useEffect(() => {
        return scrollYProgress.on('change', (latestValue) => {
            if (latestValue > 0.1) {
                controls.start('show');
            } else {
                controls.start('hide');
            }  
        });
    },[scrollYProgress,controls]);

    return (
        <motion.button
            className="fixed bottom-0 right-0 p-[10px] m-6 rounded-full bg-[#1f1b2d40]"
            variants={ScrollToTopContainerVariants}
            initial="hide"
            animate={controls}
            onClick={scrollToTop}
            >
            <IoIosArrowUp className='text-white text-2xl' />
        </motion.button>
    );
}