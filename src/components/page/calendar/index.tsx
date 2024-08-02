"use client"
import * as React from 'react';
import { timezoneNames } from '@progress/kendo-date-math';
import { DropDownList, DropDownListChangeEvent } from '@progress/kendo-react-dropdowns';
import { Scheduler, TimelineView, DayView, WeekView, MonthView, AgendaView, SchedulerViewChangeEvent, SchedulerDateChangeEvent } from '@progress/kendo-react-scheduler';

import '@progress/kendo-date-math/tz/Etc/UTC';
import '@progress/kendo-date-math/tz/Europe/Sofia';
import '@progress/kendo-date-math/tz/Europe/Madrid';
import '@progress/kendo-date-math/tz/Asia/Dubai';
import '@progress/kendo-date-math/tz/Asia/Tokyo';
import '@progress/kendo-date-math/tz/America/New_York';
import '@progress/kendo-date-math/tz/America/Los_Angeles';

import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/redux/store/store';
import { addMonths, format, subMonths } from 'date-fns';
import useCalendarEvents from '@/shared/hook/useCalenderEvent';
import  { CalendarProfileItem } from './parts/CustomEventItem';
import { getCalendarRides } from '@/redux/slices/calendarSlice';

export const Calender = () => {                     
  const timezones = React.useMemo(() => timezoneNames(), []);
  const [view, setView] = React.useState('agenda');
  const [date, setDate] = React.useState(new Date());
  const [timezone, setTimezone] = React.useState('Etc/UTC');
  const [orientation, setOrientation] = React.useState<"horizontal" | "vertical">('vertical');
  const dispatch = useDispatch<AppDispatch>();
  const { customModelFields, sampleDataWithCustomSchema } = useCalendarEvents();

  React.useEffect(() => {
    (async () => {
      const params = {
        id: 63,
        radius: 50,
        startDate: format(date, "yyyy-MM-dd"),
        endDate: format(addMonths(date,1) , "yyyy-MM-dd")
      };
      await dispatch(getCalendarRides(params));
    })();
  }, [dispatch,date]);

  const handleViewChange = React.useCallback(
    (event: SchedulerViewChangeEvent) => { 
      setView(event.value);
     },
    [setView]
  );

  const handleDateChange = React.useCallback(
    (event: SchedulerDateChangeEvent) => { setDate(event.value); 
    console.log(event.value)
     },
    [setDate]
  );

  const handleTimezoneChange = React.useCallback(
    (event: DropDownListChangeEvent) => { setTimezone(event.target.value); },
    [setTimezone]
  );

  return (
    <div className='w-11/12 mx-auto !max-w-[1320px]'>
      <div className="example-config mt-32">
        <div className="row">
          <div className="col">
          </div>
        </div>
      </div>
      <div>
        <Scheduler
          data={sampleDataWithCustomSchema}
          view={view}
          onViewChange={handleViewChange}
          date={date}
          onDateChange={handleDateChange}
          editable={false}
          timezone={timezone}
          modelFields={customModelFields}
          item={CalendarProfileItem}
          
          
        >
          <TimelineView />
          <DayView />
          <WeekView />
          <MonthView />
          <AgendaView   />
        </Scheduler>
      </div>
    </div>
  );
};
