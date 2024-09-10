import {RatingPage} from '@/components/page';
import React, { FC } from 'react'
interface PageProps {
    params: {
      id: number;
    };
  }
  
  import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Chasing Watts Rating",
  description: "Rating for Chasing Watts cycling community",
};

  const Page: FC<PageProps> = ({ params }) => {
    const { id } = params;
  return <RatingPage id={id}/>
}

export default Page