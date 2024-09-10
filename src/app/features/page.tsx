import { FeaturesPage } from "@/components/page"
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Chasing Watts Features",
  description: "Features for Chasing Watts cycling community",
};
const page = () => {
  return (
    <>
    <FeaturesPage/>
    </>
  )
}

export default page