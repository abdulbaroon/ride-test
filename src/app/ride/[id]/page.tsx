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
import Head from "next/head";
import { routePlaceHolder } from "@/assets";
import { MY_DOMAIN } from "@/constant/appConfig";
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
        title: "Chasing Watts | " + formattedRide?.rideName || "Ride Details",
        description: removeTags(formattedRide?.rideNotes) || "Details of the ride.",
        openGraph: {
            title: formattedRide?.rideName || "Ride Details",
            description: removeTags(formattedRide?.rideNotes) || "Details of the ride.",
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
