
"use client"
import { navLogo } from "@/assets"
import Link from "next/link"
import { FaFacebookF, FaHeart, FaInstagram, FaTwitter } from "react-icons/fa"

const Footer = () => {
    return (
        <footer className=" bg-violet " >
            <div className="w-11/12 mx-auto py-5 flex justify-between">
                <div className="flex items-center text-sm ">
                    <p className="text-gray-300 flex items-center gap-1">© All rights reserved. Made with<span className="text-red-900 text-xl">{" "}<FaHeart />{" "}</span>
                        by <Link className="hover:text-white font-bold" href={"#"} > {" "}Chasing Watts LLC</Link></p>

                </div>
                <div className="flex items-center gap-16">
                    <div className="ms-6">
                        <ul className="text-gray-400 text-sm flex gap-5 py-4 cursor-pointer">
                            <li className="hover:text-white">Privacy</li>
                            <li className="hover:text-white">Support</li>
                            <li className="hover:text-white">Contact</li>
                        </ul>
                    </div>
                    <div className="flex gap-3">
                        <div className=" bg-lightViolet rounded-full w-8 h-8 flex items-center justify-center hover:bg-white text-white hover:text-sky-500">
                            <FaFacebookF className="text-lg " />
                        </div>
                        <div className=" bg-lightViolet rounded-full w-8 h-8 flex items-center justify-center hover:bg-white text-white hover:text-sky-500">
                            <FaInstagram className="text-lg " />
                        </div>
                        <div className=" bg-lightViolet rounded-full w-8 h-8 flex items-center justify-center hover:bg-white text-white hover:text-sky-500">
                            <FaTwitter className="text-lg " />
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}
export default Footer