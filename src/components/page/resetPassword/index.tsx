"use client";
import { accountLogo } from "@/assets";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { FaRegEyeSlash } from "react-icons/fa";
import { IoEyeOutline } from "react-icons/io5";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "@/redux/store/store";
import { resetPassword } from "@/redux/slices/authSlice";
import { toast } from "react-toastify";
import { CgSpinner } from "react-icons/cg";
import { useRouter, useSearchParams } from "next/navigation";

interface LoginFormValues {
    reset_code: string;
    confirm_password: string;
    password: string;
}
export const ResetPasswordPage = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [showConformPassword, setShowConformPassword] = useState(false);
    const [loading, setloading] = useState(false);
    const { push, back } = useRouter();
    const dispatch = useDispatch<AppDispatch>();
    const searchParams = useSearchParams();
    const code = searchParams.get("code");
    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
        setValue,
    } = useForm<LoginFormValues>({
        mode: "onTouched",
    });
    const password = watch("password", "");

    useEffect(() => {
        if (code) {
            setValue("reset_code", code);
        }
    }, [code]);

    const onSubmit = async (data: LoginFormValues) => {
        const resetData = {
            confirmPassword: data.confirm_password,
            password: data.password,
            token: data.reset_code,
        };
        try {
            setloading(true);
            const response = await dispatch(resetPassword(resetData));
            setloading(false);
            if (resetPassword.fulfilled.match(response)) {
                toast.success(response.payload.message);
                push("/account/login");
            } else if (resetPassword.rejected.match(response)) {
                toast.error("Invalid reset code");
            }
        } catch {
            toast.error("something went wrong");
        }
    };

    return (
        <div className=' w-full flex justify-center items-center bg-[#f5f4f8] my-40'>
            <div className='w-full desktop:w-1/2 mx-auto bg-white border border-neutral-300 rounded-md flex items-center flex-col tablet:flex-row'>
                <div className='w-full tablet:w-1/2 p-6 tablet:p-12  flex justify-center items-center'>
                    <div>
                        <img src={accountLogo.src} alt='Logo' />
                    </div>
                </div>
                <div className='w-full tablet:w-1/2 p-6 tablet:p-12 tablet:border-l'>
                    <h2 className='text-2xl tablet:text-3xl font-bold pb-6 tablet:pb-12'>
                        Reset Password
                    </h2>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <label className='text-gray-500'>Reset Code</label>
                        <div className='relative'>
                            <div className='mb-6'>
                                <input
                                    {...register("reset_code", {
                                        required: true,
                                    })}
                                    type='text'
                                    className='w-full py-[10px] px-4 border rounded-lg mt-2 '
                                    placeholder='Enter Reset Code'
                                />
                                {errors.reset_code && (
                                    <p className='text-red-500 text-xs '>
                                        Reset code is required
                                    </p>
                                )}
                            </div>
                        </div>
                        <label className='text-gray-500'>New password</label>
                        <div className='relative'>
                            <div className='mb-6'>
                                <input
                                    {...register("password", {
                                        required: true,
                                        minLength: 6,
                                    })}
                                    type={showPassword ? "text" : "password"}
                                    className='w-full py-[10px] px-4 border rounded-lg mt-2 '
                                    placeholder='Enter Password'
                                />
                                {errors.password && (
                                    <p className='text-red-500 text-xs '>
                                        Password is required and should be at
                                        least 6 characters long
                                    </p>
                                )}
                            </div>
                            <div
                                className='absolute top-5 right-5 cursor-pointer text-gray-500 hover:text-black'
                                onClick={() => setShowPassword(!showPassword)}>
                                {showPassword ? (
                                    <FaRegEyeSlash className=' text-xl ' />
                                ) : (
                                    <IoEyeOutline className=' text-xl ' />
                                )}
                            </div>
                        </div>
                        <label className='text-gray-500'>
                            Confirm new password
                        </label>
                        <div className='relative'>
                            <div className='mb-2'>
                                <input
                                    {...register("confirm_password", {
                                        required:
                                            "Conform Password is required",
                                        validate: (value) =>
                                            value === password ||
                                            "Passwords do not match",
                                    })}
                                    type={
                                        showConformPassword
                                            ? "text"
                                            : "password"
                                    }
                                    className='w-full py-[10px] px-4 border rounded-lg mt-2 '
                                    placeholder='Enter Conform '
                                />
                                {
                                    <p className='text-red-500 text-xs '>
                                        {errors.confirm_password?.message}
                                    </p>
                                }
                            </div>
                            <div
                                className='absolute top-5 right-5 cursor-pointer text-gray-500 hover:text-black'
                                onClick={() =>
                                    setShowConformPassword(!showConformPassword)
                                }>
                                {showConformPassword ? (
                                    <FaRegEyeSlash className=' text-xl ' />
                                ) : (
                                    <IoEyeOutline className=' text-xl ' />
                                )}
                            </div>
                        </div>
                        <div className='mt-5 flex items-start'>
                            <button
                                type='submit'
                                className='bg-primaryText py-[9px] px-6 font-bold text-white rounded-lg w-28'>
                                {loading ? (
                                    <CgSpinner className=' mx-auto animate-spin w-6 h-6 ' />
                                ) : (
                                    "Reset"
                                )}
                            </button>
                            <button
                                type='submit'
                                onClick={() => back()}
                                className='bg-primaryButton py-[9px] px-6 font-bold text-white rounded-lg ms-2'>
                                Back
                            </button>
                        </div>
                        <p className='pt-7 text-gray-500'>
                            Don&apos;t have an account?{" "}
                            <Link
                                href='/account/register'
                                className='text-primaryText '>
                                Sign up
                            </Link>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
};
