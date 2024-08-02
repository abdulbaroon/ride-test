import React, { act, useEffect, useState } from 'react';
import { format, addDays } from 'date-fns';
import { RideItem } from '@/shared/types/dashboard.types';
import { twMerge } from 'tailwind-merge';
import { filter, set } from 'lodash';

interface DateFilterButtonProps {
    ridedata: RideItem[]
    handelFilterData: (data:RideItem[]) => void;
    filter:boolean
}

interface DateButton {
    date: Date;
    onClick: () => void;
    item:number
    active: boolean
}
const DateButton = ({ date, onClick ,item ,active}: DateButton) => {
    const[hover,setHover]=useState<boolean>()
    return (
        <button onClick={onClick}
        onMouseEnter={()=>setHover(true)}
        onMouseLeave={()=>setHover(false)}
         className={twMerge('w-full text-sm py-2 border text-primaryDarkblue bg-[#dee4eb] rounded-md',(hover|| active)&&("text-white bg-secondaryButton"))}
         >
            {format(date, "EEE dd")}
            <span
            className={twMerge(`  ${item>0?"text-[#52d1ac] bg-[#c8e1e1]":"text-red-600 bg-[#e0d3da]"} rounded-md px-2 py-1 ms-3`,(hover|| active)&&(`${item>0?"bg-[#106176]":"bg-[#28536f]"}`))}
             >
                {item}</span>
        </button>
    );
};

const DateFilterButton: React.FC<DateFilterButtonProps> = ({ ridedata,handelFilterData ,filter}) => {
  const [filterIndex,setFilterIndex]=useState<number|null>(null)
  useEffect(()=>{
    if(!filter){
     setFilterIndex(null)
    }
  },[filter])
    const handleClick = (data: RideItem[],index:number) => {
        handelFilterData(data)
        setFilterIndex(index)
    };
    const buttons = Array.from({ length: 7 }, (_, i) => {
        const date = addDays(new Date(), i)
        const filterdata = ridedata.filter((item: RideItem) => format(item.activityDate?item.activityDate:new Date(), 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd'))
        return {
            date: date,
            filterData: filterdata
        }
    });
    return (
        <div className='flex mt-6 gap-6 px-4'>
            {buttons.map((data, index) => (
                <DateButton 
                key={index} 
                date={data?.date} 
                item={data?.filterData.length}
                active={index===filterIndex}  
                onClick={() => handleClick(data?.filterData,index)} 
                />
            ))}
        </div>
    );
};

export default DateFilterButton;


