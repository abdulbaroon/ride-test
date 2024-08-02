import React from 'react'
import { FormattedRide } from '@/shared/types/dashboard.types'
import Slider from "react-slick";
import { format, parse, parseISO } from 'date-fns';
import { IoEyeOutline } from 'react-icons/io5';
import { useRouter } from 'next/navigation';
interface HotRideCardProps {
    data: FormattedRide[]
}
var settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
};

const HotRideCard: React.FC<HotRideCardProps> = ({ data }) => {
    const {push} = useRouter()
    return (
        <Slider {...settings} arrows={false}>
            {data?.map((data, index) => (
                <div key={index} className='shadow-lg rounded-lg h-fit bg-white p-5 border cursor-pointer '
                //  onClick={()=>push(`/ride/getride/${data.activityID}`)}
                 >
                    <div className='flex flex-row justify-between'>
                        <div className='text-sm'>
                            <p className='font-bold text-base'>{data.rideName}</p>
                            <p>public ride</p>
                            <p>{format(parseISO(data.startDate as any), "EEEE, MMM dd, yyyy")}{"  "}
                                {format(parse(data.startTime as any, 'HH:mm:ss', new Date()), 'hh:mm a')}{""}</p>
                            <p>{data.startAddress}</p>
                            <p>{data.rideType} for <span className='font-bold ps-1' >{data.distance} miles</span></p>
                        </div>
                        <div>
                            <p className='flex items-center gap-1'>
                                <IoEyeOutline /> {data.viewCount}
                            </p>
                        </div>
                    </div>
                </div>
            ))}
        </Slider>

    )
}

export default HotRideCard