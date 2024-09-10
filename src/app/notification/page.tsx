import { ManageNotification } from "@/components/page"
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Chasing Watts Notification",
  description: "Notification for Chasing Watts cycling community",
};
const page = () => {
  return (
    <ManageNotification/>
  )
}

export default page