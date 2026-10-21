"use client";

import { useState } from "react";
import { format, parseISO } from "date-fns";
import { CalendarDays } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

const toIso = (date: Date) => format(date, "yyyy-MM-dd");

/**
 * A date field that opens a calendar. The picked day is posted as `name` (yyyy-MM-dd) through a
 * hidden input, so the surrounding form can keep reading it with FormData.
 */
export function DatePickerField({
  id,
  name,
  value,
  onChange,
  maxDate,
  placeholder = "Pick a date",
  className,
  invalid,
  describedBy,
}: {
  id: string;
  name: string;
  /** yyyy-MM-dd, or "" when nothing is picked. */
  value: string;
  onChange: (value: string) => void;
  /** Last selectable day; later days are disabled. */
  maxDate?: Date | undefined;
  placeholder?: string | undefined;
  className?: string | undefined;
  invalid?: boolean | undefined;
  describedBy?: string | undefined;
}) {
  const [open, setOpen] = useState(false);
  const selected = value ? parseISO(value) : undefined;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <input type="hidden" name={name} value={value} />
      <PopoverTrigger asChild>
        <button
          id={id}
          type="button"
          aria-invalid={invalid || undefined}
          aria-describedby={describedBy}
          aria-haspopup="dialog"
          className={cn("flex items-center justify-between gap-3 text-left", className)}
        >
          <span className={selected ? "text-foreground" : "text-muted-foreground"}>
            {selected ? format(selected, "dd MMM yyyy") : placeholder}
          </span>
          <CalendarDays className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={selected}
          {...((selected ?? maxDate) ? { defaultMonth: (selected ?? maxDate) as Date } : {})}
          {...(maxDate ? { endMonth: maxDate, disabled: { after: maxDate } } : {})}
          onSelect={(date) => {
            onChange(date ? toIso(date) : "");
            if (date) setOpen(false);
          }}
          autoFocus
        />
      </PopoverContent>
    </Popover>
  );
}
