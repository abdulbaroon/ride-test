import { HubDetails} from '@/components/page';
import React, { FC } from 'react'
interface PageProps {
    params: {
      id: number;
    };
  }
  const Page: FC<PageProps> = ({ params }) => {
    const { id } = params;
  return <HubDetails  hubId={id}/>
}

export default Page