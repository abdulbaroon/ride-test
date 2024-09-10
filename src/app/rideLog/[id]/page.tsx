import {RatingPage, RideLog} from '@/components/page';
import React, { FC } from 'react'
interface PageProps {
    params: {
      id: number;
    };
  }
  
  const Page: FC<PageProps> = ({ params }) => {
    const { id } = params;
  return <RideLog id={id}/>
}

export default Page