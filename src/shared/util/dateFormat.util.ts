import dayjs from 'dayjs';
import { format, parseISO } from 'date-fns';

export function formatDate(inputDate: string) {
    if (inputDate) {
        const date = dayjs(inputDate);
        const formattedDate = date.format('ddd MMM DD YYYY HH:mm:ss');
        return formattedDate;
    }
}



export function parseTime(timeString: string) {
    if (timeString) {
        
        const isoDateString = `${new Date().toISOString().slice(0, 10)}T${timeString}`;

        const parsedDate = parseISO(isoDateString);
        
        const formattedDateTime = parsedDate;

        return formattedDateTime;
    }
}