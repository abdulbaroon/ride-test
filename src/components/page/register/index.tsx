
"use client"
import { accountLogo } from '@/assets';
import Link from 'next/link';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { TbCircleCheck } from "react-icons/tb";
import { FaRegEyeSlash } from "react-icons/fa";
import { IoEyeOutline } from "react-icons/io5";
import { useDispatch } from 'react-redux';
import { signUp } from '@/redux/slices/authSlice';
import type { AppDispatch } from '@/redux/store/store';
import { CgSpinner } from 'react-icons/cg';
import { toast } from 'react-toastify';


const logindata = [     
    "Quickly add & find rides",
    "Know the details",    
    "Web and Mobile"    
];

interface RegisterFormValues {
    email: string;
    password: string;
    confirmPassword: string;
}
export const RegisterPage = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [showConformPassword, setShowConformPassword] = useState(false);
    const [loading, setloading]= useState(false)
    const dispatch = useDispatch<AppDispatch>()
    const { register, handleSubmit, formState: { errors }, watch, getValues} = useForm<RegisterFormValues>({
        mode: "onTouched"
    });

    const password = watch("password", "");

    const onSubmit = async (data: RegisterFormValues) => {
     const registerFormValues ={
        ...data,
        acceptTerms: true as boolean
     } 
     try{
        setloading(true)
        const response = await dispatch(signUp(registerFormValues))
        setloading(false)
        if (signUp.fulfilled.match(response)) {
          toast.success(response.payload.message)
        } else if (signUp.rejected.match(response)) {
          toast.error("failed to register")
        }
      }catch{
        toast.error("something went wrong")
      }
    };

    return (
        <div className=' w-full flex justify-center items-center bg-[#f5f4f8] mt-[90px]'>
            <div className='w-full desktop:w-1/2 mx-auto bg-white border rounded-xl flex items-center flex-col tablet:flex-row'>
                <div className='w-full tablet:w-1/2 p-6 tablet:p-12 tablet:border-r '>
                    <div>
                        <img src={accountLogo.src} alt="Logo" />
                        <h3 className=' text-2xl tablet:text-3xl font-bold pb-6'>Join the community
                            and let&apos;s ride!</h3>
                        <div className='mb-3'>
                            {logindata.map((d, index) => (
                                <div className='flex items-center gap-2 mb-2 text-gray-500' key={index}>
                                    <TbCircleCheck className='text-primaryText text-xl' />
                                    <p>{d}</p>
                                </div>
                            ))}
                        </div>
                        <p className='pt-2 tablet:pt-6 tablet:mb-12 text-gray-500'>Don&apos;t have an account?  <Link href="/account/login" className='text-primaryText '>Sign in</Link></p>
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
                                    {...register("confirmPassword", {   
                                        required: "Conform Password is required",
                                        validate: (value) => value === password || "Passwords do not match"
                                    })}
                                    type={showConformPassword ? "text" : "password"}
                                    className='w-full py-[10px] px-4 border rounded-lg mt-2 '
                                    placeholder='Enter Conform ' />
                               {<p className='text-red-500 text-xs '>{errors.confirmPassword?.message}</p>}
                            </div>
                            <div className='absolute top-5 right-5 cursor-pointer text-gray-500 hover:text-black' onClick={() => setShowConformPassword(!showConformPassword)}>
                                {showConformPassword ? <FaRegEyeSlash className=' text-xl ' /> : <IoEyeOutline className=' text-xl ' />}
                            </div>
                        </div>
                        <div className='flex gap-3 mb-4 text-sm p-5'>
                            <p className=' text-gray-500'>By joining, I agree to the <Link href={"#"} className='text-primaryText'>terms of use</Link> and activity <Link href={"#"} className='text-primaryText'>release of liability</Link> waiver. </p>
                        </div>
                        <button type="submit" disabled={loading} className='w-full bg-primaryText py-[9px] font-bold text-white rounded-lg'>
                        {loading?<CgSpinner className=' mx-auto animate-spin w-6 h-6 ' />:"Let's Ride"}
                            </button>
                    </form>
                </div>
            </div>
        </div>     
    );
}

