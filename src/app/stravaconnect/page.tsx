import { Strava } from '@/components/page'
import React from 'react'
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Chasing Watts StravaConnect",
  description: "StravaConnect for Chasing Watts cycling community",
};

const page = () => {
  return (
    <Strava/>
  )
}

export default page