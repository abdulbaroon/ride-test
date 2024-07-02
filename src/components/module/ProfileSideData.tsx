"use client"
import { profileData } from '@/constant'
import { deleteCookies } from '@/shared/util/auth.util'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React from 'react'

type Props = {
    name?: string
}

const ProfileSideData: React.FC<Props> = ({ name }) => {
    const router = useRouter()
    const handelLogOut =()=>{
       router.push("/")
       deleteCookies()
    }
    return (
        <>
            <div className='border border-gray-300 rounded-2xl w-full desktop:w-[25%] bg-white shadow-lg overflow-hidden h-fit'>
                <div className='bg-gray-300 border-b border-gray-400'><h1 className=' font-bold py-3 px-4 text-gray-800'>{name}</h1></div>
                {profileData.map(({ name, icon }, index) => {
                    return (
                        <div className='border-b border-gray-300  py-3 px-4 flex gap-3 items-center  '>
                            <div className='text-gray-400 text-xl'>
                                {React.createElement(icon)}
                            </div>
                            {name==="Sign Out"?
                            <p className='text-gray-600 cursor-pointer ' onClick={handelLogOut}>{name}</p>
                            :<Link href={"#"} className='text-gray-700'>{name}</Link>
                            }
                        </div>  
                    )
                })}
            </div>
        </>
    )
}

export default ProfileSideData