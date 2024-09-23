import React from "react";
import { Metadata } from "next";
import CustomLayout from "@/layout/CustomLayout";
import Link from "next/link";

export const metadata: Metadata = {
    title: "Chasing Watts | Privacy Policy",
    description: "Privacy Policy for Chasing Watts",
};

const PrivacyPolicyPage = () => {
    return (
        <CustomLayout>
            <section className='py-10 mt-28'>
                <div className='container mx-auto px-4'>
                    <h1 className='text-3xl font-bold mb-6'>Privacy Policy</h1>
                    <div className='bg-white p-6 shadow-md rounded-md'>
                        <div>
                            <p className='text-gray-500 text-sm mb-2'>
                                Last updated September 2024
                            </p>
                        </div>
                        <div className='space-y-4'>
                            <p className='text-gray-700'>
                                Thank you for choosing to be part of our
                                community at Chasing Watts LLC (&quot;
                                <strong>Company</strong>
                                &quot;, &quot;
                                <strong>we</strong>&quot;, &quot;
                                <strong>us</strong>
                                &quot;, or &quot;<strong>our</strong>&quot;). We
                                are committed to protecting your personal
                                information and your right to privacy. If you
                                have any questions or concerns about this
                                privacy notice or our practices with regard to
                                your personal information, please contact us at
                                <Link href='mailto:help@chasingwatts.com'>
                                    help@chasingwatts.com
                                </Link>
                                .
                            </p>
                            <p className='text-gray-700'>
                                This privacy notice describes how we might use
                                your information if you:
                            </p>
                            <ul className='list-disc pl-5 space-y-2'>
                                <li>
                                    Visit our website at
                                    https://chasingwatts.com
                                </li>
                                <li>
                                    Engage with us in other related ways,
                                    including any sales, marketing, or events
                                </li>
                            </ul>
                            <p className='text-gray-700'>
                                In this privacy notice, if we refer to:
                            </p>
                            <ul className='list-disc pl-5 space-y-2'>
                                <li>
                                    {
                                        '"Website," we are referring to any website of ours that references or links to this policy'
                                    }
                                </li>
                                <li>
                                    {
                                        '"Services," we are referring to our Website, and other related services, including any sales, marketing, or events'
                                    }
                                </li>
                            </ul>
                            <p className='text-gray-700'>
                                The purpose of this privacy notice is to explain
                                to you in the clearest way possible what
                                information we collect, how we use it, and what
                                rights you have in relation to it. If there are
                                any terms in this privacy notice that you do not
                                agree with, please discontinue use of our
                                Services immediately.
                            </p>
                        </div>
                        <div>
                            <p className='font-bold text-gray-600 my-4'>
                                Please read this privacy notice carefully, as it
                                will help you understand what we do with the
                                information that we collect.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </CustomLayout>
    );
};

export default PrivacyPolicyPage;
