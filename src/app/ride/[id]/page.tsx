import { RideDetails } from "@/components/page";
import React, { FC } from "react";
import type { Metadata, ResolvingMetadata } from "next";
import { api } from "@/shared/api";
import {
    checkImageLoad,
    checkImageLoads,
    formatRideData,
} from "@/shared/util/format.util";
import Head from "next/head";
import { routePlaceHolder } from "@/assets";
interface RideResponse {
    rideName: string;
    rideNotes: string;
    image?: string;
}

interface PageProps {
    params: {
        id: number;
    };
}

const loadImage = async (mapImage: string | any, image: string | any) => {
    let url = "" as any;
    let secondUrl = "" as any;
    if (mapImage) {
        url = await checkImageLoads(mapImage);
    }
    if (image) {
        secondUrl = await checkImageLoads(image);
    }
    return secondUrl || url || routePlaceHolder.src;
};

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
        formattedRide?.image
    );

    return {
        title: "Chasing Watts | " + formattedRide?.rideName || "Ride Details",
        description: formattedRide?.rideNotes || "Details of the ride.",
        openGraph: {
            title: formattedRide?.rideName || "Ride Details",
            description: formattedRide?.rideNotes || "Details of the ride.",
            images: image,
        },
    };
}

const Page: FC<PageProps> = ({ params }) => {
    const { id } = params;
    return (
        <>
            <RideDetails id={id} />
        </>
    );
};

export default Page;
