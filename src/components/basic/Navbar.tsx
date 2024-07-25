"use client";
import { navLogo } from "@/assets";
import { refreshToken } from "@/redux/slices/authSlice";
import { AppDispatch, RootState } from "@/redux/store/store";
import { User } from "@/shared/types/account.types";
import { getCookie } from "cookies-next";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaBell } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";

const Navbar = () => {
    const router = useRouter();
    const [user, setUser] = useState<string>();
    const dispatch = useDispatch<AppDispatch>();
    const userData = useSelector<RootState>((state) => state.auth.user) as User;
    const token = useSelector<RootState>((state) => state.auth.token);
    useEffect(() => {
        const userCookie = getCookie("user");
        if (userCookie) {
            setUser(userCookie);
        } else {
            setUser("");
        }
    }, [userData, token]);

    useEffect(() => {
        //   const response = dispatch(refreshToken())  
    }, [])
    return (
        <header className=" bg-secondaryButton fixed top-0 w-full z-50" >
            <div className="w-11/12 mx-auto py-4 flex justify-between">
                <div className="flex items-center ">
                    <div className="">
                        <Link href={"/"}>
                            <img src={navLogo.src} alt='logo' />
                        </Link>
                    </div>
                    <div className="ms-6 ">
                        <div className="text-gray-400 font-semibold hidden tablet:flex gap-5 py-4 cursor-pointer">
                            {user ? <Link href={"/dashboard"} className=" hover:text-white ">Dashboard</Link> :
                                <Link href={"#"} className="border-r pe-4 hover:text-white ">Register</Link>}
                            {user ? <Link href={"/ride/add"} className="hover:text-white">Add Ride</Link>
                                : <Link href={"/features"} className="hover:text-white">Feature</Link>}
                            <Link href={"/ride/search"} className="hover:text-white">Search</Link>
                            <Link href={"ride/calender"} className="hover:text-white">Calender</Link>
                            {user && <Link href={"#"} className="hover:text-white">Hubs</Link>}
                            <Link href={"#"} className="hover:text-white">About Us</Link>
                        </div>
                    </div>
                </div>
                <div className='flex items-center gap-4'>
                    {user ? (
                        <>
                            <FaBell className='text-xl text-white' />
                            <Link href={"/account/profile"}>
                                <div className='relative w-10 h-10 overflow-hidden bg-gray-100 rounded-full '>
                                    <svg
                                        className='absolute w-12 h-12 text-gray-400 -left-1'
                                        fill='currentColor'
                                        viewBox='0 0 20 20'
                                        xmlns='http://www.w3.org/2000/svg'>
                                        <path
                                            fillRule='evenodd'
                                            d='M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z'
                                            clipRule='evenodd'></path>
                                    </svg>
                                </div>
                            </Link>
                        </>
                    ) : (
                        <button
                            onClick={() => router.push("/account/login")}
                            className='bg-primaryText text-white px-4 py-[6px] rounded-lg font-bold'>
                            sign in
                        </button>
                    )}
                </div>
            </div>
        </header>
    );
};
export default Navbar;
