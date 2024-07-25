import { FC } from "react";
import { EditRide } from "@/components/page";

// Define an interface for the props
interface PageProps {
  params: {
    id: number;
  };
}

const Page: FC<PageProps> = ({ params }) => {
  const { id } = params;
  return <EditRide id={id} />;
};

export default Page;
