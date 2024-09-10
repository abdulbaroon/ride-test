import { Calender } from "@/components/page"
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Chasing Watts Calendar",
  description: "Calendar for Chasing Watts cycling community",
};

const Page = () => {
  return (
    <Calender/>
  )
}

export default Page