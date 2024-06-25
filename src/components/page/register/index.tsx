
"use client"
import { accountLogo } from '@/assets';
import Link from 'next/link';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { TbCircleCheck } from "react-icons/tb";
import { FaRegEyeSlash } from "react-icons/fa";
import { IoEyeOutline } from "react-icons/io5";

const logindata = [
    "Quickly add & find rides",
    "Know the details",
    "Web and Mobile"
];

interface LoginFormValues {
    email: string;
    password: string;
    confirm_password: string;
}
export const RegisterPage = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [showConformPassword, setShowConformPassword] = useState(false);

    const { register, handleSubmit, formState: { errors }, watch, getValues } = useForm<LoginFormValues>({
        mode: "onTouched"
    });

    const password = watch("password", "");

    const onSubmit = (data: LoginFormValues) => {
        console.log(data);
    };

    return (
        <div className='min-h-screen w-full flex justify-center items-center bg-[#f5f4f8] '>
            <div className='w-full desktop:w-1/2 mx-auto bg-white border rounded-xl flex items-center flex-col tablet:flex-row'>
                <div className='w-full tablet:w-1/2 p-6 tablet:p-12 tablet:border-r '>
                    <div>
                        <img src={accountLogo.src} alt="Logo" />
                        <h3 className=' text-2xl tablet:text-3xl font-bold pb-6'>Join the community
                            and let's ride!</h3>
                        <div className='mb-3'>
                            {logindata.map((d, index) => (
                                <div className='flex items-center gap-2 mb-2 text-gray-500' key={index}>
                                    <TbCircleCheck className='text-primaryText text-xl' />
                                    <p>{d}</p>
                                </div>
                            ))}
                        </div>
                        <p className='pt-2 tablet:pt-6 tablet:mb-12 text-gray-500'>Don't have an account?  <Link href="/account/login" className='text-primaryText '>Sign in</Link></p>
                    </div>
                </div>
                <div className='w-full tablet:w-1/2 p-6 tablet:p-12 '>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <label className=''>Email address</label>
                        <div className='mb-6'>
                            <input {...register("email", { required: true, pattern: /^\S+@\S+$/i })} className='w-full py-[10px] px-4 border rounded-lg mt-2 ' placeholder='Enter your Email' type='email' />
                            {errors.email && <p className='text-red-500 text-xs '>Email is required</p>}
                        </div>
                        <div className='flex gap-1'>
                            <label className=''>Password</label>
                            <p className='text-gray-400 text-sm mt-1'>min. 6 char</p>
                        </div>
                        <div className='relative'>
                            <div className='mb-6'>
                                <input {...register("password", { required: true, minLength: 6 })} type={showPassword ? "text" : "password"} className='w-full py-[10px] px-4 border rounded-lg mt-2 ' placeholder='Enter Password' />
                                {errors.password && <p className='text-red-500 text-xs '>Password is required and should be at least 6 characters long</p>}
                            </div>
                            <div className='absolute top-5 right-5 cursor-pointer text-gray-500 hover:text-black' onClick={() => setShowPassword(!showPassword)}>
                                {showPassword ? <FaRegEyeSlash className=' text-xl ' /> : <IoEyeOutline className=' text-xl ' />}
                            </div>
                        </div>
                        <label className=''>Conform Password</label>
                        <div className='relative'>                      
                            <div className='mb-2'>         
                                <input     
                                    {...register("confirm_password", {   
                                        required: "Conform Password is required",
                                        validate: (value) => value === password || "Passwords do not match"
                                    })}
                                    type={showConformPassword ? "text" : "password"}
                                    className='w-full py-[10px] px-4 border rounded-lg mt-2 '
                                    placeholder='Enter Conform ' />
                               {<p className='text-red-500 text-xs '>{errors.confirm_password?.message}</p>}
                            </div>
                            <div className='absolute top-5 right-5 cursor-pointer text-gray-500 hover:text-black' onClick={() => setShowConformPassword(!showConformPassword)}>
                                {showConformPassword ? <FaRegEyeSlash className=' text-xl ' /> : <IoEyeOutline className=' text-xl ' />}
                            </div>
                        </div>
                        <div className='flex gap-3 mb-4 text-sm p-5'>
                            <p className=' text-gray-500'>By joining, I agree to the <Link href={"#"} className='text-primaryText'>terms of use</Link> and activity <Link href={"#"} className='text-primaryText'>release of liability</Link> waiver. </p>
                        </div>
                        <button type="submit" className='w-full bg-primaryText py-[9px] font-bold text-white rounded-lg'>Let's Ride</button>
                    </form>
                </div>
            </div>
        </div>     
    );
}

