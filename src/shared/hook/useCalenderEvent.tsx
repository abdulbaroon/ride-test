import { RootState } from "@/redux/store/store";
import { format } from "date-fns";
import { useSelector } from "react-redux";
interface CalendarEvent {
    activityID?: string;
    userID: string;
    activityName: string;
    activityNotes: string;
    activityDate: Date;
    activityStartTime: string;
    activityEndTime: string;
    activityTypeName: string;
    activityTypeColor: string;
}
const useCalendarEvents = () => {
    const calenderData = useSelector<RootState, CalendarEvent[] | any>(
        (state) => state.calendar.rides
    );
    const eventData = calenderData.map((data: any) => {
        const startDate = `${format(data.activityDate, "yyyy-MM-dd")}T${
            data.activityStartTime
        }.000Z`;
        const endDate = `${format(data.activityDate, "yyyy-MM-dd")}T${
            data.activityEndTime
        }.000Z`;
        const mapImage =
            data?.activityPictures?.find((pic: any) => pic.isMap)
                ?.picturePath || "";

        // return {
        //     TaskID: data?.activityID,
        //     OwnerID: data.userID,
        //     Title: data?.activityName,
        //     Description: data?.activityNotes,
        //     StartTimezone: null,
        //     Start: startDate,
        //     End: endDate,
        //     Color: data.activityTypeColor,
        //     EndTimezone: null,
        //     RecurrenceRule: null,
        //     RecurrenceID: null,
        //     RecurrenceException: null,
        //     isAllDay: false
        // };

        return {
            Date: data.activityDate,
            Type: data.activityTypeName,
            Id: data?.activityID,
            Subject: data?.activityName,
            Description: data?.activityNotes,
            StartTime: startDate,
            EndTime: endDate,
            // StartTimezone: "Europe/Moscow",
            // EndTimezone:" Europe/Moscow",
            City: data?.startCity,
            state: data?.startState,
            CategoryColor: data.activityTypeColor,
            GroupId: 1,
            MapUrl: mapImage,
        };
    });

    const customModelFields = {
        id: "TaskID",
        title: "Title",
        description: "Description",
        start: "Start",
        end: "End",
        recurrenceRule: "RecurrenceRule",
        recurrenceId: "RecurrenceID",
        recurrenceExceptions: "RecurrenceException",
        color: "Color",
    };

    const currentYear = new Date().getFullYear();

    const parseAdjust = (eventDate: string) => {
        const date = new Date(eventDate);
        date.setFullYear(currentYear);
        return date;
    };

    const randomInt = (min: number, max: number) =>
        Math.floor(Math.random() * (max - min + 1)) + min;

    const sampleDataWithCustomSchema = eventData?.map((dataItem: any) => ({
        ...dataItem,
        StartTime: parseAdjust(dataItem.StartTime),
        EndTime: parseAdjust(dataItem.EndTime),
    }));

    return {
        customModelFields,
        sampleDataWithCustomSchema,
    };
};

export default useCalendarEvents;
