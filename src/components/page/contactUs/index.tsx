"use client";
import { accountLogo } from "@/assets";
import Link from "next/link";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { setContact } from "@/redux/slices/contactSlice";
import { AppDispatch } from "@/redux/store/store";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { CgSpinner } from "react-icons/cg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/pro-solid-svg-icons/faHeart";
import { faFacebook } from "@fortawesome/free-brands-svg-icons/faFacebook";
import { faInstagram } from "@fortawesome/free-brands-svg-icons/faInstagram";
import { faXTwitter } from "@fortawesome/free-brands-svg-icons/faXTwitter";
import { faThreads } from "@fortawesome/free-brands-svg-icons/faThreads";
import Lottie from "lottie-react";
import * as animationData from "../../../assets/lottieAssets/check.json";
import { clear } from "console";

interface ContactFormValues {
    email: string;
    name: string;
    subject: string;
    message: string;
}

export const Contact = () => {
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<ContactFormValues>();
    const dispatch = useDispatch<AppDispatch>();
    //const router = useRouter();

    const onSubmit = async (data: ContactFormValues) => {
        try {
            setLoading(true);
            const response = await dispatch(setContact(data));
            setLoading(false);

            if (setContact.fulfilled.match(response)) {
                toast.success("Thanks! Message sent successfully!");
                setSubmitted(true);
            } else if (setContact.rejected.match(response)) {
                const message = (response as any).payload?.message;
                toast.error(
                    message ||
                        "An error occurred during contact form submission"
                );
            }
        } catch {
            toast.error("Something went wrong, please try again.");
        }
    };

    return (
        <div className='w-full flex justify-center items-center bg-[#f5f4f8] my-40'>
            <div className='w-full desktop:w-1/2 mx-auto bg-white border rounded-xl flex items-center flex-col tablet:flex-row'>
                <div className='w-full tablet:w-1/2 p-6 tablet:p-12'>
                    <div>
                        <h3 className='text-2xl tablet:text-3xl font-bold pb-6'>
                            We
                            <FontAwesomeIcon
                                icon={faHeart}
                                size='xl'
                                className='fa-fw text-red-500'
                            />
                            Feedback!
                        </h3>
                        <div className='mb-3'>
                            <p className='mb-2'>
                                Have questions about Chasing Watts, a great
                                idea, feedback or just want to talk shop?
                            </p>
                            <p className='mb-2'>
                                Hit us up and we&apos;ll be happy to connect and
                                catch up.
                            </p>
                            <p className='font-bold mb-2'>Thank you!</p>
                        </div>
                        <hr className='my-3 bg-neutral-300' />
                        <div className='mb-3 text-neutral-500'>
                            If you have more questions or want to learn more
                            about Chasing Watts...
                            <div className='mt-6 flex flex-row gap-4'>
                                <Link
                                    className='font-bold text-white bg-slate-500 rounded-md p-2 w-1/2 text-center'
                                    target='_blank'
                                    href='https://help.chasingwatts.com'>
                                    FAQ
                                </Link>
                                <Link
                                    className='font-bold text-white bg-zinc-500 rounded-md p-2 w-1/2 text-center'
                                    href='/features'>
                                    Features
                                </Link>
                            </div>
                        </div>
                        <hr className='my-3 bg-neutral-300' />
                        <div className='mb-3 mt-3'>
                            <span className='font-bold text-neutral-400'>
                                Follow us on:
                            </span>
                            <div className='flex flex-row gap-4 mt-2'>
                                <Link
                                    href='https://www.facebook.com/chasingwatts'
                                    target='_blank'>
                                    <FontAwesomeIcon
                                        icon={faFacebook}
                                        size='2x'
                                        className='fa-fw text-neutral-400'
                                    />
                                </Link>
                                <Link
                                    href='https://www.instagram.com/chasing_watts'
                                    target='_blank'>
                                    <FontAwesomeIcon
                                        icon={faInstagram}
                                        size='2x'
                                        className='fa-fw text-neutral-400'
                                    />
                                </Link>
                                <Link
                                    href='https://www.twitter.com/chasing_watts'
                                    target='_blank'>
                                    <FontAwesomeIcon
                                        icon={faXTwitter}
                                        size='2x'
                                        className='fa-fw text-neutral-400'
                                    />
                                </Link>
                                <Link
                                    href='https://www.threads.net/chasing_watts'
                                    target='_blank'>
                                    <FontAwesomeIcon
                                        icon={faThreads}
                                        size='2x'
                                        className='fa-fw text-neutral-400'
                                    />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='w-full tablet:w-1/2 p-6 tablet:p-12 tablet:border-l'>
                    {submitted ? (
                        <div>
                            <div className='content-center'>
                                <Lottie
                                    className='w-1/2 mx-auto'
                                    aria-activedescendant=''
                                    animationData={animationData}
                                    loop={true}></Lottie>
                            </div>
                            <div className='mt-6 font-semibold text-neutral-700'>
                                <p>Thank you for your message!</p>
                                <p>We&apos;ll get back to you shortly.</p>
                            </div>
                            <div className='mt-6'>
                                <button
                                    onClick={() => {
                                        setSubmitted(false);
                                        reset();
                                    }}
                                    className='w-full bg-primaryButton py-[9px] font-bold text-white rounded-md'>
                                    Send another message?
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div>
                            <h2 className='text-2xl tablet:text-3xl font-bold pb-2 tablet:pb-6 noto-sans-700'>
                                Contact Us.
                            </h2>
                            <form onSubmit={handleSubmit(onSubmit)}>
                                <div className='mb-6'>
                                    <input
                                        {...register("email", {
                                            required: true,
                                            pattern: /^\S+@\S+$/i,
                                        })}
                                        className='w-full py-[10px] px-4 border rounded-lg mt-2'
                                        placeholder='Enter your Email'
                                        type='email'
                                        tabIndex={1}
                                    />
                                    {errors.email && (
                                        <p className='text-red-500 text-xs'>
                                            Email is required
                                        </p>
                                    )}
                                </div>
                                <div className='mb-6'>
                                    <input
                                        {...register("name", {
                                            required: true,
                                        })}
                                        className='w-full py-[10px] px-4 border rounded-lg mt-2'
                                        placeholder='Enter your name'
                                        type='name'
                                        tabIndex={2}
                                    />
                                    {errors.name && (
                                        <p className='text-red-500 text-xs'>
                                            Name is required
                                        </p>
                                    )}
                                </div>
                                <div className='mb-6'>
                                    <input
                                        {...register("subject", {
                                            required: true,
                                        })}
                                        className='w-full py-[10px] px-4 border rounded-lg mt-2'
                                        placeholder='Enter your subject'
                                        type='subject'
                                        tabIndex={3}
                                    />
                                    {errors.name && (
                                        <p className='text-red-500 text-xs'>
                                            Subject is required
                                        </p>
                                    )}
                                </div>
                                <div className='mb-6'>
                                    <textarea
                                        {...register("message", {
                                            required: true,
                                        })}
                                        className='w-full py-[10px] px-4 border rounded-lg mt-2'
                                        placeholder='Enter your message'
                                        tabIndex={4}
                                    />
                                    {errors.name && (
                                        <p className='text-red-500 text-xs'>
                                            Message is required
                                        </p>
                                    )}
                                </div>
                                <button
                                    type='submit'
                                    disabled={loading}
                                    className='w-full bg-primaryText py-[9px] font-bold text-white rounded-lg'
                                    tabIndex={5}>
                                    {loading ? (
                                        <CgSpinner className='mx-auto animate-spin w-6 h-6' />
                                    ) : (
                                        "Send Message"
                                    )}
                                </button>
                            </form>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
