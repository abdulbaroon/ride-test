import GpxUploader from '@/components/basic/GpxUploader'
import MapBox from '@/components/module/MapBox'
import Link from 'next/link'
import React from 'react'

const Dashboard = () => {
  return (
    <>
    <div className='min-h-screen p-10'>
      <GpxUploader/>
    <Link href="/account/profile" className='bg-primaryButton text-white py-2 px-4 m-10' >Go to Profile page</Link>
    {/* <MapBox center={[12.5674,41.8719]} initialZoom={9}/> */}
    </div>
    </>
  )
}

export default Dashboard