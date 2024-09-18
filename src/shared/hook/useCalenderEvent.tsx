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
    const calenderData = useSelector<RootState, CalendarEvent[]>(
        (state) => state.calendar.rides
    );

    const eventData = calenderData.map((data) => {
        const startDate = `${format(data.activityDate, "yyyy-MM-dd")}T${
            data.activityStartTime
        }.000Z`;
        const endDate = `${format(data.activityDate, "yyyy-MM-dd")}T${
            data.activityEndTime
        }.000Z`;

        return {
            TaskID: data?.activityID,
            OwnerID: data.userID,
            Title: data?.activityName,
            Description: data?.activityNotes,
            StartTimezone: null,
            Start: startDate,
            End: endDate,
            Type: data.activityTypeName,
            Color: data.activityTypeColor,
            EndTimezone: null,
            RecurrenceRule: null,
            RecurrenceID: null,
            RecurrenceException: null,
            isAllDay: false,
        };
    });

    const customCalendarFields = {
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

    const calendarEvents = eventData?.map((dataItem) => ({
        ...dataItem,
        Start: parseAdjust(dataItem.Start),
        End: parseAdjust(dataItem.End),
        PersonIDs: randomInt(1, 2),
        RoomID: randomInt(1, 2),
    }));

    return {
        customCalendarFields,
        calendarEvents,
    };
};

export default useCalendarEvents;
