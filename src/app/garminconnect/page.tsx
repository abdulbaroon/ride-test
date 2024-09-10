import { Garmin } from '@/components/page'
import React from 'react'
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Chasing Watts GarminConnect",
  description: "GarminConnect for Chasing Watts cycling community",
};
const page = () => {
  return (
    <Garmin/>
  )
}

export default page