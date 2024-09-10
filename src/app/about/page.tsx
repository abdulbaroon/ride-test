import { AboutUs } from '@/components/page'
import React from 'react'
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Chasing Watts AboutUs",
  description: "ChasingWatts ride add ",
 
};

const page = () => {
  return (
    <AboutUs/>
  )
}

export default page