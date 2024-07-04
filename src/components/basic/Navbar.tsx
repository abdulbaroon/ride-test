
"use client"
import { navLogo } from "@/assets"
import { RootState } from "@/redux/store/store"
import { User } from "@/shared/types/account.types"
import { getCookie } from "cookies-next"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { FaBell } from "react-icons/fa"
import { useSelector } from "react-redux"

const NavBar = () => {
    const router = useRouter()
    const [user, setUser] = useState<string>()
    const userData = useSelector<RootState>(
        (state) => state.auth.user
    ) as User
    useEffect(() => {
        const userCookie = getCookie("user")
        if (userCookie) {
            setUser(userCookie)
        }
    }, [userData])
    return (
        <header className=" bg-secondaryButton   " >
            <div className="w-11/12 mx-auto py-4 flex justify-between">
                <div className="flex items-center ">
                    <div className="">
                        <img src={navLogo.src} alt="logo" />
                    </div>
                    <div className="ms-6">
                        <div className="text-gray-400 font-semibold flex gap-5 py-4 cursor-pointer">
                            {user ? <Link href={"#"} className=" hover:text-white ">Dashboard</Link> :
                                <Link href={"#"} className="border-r pe-4 hover:text-white ">Register</Link>}
                            {user ? <Link href={"#"} className="hover:text-white">Add Ride</Link>
                                : <Link href={"#"} className="hover:text-white">Feature</Link>}
                            <Link href={"#"} className="hover:text-white">Search</Link>
                            <Link href={"#"} className="hover:text-white">Calender</Link>
                            {user && <Link href={"#"} className="hover:text-white">Hubs</Link>}
                            <Link href={"#"} className="hover:text-white">About Us</Link>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    {user
                    ?
                        <>
                            <FaBell className="text-xl text-white" />
                            <div className="relative w-10 h-10 overflow-hidden bg-gray-100 rounded-full ">
                                <svg className="absolute w-12 h-12 text-gray-400 -left-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"></path></svg>
                            </div>
                        </>:
                    <button onClick={() => router.push("/account/login")} className="bg-primaryText text-white px-4 py-[6px] rounded-lg font-bold">sign in</button>}
                </div>
            </div>
        </header>
    )
}
export default NavBar