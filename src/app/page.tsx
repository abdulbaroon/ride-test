import { HomePage } from '../components/page'
import React from 'react'
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Chasing Watts Home",
  description: "Home for Chasing Watts cycling community",
};
const Home = () => {
  
  return (
    <>
      <HomePage/>
    </>
  )
}

export default Home