"use client";
import * as React from "react";
import { timezoneNames } from "@progress/kendo-date-math";
import {
    DropDownList,
    DropDownListChangeEvent,
} from "@progress/kendo-react-dropdowns";
import {
    Scheduler,
    DayView,
    WeekView,
    MonthView,
    AgendaView,
    SchedulerViewChangeEvent,
    SchedulerDateChangeEvent,
    SchedulerViewItemProps,
    SchedulerViewItem,
    SchedulerViewSlot,
    SchedulerViewSlotProps,
    SchedulerEditItem,
    SchedulerItem,
} from "@progress/kendo-react-scheduler";

import "@progress/kendo-date-math/tz/Etc/UTC";
import "@progress/kendo-date-math/tz/Europe/Sofia";
import "@progress/kendo-date-math/tz/Europe/Madrid";
import "@progress/kendo-date-math/tz/Asia/Dubai";
import "@progress/kendo-date-math/tz/Asia/Tokyo";
import "@progress/kendo-date-math/tz/America/New_York";
import "@progress/kendo-date-math/tz/America/Los_Angeles";
import "@progress/kendo-theme-default/dist/all.css";

import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store/store";
import { format, subMonths } from "date-fns";
import useCalendarEvents from "@/shared/hook/useCalenderEvent";
import { CalendarProfileItem } from "./parts/CustomEventItem";
import { getCalendarRides } from "@/redux/slices/calendarSlice";
import Link from "next/link";
import dayjs from "dayjs";
import { Spinner } from "@chakra-ui/react";

export const Calender = () => {
    const profile = useSelector<RootState, any>(
        (state) => state.auth.profileData
    );
    const timezones = React.useMemo(() => timezoneNames(), []);
    const [date, setDate] = React.useState(dayjs().toDate());
    const [loading, setLoading] = React.useState(false);
    const [currentMonth, setCurrentMonth] = React.useState(0);
    const [timezone, setTimezone] = React.useState("Etc/UTC");
    const dispatch = useDispatch<AppDispatch>();
    const { customCalendarFields, calendarEvents } = useCalendarEvents();

    const fetchCalendarRides = async (monthDate: Date) => {
        try {
            setLoading(true);
            setCurrentMonth(dayjs(monthDate).month() + 1);
            const params = {
                id: profile.userID,
                radius: profile.defaultRadius,
                startDate: dayjs(monthDate)
                    .startOf("month")
                    .format("YYYY-MM-DD"),
                endDate: dayjs(monthDate).endOf("month").format("YYYY-MM-DD"),
            };
            await dispatch(getCalendarRides(params));
            setLoading(false);
        } catch (error) {
            console.error("Failed to fetch calendar rides:", error);
            setLoading(false);
        }
    };

    React.useEffect(() => {
        fetchCalendarRides(dayjs().toDate());
    }, [profile]);

    const handleDateChange = React.useCallback(
        (event: SchedulerDateChangeEvent) => {
            //console.log("date change event....", event);
            console.log("current month....", currentMonth);

            const newMonth = dayjs(event.value).month() + 1;

            if (newMonth !== currentMonth) {
                setCurrentMonth(newMonth);
                console.log("current month changed: new month:", newMonth);
                fetchCalendarRides(dayjs(event.value).toDate());
            } else {
                console.log("current month is same: ", newMonth);
            }

            setDate(event.value);
        },
        [currentMonth, setCurrentMonth, setDate]
    );

    const handleTimezoneChange = React.useCallback(
        (event: DropDownListChangeEvent) => {
            setTimezone(event.target.value);
        },
        [setTimezone]
    );

    const customAgendaRender = (props: any) => {
        //console.log("agenda event....", props);
        const eventColor = props.dataItem.Color || "#000";

        return (
            <Link href={`/ride/${props.dataItem.TaskID}`} target='_blank'>
                <div
                    //className='k-event'
                    style={{ display: "flex", alignItems: "center" }}>
                    <div
                        className='text-xs text-black font-semibold p-1.5 rounded-md'
                        style={{ backgroundColor: props.dataItem.Color }}>
                        {props.dataItem.Type}
                    </div>
                    <span className='ml-2'>{props.dataItem.Title}</span>
                </div>
            </Link>
        );
    };

    const customViewItem = (props: SchedulerViewItemProps) => {
        return (
            <SchedulerViewItem
                {...props}
                style={{
                    ...props.style,
                    height: "auto",
                }}
            />
        );
    };

    const customItem = (props: SchedulerViewItemProps) => {
        return (
            <Link href={`/ride/${props.dataItem.TaskID}`} target='_blank'>
                <SchedulerItem
                    {...props}
                    style={{
                        ...props.style,
                        color: "black",
                        backgroundColor: props.dataItem.Color,
                        cursor: "pointer",
                        padding: 5,
                        height: "auto",
                    }}>
                    {props.dataItem.Title}
                </SchedulerItem>
            </Link>
        );
    };

    const customViewSlot = (props: SchedulerViewSlotProps) => {
        return (
            <SchedulerViewSlot
                {...props}
                style={{
                    ...props.style,
                    minHeight: 120,
                }}
            />
        );
    };

    return (
        <div className='mt-28 h-full'>
            <div className='w-11/12 h-full mx-auto flex gap-5 !max-w-[1320px]'>
                <div className='h-full w-full'>
                    {loading && (
                        <div className='flex justify-center items-center w-full py-3'>
                            <Spinner color='red.500' />
                        </div>
                    )}
                    <div className='flex justify-self-start items-center bg-white border border-neutral-300 rounded-md p-3 mb-4'>
                        <div>
                            😍 There are{" "}
                            {calendarEvents.length === 0
                                ? "zero"
                                : calendarEvents.length}{" "}
                            rides scheduled for this month.
                        </div>
                    </div>
                    <Scheduler
                        height={"100%"}
                        data={calendarEvents}
                        modelFields={customCalendarFields}
                        date={date}
                        onDateChange={handleDateChange}
                        //onNavigate={handleNavigate}
                        editable={false}
                        timezone={timezone}
                        item={customItem}
                        viewItem={customViewItem}
                        viewSlot={customViewSlot}
                        defaultView='agenda'>
                        <DayView
                            currentTimeMarker
                            startTime='05:00'
                            endTime='16:00'
                        />
                        <MonthView
                            itemsPerSlot={5}
                            //viewItem={customMonthRender}
                        />
                        <AgendaView
                            numberOfDays={7}
                            viewTask={customAgendaRender}
                        />
                    </Scheduler>
                </div>
            </div>
        </div>
    );
};
