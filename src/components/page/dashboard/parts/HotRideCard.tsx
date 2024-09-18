import React, { useRef, useState } from "react";
import { format, parse, parseISO } from "date-fns";
import { IoEyeOutline } from "react-icons/io5";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/effect-creative";
import { EffectCards, EffectCreative } from "swiper/modules";
import { FormattedRide } from "@/shared/types/dashboard.types";

interface HotRideCardProps {
    data: FormattedRide[];
}

const HotRideCard: React.FC<HotRideCardProps> = ({ data }) => {
    return (
        <div>
            <Swiper
                effect={"cards"}
                grabCursor={true}
                modules={[EffectCards]}
                slidesPerView={1.1}
                centeredSlides={true}
                className='mySwiper p-10'
                cardsEffect={{
                    rotate: false,
                    perSlideRotate: 0,
                    slideShadows: false,
                    perSlideOffset: 8,
                }}>
                {data?.map((ride, index) => (
                    <SwiperSlide key={index}>
                        <div className='rounded-md h-fit bg-white p-5 border border-neutral-300 cursor-pointer'>
                            <div className='flex flex-row justify-between'>
                                <div className='text-sm'>
                                    <Link
                                        href={`/ride/${ride.activityID}`}
                                        className='font-bold text-base'>
                                        {ride.rideName}
                                    </Link>
                                    <p>Public ride</p>
                                    <p>
                                        {format(
                                            parseISO(ride.startDate as any),
                                            "EEEE, MMM dd, yyyy"
                                        )}{" "}
                                        {format(
                                            parse(
                                                ride.startTime as any,
                                                "HH:mm:ss",
                                                new Date()
                                            ),
                                            "hh:mm a"
                                        )}
                                    </p>
                                    <p>{ride.startAddress}</p>
                                    <p>
                                        {ride.rideType} for{" "}
                                        <span className='font-bold ps-1'>
                                            {ride.distance} miles
                                        </span>
                                    </p>
                                </div>
                                <div>
                                    <p className='flex items-center gap-1'>
                                        <IoEyeOutline /> {ride.viewCount}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
};

export default HotRideCard;
