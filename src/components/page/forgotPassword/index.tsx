
"use client"
import { accountLogo } from '@/assets';
import { forgotPassword } from '@/redux/slices/authSlice';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch } from '@/redux/store/store';
import { toast } from 'react-toastify';
import { CgSpinner } from "react-icons/cg";
import { useState } from 'react';
import { useRouter } from 'next/navigation';


interface Email {
  email: string;
}
export const ForgotPage = () => {
  const [loading, setloading] = useState(false)
  const dispatch = useDispatch<AppDispatch>()
  const { register, handleSubmit, formState: { errors } } = useForm<Email>();
  const {push} = useRouter()
  const onSubmit = async (data: Email) => {

    try {
      setloading(true)
      const response = await dispatch(forgotPassword(data.email))
      setloading(false)
      if (forgotPassword.fulfilled.match(response)) {
        toast.success(response.payload.message)
        push("/account/resetPassword")
      } else if (forgotPassword.rejected.match(response)) {
        toast.error("failed to send email")
      }
    } catch {
      toast.error("something went wrong")
    }
  };

  return (
    <div className='min-h-screen w-full flex justify-center items-center bg-[#f5f4f8] mt-[90px]'>
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
            <button type="submit" disabled={loading} className='  w-full bg-primaryText py-[10px] font-bold text-white rounded-lg'>
              {loading ? <CgSpinner className=' mx-auto animate-spin w-6 h-6 ' /> : "Email Link"}
            </button>
            <p className='pt-6 tablet:pt-7 text-gray-500'> Nevermind? <Link href="/account/login" className='text-primaryText '>Log In</Link></p>
            <p className='pt-2 text-gray-500'>Don&apos;t have an account? <Link href="/account/register" className='text-primaryText '>Sign up</Link></p>
          </form>
        </div>
      </div>

    </div>
  );
}

