import {RatingPage} from '@/components/page';
import React, { FC } from 'react'
interface PageProps {
    params: {
      id: number;
    };
  }
  
  const Page: FC<PageProps> = ({ params }) => {
    const { id } = params;
  return <RatingPage id={id}/>
}

export default Page