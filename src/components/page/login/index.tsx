
"use client"
import { accountLogo } from '@/assets';
import Link from 'next/link';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { TbCircleCheck } from "react-icons/tb";
import { FaRegEyeSlash } from "react-icons/fa";
import { IoEyeOutline } from "react-icons/io5";

const logindata  = [
  "Find your rides",
  "Check your notifications",
  "Share and have fun"
];

interface LoginFormValues {
  email: string;
  password: string;
}
 export const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormValues>();

  const onSubmit = (data: LoginFormValues) => {
    console.log(data);
  };

  return (
    <div className='min-h-screen w-full flex justify-center items-center bg-[#f5f4f8] '>
      <div className='w-full desktop:w-1/2 mx-auto bg-white border rounded-xl flex items-center flex-col tablet:flex-row'>
        <div className='w-full tablet:w-1/2 p-6 tablet:p-12 '>
          <div>
            <img src={accountLogo.src} alt="Logo" />
            <h3 className='text-2xl tablet:text-3xl font-bold pb-6'>LET'S RIDE.</h3>
            <div className='mb-3'>
              {logindata.map((d, index) => (
                <div className='flex items-center gap-2 mb-2 text-gray-500' key={index}>
                  <TbCircleCheck className='text-primaryText text-xl' />
                  <p>{d}</p>
                </div>
              ))}
            </div>
            <p className='pt-2 tablet:mb-12 text-gray-500'>Already have an issue? <Link href={"#"} className='text-primaryText  '>Contact Us</Link></p>
          </div>
        </div>
        <div className='w-full tablet:w-1/2 p-6 tablet:p-12 tablet:border-l'>
          <h2 className='text-2xl tablet:text-3xl font-bold pb-6 tablet:pb-12 noto-sans-700'>Ready to ride? Login.</h2>
          <form onSubmit={handleSubmit(onSubmit)}>
            <label className=''>Email address</label>
            <div className='mb-6'>
              <input {...register("email", { required: true, pattern: /^\S+@\S+$/i })} className='w-full py-[10px] px-4 border rounded-lg mt-2 ' placeholder='Enter your Email' type='email' />
              {errors.email && <p className='text-red-500 text-xs '>Email is required</p>}
            </div>
            <div className='flex justify-between'>
              <label className=''>Password</label>
              <p className='text-primaryText text-sm'><Link href="/account/forgot" >Forgot Password?</Link></p>
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
            <button type="submit" className='w-full bg-primaryText py-[9px] font-bold text-white rounded-lg'>Let's Ride</button>
            <p className='pt-6 tablet:pt-12 text-gray-500'>Don't have an account? <Link href="/account/register" className='text-primaryText pt-4 mb-12'>Sign up</Link></p>
          </form>
        </div>
      </div>

    </div>
  );
}

