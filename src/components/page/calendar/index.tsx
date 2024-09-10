"use client";

import * as React from "react";
import "../../../../node_modules/@syncfusion/ej2-base/styles/material.css";
import "../../../../node_modules/@syncfusion/ej2-buttons/styles/material.css";
import "../../../../node_modules/@syncfusion/ej2-calendars/styles/material.css";
import "../../../../node_modules/@syncfusion/ej2-dropdowns/styles/material.css";
import "../../../../node_modules/@syncfusion/ej2-inputs/styles/material.css";
import "../../../../node_modules/@syncfusion/ej2-lists/styles/material.css";
import "../../../../node_modules/@syncfusion/ej2-navigations/styles/material.css";
import "../../../../node_modules/@syncfusion/ej2-popups/styles/material.css";
import "../../../../node_modules/@syncfusion/ej2-splitbuttons/styles/material.css";
import "../../../../node_modules/@syncfusion/ej2-react-schedule/styles/material.css";

import {
  ScheduleComponent,
  MonthAgenda,
  Inject,
  ViewsDirective,
  ViewDirective,
  EventClickArgs,
  NavigatingEventArgs,
} from "@syncfusion/ej2-react-schedule";

import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store/store";
import { addMonths, format } from "date-fns";
import useCalendarEvents from "@/shared/hook/useCalenderEvent";
import { getCalendarRides } from "@/redux/slices/calendarSlice";
import { useRouter } from "next/navigation";
import dayjs from "dayjs";
import { IMAGE_URl } from "@/constant/appConfig";

export const Calender: React.FC = () => {
  const [date, setDate] = React.useState(new Date());
  const dispatch = useDispatch<AppDispatch>();
  const { sampleDataWithCustomSchema } = useCalendarEvents();
  const scheduleObj = React.useRef<any>(null);
  const { push } = useRouter();

  const eventTemplate = (event: any) => (
    <>
      <div className="event-template flex items-center justify-between w-full">
      <img
          src={IMAGE_URl+event.MapUrl}
          alt="Event"
          style={{
            width: "80px",
            height: "60px",
            marginRight: "10px",
            borderRadius: "10%",
          }}
        />
        <div className="">
          <p className="font-semibold">{event.Subject}</p>
          <p className="!text-xs" style={{fontSize:"14px"}}>
            {event.Type} | {dayjs(event.StartTime).format("hh:mm A")}
            {"-"}
            {dayjs(event.EndTime).format("hh:mm A")}
          </p>
          <p className="!text-xs">{dayjs(event.Date).format("ddd, MMM D, YYYY")}</p>
          <p className="!text-xs">
            {event.City}, {event.state}
          </p>
        </div>
      </div>
    </>
  );

  const eventSettings = {
    dataSource: sampleDataWithCustomSchema,
    template: eventTemplate,
    fields: {
      subject: { name: "Subject" },
      imageUrl: { name: "ImageUrl" },
    },
  };

  const onEventRendered = (args: any) => {
    applyCategoryColor(args, scheduleObj.current?.currentView);
  };

  const onEventClick = (args: EventClickArgs | any) => {
    const eventId = args.event?.Id;
    if (eventId) {
      window.open(`ride/${eventId}`, "_blank");
    }
    args.cancel = true;
  };

  const fetchMonthData = async (month: string) => {
    const params = {
      id: 33,
      radius: 100,
      startDate: `${month}-01`,
      endDate: format(addMonths(new Date(`${month}-01`), 1), "yyyy-MM-dd"),
    };
    await dispatch(getCalendarRides(params));
  };

  React.useEffect(() => {
    fetchMonthData(format(date, "yyyy-MM"));
  }, [date]);

  function applyCategoryColor(args: any, currentView: any) {
    let categoryColor = args.data.CategoryColor;
    if (!args.element || !categoryColor) {
      return;
    }
    if (currentView === "Agenda") {
      args.element.firstChild.style.borderLeftColor = categoryColor;
    } else {
      args.element.style.backgroundColor = categoryColor;
      args.element.style.margin = "10px 0px";
    }
  }

  const onNavigating = (args: NavigatingEventArgs | any) => {
    const currentMonth = format(args.currentDate, "yyyy-MM");
    fetchMonthData(currentMonth);
  };

  return (
    <div className="w-11/12 mx-auto !max-w-[1320px] mt-32">
      <ScheduleComponent
        width="100%"
        height="70vh"
        className="mx-auto"
        selectedDate={date}
        ref={scheduleObj}
        eventSettings={eventSettings}
        eventRendered={onEventRendered}
        eventClick={onEventClick}
        navigating={onNavigating}
      >
        <ViewsDirective>
          <ViewDirective option="MonthAgenda" />
        </ViewsDirective>
        <Inject services={[MonthAgenda]} />
      </ScheduleComponent>
    </div>
  );
};
