import { autoUpdate as floatingUiAutoUpdate, flip, shift, useFloating } from "@floating-ui/react-dom";
import { useClickOutside } from "@mantine/hooks";
import { Calendar, ICalendarProps } from "@react-shamsi-salmanfood/calendar";
import { format } from "date-fns-jalali";
import { convertDigits } from "persian-helpers";
import { useEffect, useState } from "react";
import Modal from "./Modal";

interface DatePickerOnChange {
  onChange?: (newDate: Date) => void;
}

interface IDatePickerProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange">, DatePickerOnChange {
  autoUpdate?: boolean;
  defaultDate?: Date;
  calendarProps?: ICalendarProps;
  date?: Date;
  dateFormat?: string;
  persianDigits?: boolean;
  calendarModal?: boolean;
}

export const DatePicker = ({
  autoUpdate,
  calendarProps,
  onChange,
  defaultDate,
  dateFormat = "yyyy/MM/dd hh:mm:ss aaa",
  date: controlledDate,
  persianDigits,
  calendarModal = false,
  ...props
}: IDatePickerProps) => {
  const { x, y, reference, floating, strategy } = useFloating({
    placement: "bottom-end",
    strategy: "absolute",
    middleware: [flip(), shift({ crossAxis: true })],
    whileElementsMounted: floatingUiAutoUpdate,
  });

  const [date, setDate] = useState(defaultDate || controlledDate);
  const [isOpen, setIsOpen] = useState(false);
  const [inputRef, setInputRef] = useState<any>(null);
  const [calendarRef, setCalendarRef] = useState<any>(null);

  useClickOutside(() => setIsOpen(false), null, [calendarRef, inputRef]);

  const updateDateHandler = (newDate: Date) => {
    if (!controlledDate) setDate(newDate);
    onChange?.(newDate);
  };

  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => setIsMounted(true), []);
  useEffect(() => {
    if (!isMounted) return;
    setDate(controlledDate);
  }, [controlledDate]);

  // Inline styles for smooth pop-up animation
  const popupStyle: React.CSSProperties = {
    opacity: isOpen ? 1 : 0,
    transform: isOpen ? "scale(1) translateY(0)" : "scale(0.98) translateY(-12px)",
    transition: "opacity 0.15s ease-in-out, transform 0.15s ease-in-out",
    position: strategy,
    zIndex: 999,
    pointerEvents: isOpen ? "auto" : "none",
  };

  const CalendarComponent = (
    <div ref={setCalendarRef} style={popupStyle}>
      <Calendar
        activeDate={date}
        onChange={(newDate) => autoUpdate && updateDateHandler(newDate)}
        showFooter
        onConfirm={(newDate) => {
          updateDateHandler(newDate);
          setIsOpen(false);
        }}
        onCancel={() => setIsOpen(false)}
        {...calendarProps}
      />
    </div>
  );

  const CalendarModalComponent = (
    <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
      <Calendar
        activeDate={date}
        onChange={(newDate) => autoUpdate && updateDateHandler(newDate)}
        showFooter
        onConfirm={(newDate) => {
          updateDateHandler(newDate);
          setIsOpen(false);
        }}
        onCancel={() => setIsOpen(false)}
      />
    </Modal>
  );

  return (
    <>
      <div ref={setInputRef}>
        <input
          ref={reference}
          className="p-2 rounded-md border border-gray-300"
          value={
            date
              ? convertDigits(format(date, dateFormat), {
                  to: persianDigits ? "fa" : "en",
                })
              : ""
          }
          readOnly
          onClick={(event) => {
            setIsOpen(true);
            props.onClick?.(event);
          }}
          {...props}
        />
      </div>
      {calendarModal ? CalendarModalComponent : CalendarComponent}
    </>
  );
};
