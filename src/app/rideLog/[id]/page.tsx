import {RatingPage, RideLog} from '@/components/page';
import React, { FC } from 'react'
interface PageProps {
    params: {
      id: number;
    };
  }

  import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Chasing Watts RideLog",
  description: "RideLog for Chasing Watts cycling community",
};
  
  const Page: FC<PageProps> = ({ params }) => {
    const { id } = params;
  return <RideLog id={id}/>
}

export default Page