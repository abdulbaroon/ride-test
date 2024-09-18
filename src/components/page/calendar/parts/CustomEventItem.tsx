import {
    SchedulerEditItem,
    SchedulerEditItemProps,
} from "@progress/kendo-react-scheduler";
import Link from "next/link";

export const CalendarProfileItem = (props: SchedulerEditItemProps) => {
    return (
        <SchedulerEditItem
            {...props}
            style={{
                ...props.style,
                backgroundColor: props.dataItem.Color,
                color: "black",
            }}>
            <Link href={`/ride/${props.dataItem.TaskID}`} target='_blank'>
                {props.dataItem.Title}
            </Link>
        </SchedulerEditItem>
    );
};
