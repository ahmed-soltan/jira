import { useState } from "react";
import {
  format,
  getDay,
  parse,
  startOfWeek,
  addMonths,
  subMonths,
} from "date-fns";
import { enUS } from "date-fns/locale";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { CalendarIcon, ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

import { EventCard } from "./event-card";
import { Button } from "@/components/ui/button";

import { Task } from "../types";

import "react-big-calendar/lib/css/react-big-calendar.css";
import "./data-calendar.css";

const locales = {
  "en-US": enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

interface DataCalendarProps {
  data: Task[];
}
interface CustomToolbarProps {
  date: Date;
  onNavigate: (action: "PREV" | "NEXT" | "TODAY") => void;
}

const CustomToolbar = ({ date, onNavigate }: CustomToolbarProps) => {
  return (
    <div className="flex mb-4 gap-x-2 items-center w-full lg:w-auto justify-center lg:justify-start">
      <Button
        variant={"secondary"}
        size={"icon"}
        className="flex items-center"
        onClick={() => onNavigate("PREV")}
      >
        <ChevronLeftIcon className="size-4" />
      </Button>
      <div className="flex items-center border border-input px-2 py-2 rounded-md h-8 justify-center w-full lg:w-auto">
        <CalendarIcon className="size-4 mr-2" />
        <p className="text-sm ">{format(date, "MMMM yyyy")}</p>
      </div>
      <Button
        variant={"secondary"}
        size={"icon"}
        className="flex items-center"
        onClick={() => onNavigate("NEXT")}
      >
        <ChevronRightIcon className="size-4" />
      </Button>
    </div>
  );
};

export const DataCalendar = ({ data }: DataCalendarProps) => {
  const [value, setValue] = useState(() => {
    if (data.length > 0 && data[0].dueDate) {
      return new Date(data[0].dueDate);
    }
    return new Date();
  });

  const events = data.map((task) => ({
    start: new Date(task.dueDate),
    end: new Date(task.dueDate),
    title: task.name,
    project: task.project,
    assignee: task.assignee,
    status: task.status,
    id: task.$id,
  }));

  const handleNavigate = (action: "PREV" | "NEXT" | "TODAY") => {
    setValue((prev) => {
      if (action === "PREV") return subMonths(prev, 1);
      if (action === "NEXT") return addMonths(prev, 1);
      return new Date();
    });
  };

  return (
    <Calendar
      className="h-full"
      localizer={localizer}
      date={value}
      events={events}
      views={["month"]}
      defaultView="month"
      toolbar
      showAllEvents
      max={new Date(new Date().setFullYear(new Date().getFullYear() + 1))}
      formats={{
        weekdayFormat: (date, culture, localizer) =>
          localizer?.format(date, "EEE", culture) ?? "",
      }}
      components={{
        eventWrapper: ({ event }) => (
          <EventCard
            id={event.id}
            title={event.title}
            project={event.project}
            assignee={event.assignee}
            status={event.status}
          />
        ),
        toolbar: ({}) => (
          <CustomToolbar date={value} onNavigate={handleNavigate} />
        ),
      }}
    />
  );
};
