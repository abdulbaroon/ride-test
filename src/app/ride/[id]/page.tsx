import { RideDetails } from "@/components/page";
import React, { FC } from "react";
import type { Metadata, ResolvingMetadata } from "next";
import { api } from "@/shared/api";
import {
    checkImageLoad,
    checkImageLoads,
    formatRideData,
    removeTags,
} from "@/shared/util/format.util";
import { routePlaceHolder } from "@/assets";
import { MY_DOMAIN } from "@/constant/appConfig";

/**
 * Interface representing the response from the ride API.
 * @interface RideResponse
 * @property {string} rideName - The name of the ride.
 * @property {string} rideNotes - Notes associated with the ride.
 * @property {string} [image] - Optional image URL for the ride.
 */
interface RideResponse {
    rideName: string;
    rideNotes: string;
    image?: string;
}

/**
 * Props for the Page component.
 * @interface PageProps
 * @property {Object} params - Route parameters.
 * @property {number} params.id - The ID of the ride.
 */
interface PageProps {
    params: {
        id: number;
    };
}

/**
 * Loads an image URL based on the provided parameters and checks if it's valid.
 * @async
 * @param {string | undefined} mapImage - The URL of the map image.
 * @param {string | undefined} image - The URL of the ride image.
 * @param {string | undefined} name - The name of the ride.
 * @returns {string} The generated image URL or a placeholder URL.
 */
const loadImage = async (mapImage: string | any, image: string | any, name:any) => {
    let url = "" as any;
    let secondUrl = "" as any;
    let generateURL="" as any
    if (image) {
        secondUrl = await checkImageLoads(image);
    }
    else if (mapImage) {
        url = await checkImageLoads(mapImage);
    }

    if(secondUrl){
        const newurl = `https://ogcdn.net/e4b8c678-7bd5-445d-ba03-bfaad510c686/v4/${encodeURIComponent(MY_DOMAIN||"http://chasingwatts.com/")}/${encodeURIComponent(name)}/${encodeURIComponent(secondUrl)}/og.png`;
        
        generateURL = await checkImageLoads(newurl);
    }else if(url){
        const newurl = `https://ogcdn.net/e4b8c678-7bd5-445d-ba03-bfaad510c686/v4/${encodeURIComponent(MY_DOMAIN||"http://chasingwatts.com/")}/${encodeURIComponent(name)}/${encodeURIComponent(url)}/og.png`;
        generateURL = await checkImageLoads(newurl);
     }else {
        const newurl = `https://ogcdn.net/e4b8c678-7bd5-445d-ba03-bfaad510c686/v4/${encodeURIComponent(MY_DOMAIN||"http://chasingwatts.com/")}/${encodeURIComponent(name)}/${encodeURIComponent(routePlaceHolder.src)}/og.png`;
        generateURL = await checkImageLoads(newurl);
    }

    return generateURL || secondUrl || url || routePlaceHolder.src;
};

/**
 * Generates metadata for the page based on the ride data.
 * @async
 * @param {PageProps} props - The props containing route parameters.
 * @param {ResolvingMetadata} parent - The parent metadata for resolving.
 * @returns {Promise<Metadata>} The metadata for the page.
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
    const image = await loadImage(
        formattedRide?.mapImage,
        formattedRide?.image,
        formattedRide?.rideName,
    );
    return {
        title: "Chasing Watts | " + (formattedRide?.rideName || "Ride Details"),
        description: removeTags(formattedRide?.rideNotes) || "Details of the ride.",
        openGraph: {
            title: formattedRide?.rideName || "Ride Details",
            description: removeTags(formattedRide?.rideNotes) || "Details of the ride.",
            images: image,
        },
    };
}

/**
 * Ride Details page component.
 * 
 * This component fetches and displays details for a specific ride.
 *
 * @param {PageProps} props - The props containing route parameters.
 * @returns {JSX.Element} The rendered Ride Details page.
 */
const Page: FC<PageProps> = ({ params }) => {
    const { id } = params;
    return (
        <>
            <RideDetails id={id} />
        </>
    );
};

export default Page;
