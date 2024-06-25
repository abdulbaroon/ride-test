"use client"
import { usePathname, useRouter } from 'next/navigation'
import React from 'react'

export const HomePage = () => {
  const router = useRouter()
  const pathname= usePathname()
  if(pathname==="/"){
    router.push("/account/login")
  }
  return (
    <div className='text-4xl'></div>
  )
}
