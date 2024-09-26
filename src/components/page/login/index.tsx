"use client";
import { accountLogo } from "@/assets";
import Link from "next/link";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { TbCircleCheck } from "react-icons/tb";
import { FaRegEyeSlash } from "react-icons/fa";
import { IoEyeOutline } from "react-icons/io5";
import { useDispatch } from "react-redux";
import { login } from "@/redux/slices/authSlice";
import { AppDispatch } from "@/redux/store/store";
import { toast } from "react-toastify";
import { useRouter, useSearchParams } from "next/navigation";
import { CgPassword, CgSpinner } from "react-icons/cg";

const logindata = [
  "Find your rides",
  "Check your notifications",
  "Share and have fun",
];

interface LoginFormValues {
  email: string;
  password: string;
}

export const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>();
  const dispatch = useDispatch<AppDispatch>();
  const searchParams = useSearchParams();
  const returnurl = searchParams.get("returnurl");
  const router = useRouter();

  const onSubmit = async (data: LoginFormValues) => {
    try {
      const datas={
       password:"Test@123",
       email:"devashish04.hp@gmail.com"
      }
      setLoading(true);
      const response = await dispatch(login(datas));
      setLoading(false);
      if (login.fulfilled.match(response)) {
        toast.success("Login successful");
        if (response.payload.userProfile) {
          if (returnurl) {
            router.push(returnurl);
          } else {
            router.push("/dashboard");
          }
        } else {
          router.push("/account/profile");
        }
      } else if (login.rejected.match(response)) {
        const message = (response as any).payload?.message;
        toast.error(message || "An error occurred during login");
      }
    } catch {
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="w-full flex justify-center items-center bg-[#f5f4f8] my-40">
      <div className="w-full desktop:w-1/2 mx-auto bg-white border border-neutral-300 rounded-md flex items-center flex-col tablet:flex-row">
        <div className="w-full tablet:w-1/2 p-6 tablet:p-12">
          <div>
            <img src={accountLogo.src} alt="Logo" />
            <h3 className="text-2xl tablet:text-3xl font-bold pb-6">
              LET&apos;S RIDE.
            </h3>
            <div className="mb-3">
              {logindata.map((d, index) => (
                <div
                  className="flex items-center gap-2 mb-2 text-gray-500"
                  key={index}
                >
                  <TbCircleCheck className="text-primaryText text-xl" />
                  <p>{d}</p>
                </div>
              ))}
            </div>
            <p className="pt-2 tablet:mb-12 text-gray-500">
              Have an issue?{" "}
              <Link href={"/contactUs"} className="text-primaryText">
                Contact Us
              </Link>
            </p>
          </div>
        </div>
        <div className="w-full tablet:w-1/2 p-6 tablet:p-12 tablet:border-l">
          <h2 className="text-2xl tablet:text-3xl font-bold pb-6 tablet:pb-12 noto-sans-700">
            Ready to ride? Login.
          </h2>
          <form onSubmit={handleSubmit(onSubmit)}>
            <label className="text-sm text-gray-400">Email address</label>
            <div className="mb-6">
              <input
                {...register("email", {
                  required: true,
                  pattern: /^\S+@\S+$/i,
                })}
                className="w-full py-[10px] px-4 border rounded-lg mt-2"
                placeholder="Enter your Email"
                type="email"
                tabIndex={1}
              />
              {errors.email && (
                <p className="text-red-500 text-xs">Email is required</p>
              )}
            </div>
            <div className="flex justify-between">
              <label className="text-sm text-gray-400">Password</label>
              <p className="text-primaryText text-sm">
                <Link href="/account/forgot">Forgot Password?</Link>
              </p>
            </div>
            <div className="relative">
              <div className="mb-6">
                <input
                  {...register("password", {
                    required: true,
                    minLength: 6,
                  })}
                  type={showPassword ? "text" : "password"}
                  className="w-full py-[10px] px-4 border rounded-lg mt-2"
                  placeholder="Enter Password"
                  tabIndex={2}
                />
                {errors.password && (
                  <p className="text-red-500 text-xs">
                    Password is required and should be at least 6 characters
                    long
                  </p>
                )}
              </div>
              <div
                className="absolute top-5 right-5 cursor-pointer text-gray-500 hover:text-black"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <IoEyeOutline className="text-xl" />
                ) : (
                  <FaRegEyeSlash className="text-xl" />
                )}
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primaryText py-[9px] font-bold text-white rounded-lg"
              tabIndex={3}
            >
              {loading ? (
                <CgSpinner className="mx-auto animate-spin w-6 h-6" />
              ) : (
                "Let's Ride"
              )}
            </button>
            <p className="pt-6 tablet:pt-12 text-gray-500">
              Don&apos;t have an account?{" "}
              <Link
                href="/account/register"
                className="text-primaryText pt-4 mb-12"
              >
                Sign up
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};
