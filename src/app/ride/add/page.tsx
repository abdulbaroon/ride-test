import { AddRidePage } from '@/components/page'
import { Metadata, ResolvingMetadata } from 'next';
import React from 'react'

export async function generateMetadata(
  parent: ResolvingMetadata
): Promise<Metadata> {

  return {
    title: "Ride add",
    description:  "Details of the add.",
    openGraph: {
      title: "Ride Details",
      description: "Details of the ride.",
      images: [
         "https://dev.chasingwatts.com/ridepictures/ridepicture_32497_981.png" 
      ],
    },
  };
}
const AddRide = () => {
  return (
    <AddRidePage />
  )
}

export default AddRide