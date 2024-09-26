import { FC } from "react";
import { EditRide } from "@/components/page";
import { formatRideData } from "@/shared/util/format.util";
import { Metadata, ResolvingMetadata } from "next";
import { api } from "@/shared/api";
import { IMAGE_URl } from "@/constant/appConfig";

// Define an interface for the props
interface PageProps {
    params: {
        id: number; // The ID of the ride to be edited
    };
}

/**
 * Generates metadata for the Edit Ride page based on the ride ID.
 *
 * This function fetches ride data and formats the metadata
 * for SEO and social media sharing.
 *
 * @param {Object} params - The route parameters.
 * @param {number} params.id - The ID of the ride to be edited.
 * @param {ResolvingMetadata} parent - The parent metadata for the page.
 * 
 * @returns {Promise<Metadata>} The metadata for the Edit Ride page.
 */
export async function generateMetadata(
    { params }: PageProps,
    parent: ResolvingMetadata
): Promise<Metadata> {
    const id = params.id;
    const endpoint = `/activity/${id}`;

    let rideResponse: any | null = null;
    try {
        rideResponse = await api.get(endpoint).then((res) => res.data);
    } catch (error) {
        console.error("Error fetching ride data:", error);
        return {
            title: "Ride Not Found",
            description: "Unable to fetch ride details.",
        };
    }

    const formattedRide = rideResponse ? formatRideData(rideResponse) : null;
    const previousImages = (await parent).openGraph?.images || [];

    return {
        title: "Chasing Watts | " + formattedRide?.rideName || "Edit Ride",
        description: formattedRide?.rideNotes || "Details of the ride.",
        openGraph: {
            title: formattedRide?.rideName || "Chasing Watts - Ride Details",
            description: formattedRide?.rideNotes || "Details of the ride.",
            images: [
                formattedRide?.image ||
                    (`${IMAGE_URl}/ridepictures/ridepicture_32497_981.png` as any),
                ...previousImages,
            ],
        },
    };
}

/**
 * Edit Ride page component.
 *
 * This component renders the EditRide page for the specified ride ID.
 *
 * @param {PageProps} props - The component props.
 * @param {Object} props.params - The route parameters.
 * @param {number} props.params.id - The ID of the ride to be edited.
 * 
 * @returns {JSX.Element} The rendered Edit Ride page.
 */
const Page: FC<PageProps> = ({ params }) => {
    const { id } = params;
    return <EditRide id={id} />;
};

export default Page;
