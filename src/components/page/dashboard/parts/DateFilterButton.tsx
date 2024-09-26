import React, { act, useEffect, useState } from "react";
import { format, addDays } from "date-fns";
import { RideItem } from "@/shared/types/dashboard.types";
import { twMerge } from "tailwind-merge";

/**
 * Interface representing the props for the DateFilterButton component.
 */
interface DateFilterButtonProps {
    /** Array of ride data items. */
    ridedata: RideItem[];

    /** Function to handle filtering the ride data. */
    handelFilterData: (data: RideItem[]) => void;

    /** Boolean to indicate if a filter is currently applied. */
    filter: boolean;
}

/**
 * Interface representing the props for an individual DateButton component.
 */
interface DateButtonProps {
    /** The date displayed on the button. */
    date: Date;

    /** Callback function to be called when the button is clicked. */
    onClick: () => void;

    /** Number of rides on the particular date. */
    item: number;

    /** Boolean to indicate if the button is currently active. */
    active: boolean;
}

/**
 * A button component that displays a date and the number of rides available on that date.
 *
 * @param {DateButtonProps} props - The props for the DateButton component.
 * @returns {JSX.Element} The rendered DateButton component.
 */
const DateButton: React.FC<DateButtonProps> = ({ date, onClick, item, active }) => {
    const [hover, setHover] = useState<boolean>(false);

    return (
        <button
            onClick={onClick}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            className={twMerge(
                "w-full text-sm py-2 border border-slate-300 text-primaryDarkblue bg-[#dee4eb] rounded-md",
                (hover || active) && "text-white bg-secondaryButton"
            )}>
            {format(date, "EEE dd")}
            <span
                className={twMerge(
                    `  ${
                        item > 0
                            ? "text-[#2c7762] bg-[#c8e1e1]"
                            : "text-red-600 bg-[#e0d3da]"
                    } rounded-md px-2 py-1 ms-3`,
                    (hover || active) &&
                        `${item > 0 ? "bg-[#106176]" : "bg-[#28536f]"}`
                )}>
                {item}
            </span>
        </button>
    );
};

/**
 * A date filter component that renders a series of buttons for the next 7 days.
 * Each button shows the number of rides on that day, and allows filtering by date.
 *
 * @param {DateFilterButtonProps} props - The props for the DateFilterButton component.
 * @returns {JSX.Element} The rendered DateFilterButton component.
 */
const DateFilterButton: React.FC<DateFilterButtonProps> = ({
    ridedata,
    handelFilterData,
    filter,
}) => {
    /** Index of the currently active filter. */
    const [filterIndex, setFilterIndex] = useState<number | null>(null);

    useEffect(() => {
        if (!filter) {
            setFilterIndex(null);
        }
    }, [filter]);

    /**
     * Handles the click event for filtering the data by date.
     *
     * @param {RideItem[]} data - The ride data to filter.
     * @param {number} index - The index of the button clicked.
     */
    const handleClick = (data: RideItem[], index: number) => {
        handelFilterData(data);
        setFilterIndex(index);
    };

    /**
     * Generates the date buttons for the next 7 days, with associated ride data.
     */
    const buttons = Array.from({ length: 7 }, (_, i) => {
        const date = addDays(new Date(), i);

        // Filter the rides that match the current date
        const filterdata = ridedata.filter(
            (item: RideItem) =>
                format(item.activityDate ?? new Date(), "yyyy-MM-dd") ===
                format(date, "yyyy-MM-dd")
        );

        return {
            date: date,
            filterData: filterdata,
        };
    });

    return (
        <div className="flex mt-6 gap-6 px-4">
            {buttons.map((data, index) => (
                <DateButton
                    key={index}
                    date={data?.date}
                    item={data?.filterData.length}
                    active={index === filterIndex}
                    onClick={() => handleClick(data?.filterData, index)}
                />
            ))}
        </div>
    );
};

export default DateFilterButton;
