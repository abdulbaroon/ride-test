import { RWGPS } from '@/components/page'
import React from 'react'
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Chasing Watts rwgpsConnect",
  description: "rwgpsConnect for Chasing Watts cycling community",
};
const page = () => {
  return (
    <RWGPS/>
  )
}

export default page