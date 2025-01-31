"use client";

import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Calendar } from "./ui/calendar";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

interface DatePickerProps {
  value: Date | undefined;
  onChange: (date: Date) => void;
  className?: string;
  placeHolder?: string;
}

export const DatePicker = ({
  value,
  onChange,
  className,
  placeHolder = "Select a date",
}: DatePickerProps) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          size={"lg"}
          variant={"outline"}
          className={cn(
            "flex items-center text-left font-normal px-3",
            className,
            !value && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {value ? format(value, "PPP") : <span>{placeHolder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Calendar
          mode="single"
          selected={value}
          onSelect={(date) => onChange(date as Date)}
          disabled={(date) =>
            date < new Date() || date < new Date("1900-01-01")
          }
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
};

