import { Points } from '@/components/page'
import React from 'react'
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Chasing Watts Points",
  description: "Points for Chasing Watts cycling community",
};
const page = () => {
  return (
    <Points/>
  )
}

export default page