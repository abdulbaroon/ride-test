import { SearchPage } from "@/components/page"
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Chasing Watts Search",
  description: "Search for Chasing Watts cycling community",
};
const Page = () => {
  return (
    <SearchPage/>
  )
}

export default Page