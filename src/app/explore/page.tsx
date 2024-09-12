import { ExploreMap } from '@/components/page';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Chasing Watts Explore",
    description: "Explore for Chasing Watts cycling community",
  };
const page = () => {
  return (
    <ExploreMap/>
  )
}

export default page