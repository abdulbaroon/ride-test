import { SchedulerEditItem, SchedulerEditItemProps } from "@progress/kendo-react-scheduler";

export const CalendarProfileItem = (props: SchedulerEditItemProps) => {
    return (
        <SchedulerEditItem
            {...props}
            style={{ backgroundColor: props.dataItem.Color }}
        ></SchedulerEditItem>
    );
};
