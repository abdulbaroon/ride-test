import { Friend} from '@/components/page';
import React, { FC } from 'react'
interface PageProps {
    params: {
      id: number;
    };
  }
  
  const Page: FC<PageProps> = ({ params }) => {
    const { id } = params;
  return <Friend id={id}/>
}

export default Page