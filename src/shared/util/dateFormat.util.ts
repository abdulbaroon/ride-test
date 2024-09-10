import dayjs from "dayjs";
import { format, parse, parseISO } from "date-fns";

export function formatDate(inputDate: string) {
    if (inputDate) {
        const date = dayjs(inputDate);
        const formattedDate = date.format("ddd MMM DD YYYY HH:mm:ss");
        return formattedDate;
    }
}

export function parseTime(timeString: string) {
    if (timeString) {
        const isoDateString = `${new Date()
            .toISOString()
            .slice(0, 10)}T${timeString}`;
        const parsedDate = parseISO(isoDateString);
        const formattedDateTime = parsedDate;
        return formattedDateTime;
    }
}

export const getTimeToDate = (specificTime: any, date?: any) => {
    return dayjs(date)
        .set("hour", parseInt(specificTime?.split(":")[0]))
        .set("minute", parseInt(specificTime?.split(":")[1]))
        .set("second", parseInt(specificTime?.split(":")[2]));
};

export const formatDates = (
    dateString: any,
    dateFormat = "EEEE, MMMM dd, yyyy"
) => {
    return dateString ? format(parseISO(dateString), dateFormat) : "";
};

export const formatTime = (timeString: any, timeFormat = "hh:mm a") => {
    return timeString
        ? format(parse(timeString, "HH:mm:ss", new Date()), timeFormat)
        : "";
};

export const formatIsoDateString = (dateString: string): string => {
    if (dateString) {
        const date = parseISO(dateString);
        const formattedDate = format(date, "MMM dd, yyyy, hh:mm aa");
        return formattedDate;
    }
    return "";
};
