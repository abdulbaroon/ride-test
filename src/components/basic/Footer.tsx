"use client";
import { navLogo } from "@/assets";
import Link from "next/link";
import { FaFacebookF, FaHeart, FaInstagram, FaTwitter } from "react-icons/fa";
import { motion } from "framer-motion";

const Footer = () => {
  return (
    <footer className=" bg-violet mt-auto">
      <div className="w-11/12 !max-w-[1320px] mx-auto py-5 tablet:gap-0 gap-5 flex justify-between flex-col-reverse tablet:flex-row items-center">
        <div className="flex  items-center text-xs desktop:text-sm ">
          <p className="text-gray-300 flex items-center gap-1">
            © All rights reserved. Made with
            <span className="text-red-900 text-xl">
              {" "}
              <FaHeart />{" "}
            </span>
            by{" "}
            <Link className="hover:text-white font-bold" href={"#"}>
              {" "}
              Chasing Watts LLC
            </Link>
          </p>
        </div>
        <div className="flex items-center flex-col tablet:flex-row gap-1 tablet:gap-16">
          <div className="ms-6">
            <ul className="text-gray-400 text-sm flex gap-5  py-4 cursor-pointer">
              <li className="hover:text-white">Privacy</li>
              <li className="hover:text-white">Support</li>
              <li className="hover:text-white">Contact</li>
            </ul>
          </div>
          <div className="flex gap-3">
            <Link
              href={"https://www.facebook.com/chasingwatts"}
              target="_blank"
            >
              <motion.div
                initial={{ scale: 1 }}
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.98 }}
                className=" transform transition duration-300 bg-lightViolet rounded-full w-[34px] h-[34px] flex items-center justify-center hover:bg-white text-white hover:text-sky-500"
              >
                <FaFacebookF className="text-lg " />
              </motion.div>
            </Link>
            <Link
              href={"https:/www.instagram/chasing_watts"}
              target="_blank"
            >
              <motion.div
                initial={{ scale: 1 }}
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.98 }}
                className="transform transition duration-300 bg-lightViolet rounded-full w-[34px] h-[34px] flex items-center justify-center hover:bg-white text-white hover:text-sky-500"
              >
                <FaInstagram className="text-lg " />
              </motion.div>
            </Link>
            <Link
              href={"https://twitter.com/chasing_watts"}
              target="_blank"
            >
              <motion.div
                initial={{ scale: 1 }}
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.98 }}
                className="transform transition duration-300 bg-lightViolet rounded-full w-[34px] h-[34px] flex items-center justify-center hover:bg-white text-white hover:text-sky-500"
              >
                <FaTwitter className="text-lg " />
              </motion.div>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
export default Footer;
