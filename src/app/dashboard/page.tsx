import MapBox from '@/components/module/MapBox'
import Link from 'next/link'
import React from 'react'

const Dashboard = () => {
  return (
    <>
    <Link href="/account/profile" >Go to Profile page</Link>
    {/* <MapBox center={[12.5674,41.8719]} initialZoom={9}/> */}
    </>
  )
}

export default Dashboard