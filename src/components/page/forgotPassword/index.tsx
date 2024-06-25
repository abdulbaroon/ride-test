
"use client"
import { accountLogo } from '@/assets';
import Link from 'next/link';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { FaRegEyeSlash } from "react-icons/fa";
import { IoEyeOutline } from "react-icons/io5";


interface LoginFormValues {
  email: string;
}
export const ForgotPage = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormValues>();

  const onSubmit = (data: LoginFormValues) => {
    console.log(data);
  };

  return (
    <div className='min-h-screen w-full flex justify-center items-center bg-[#f5f4f8] '>
      <div className='w-full desktop:w-1/2 mx-auto bg-white border rounded-xl flex items-center flex-col tablet:flex-row'>
        <div className='w-full tablet:w-1/2 p-6 tablet:p-12  flex justify-center items-center'>
          <div>
            <img src={accountLogo.src} alt="Logo" />
          </div>
        </div>
        <div className='w-full tablet:w-1/2 p-6 tablet:p-12 tablet:border-l'>
          <h2 className='text-2xl tablet:text-3xl font-bold pb-6 tablet:pb-12'>Forgot Password</h2>
          <form onSubmit={handleSubmit(onSubmit)}>
            <label className=''>Email address</label>
            <div className='mb-6'>
              <input {...register("email", { required: true, pattern: /^\S+@\S+$/i })} className='w-full py-[10px] px-4 border rounded-lg mt-2 ' placeholder='Enter your Email' type='email' />
              {errors.email && <p className='text-red-500 text-xs '>Email is required</p>}
            </div>
            <button type="submit" className='w-full bg-primaryText py-[9px] font-bold text-white rounded-lg'>Email Link</button>
            <p className='pt-6 tablet:pt-7 text-gray-500'> Nevermind? <Link href="/account/login" className='text-primaryText '>Log In</Link></p>
            <p className='pt-2 text-gray-500'>Don't have an account? <Link href="/account/register" className='text-primaryText '>Sign up</Link></p>
          </form>
        </div>
      </div>

    </div>
  );
}

