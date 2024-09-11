
import { ResetPasswordPage } from '@/components/page'
import React from 'react'
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Chasing Watts ResetPassword",
  description: "ResetPassword for Chasing Watts cycling community",
};

const Page = () => {

  return (
    <ResetPasswordPage/>
  )
}

export default Page;