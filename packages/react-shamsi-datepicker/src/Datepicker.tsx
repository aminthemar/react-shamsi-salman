import { flip, autoUpdate as floatingUiAutoUpdate, shift, useFloating } from "@floating-ui/react-dom";
import { useClickOutside } from "@mantine/hooks";
import { Calendar, ICalendarProps } from "@react-shamsi-salmanfood/calendar";
import { IconCalendar, IconSwitchVertical } from "@tabler/icons";
import { format, isValid, parse } from "date-fns-jalali";
import { convertDigits } from "persian-helpers";
import { StyleHTMLAttributes, useEffect, useState } from "react";
import Modal from "./Modal";

interface DatePickerOnChange {
  onChange?: (newDate: Date) => void;
}

interface IDatePickerProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange">, DatePickerOnChange {
  autoUpdate?: boolean;
  canType?: boolean;
  defaultDate?: Date;
  calendarProps?: ICalendarProps;
  date?: Date;
  inputClassName?: string;
  label?: string;
  labelStyles?: React.CSSProperties;
  fontFamily?: string;
  persianDigits?: boolean;
  calendarModal?: boolean;
}

export const DatePicker = ({
  autoUpdate = true,
  canType = true,
  calendarProps,
  onChange,
  defaultDate,
  date: controlledDate,
  inputClassName = "",
  label = "",
  labelStyles = {},
  fontFamily = "",
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

  const separator = "/";
  const dateFormat = "yyyy/MM/dd";
  const [date, setDate] = useState(controlledDate || defaultDate);
  const [isOpen, setIsOpen] = useState(false);
  const [calendarRef, setCalendarRef] = useState<any>(null);
  const [typingDate, setTypingDate] = useState(
    defaultDate
      ? convertDigits(format(defaultDate, dateFormat), {
          to: persianDigits ? "fa" : "en",
        })
      : ""
  );

  useClickOutside(() => setIsOpen(false), null, [calendarRef]);

  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => setIsMounted(true), []);
  useEffect(() => {
    if (!isMounted || !controlledDate) return;
    setDate(controlledDate);
    setTypingDate(
      convertDigits(format(controlledDate, dateFormat), {
        to: persianDigits ? "fa" : "en",
      })
    );
  }, [controlledDate, isMounted]);

  const updateDateHandler = (newDate: Date) => {
    if (!controlledDate) {
      setDate(newDate);
      setTypingDate(
        newDate
          ? convertDigits(format(newDate, dateFormat), {
              to: persianDigits ? "fa" : "en",
            })
          : ""
      );
    }
    onChange?.(newDate);
  };

  // Inline styles for smooth pop-up animation
  const popupStyle: React.CSSProperties = {
    opacity: isOpen ? 1 : 0,
    transform: isOpen ? "scale(1) translateY(0)" : "scale(0.98) translateY(-12px)",
    transition: "opacity 0.15s ease-in-out, transform 0.15s ease-in-out",
    position: strategy,
    zIndex: 999,
    marginTop: "6px",
    width: "100%",
    left: 0,
    right: 0,
    minWidth: "310px",
    pointerEvents: isOpen ? "auto" : "none",
  };

  const CalendarComponent = (
    <div ref={setCalendarRef} style={popupStyle}>
      {isOpen && (
        <Calendar
          activeDate={date}
          showFooter
          onConfirm={(newDate) => {
            updateDateHandler(newDate);
            setIsOpen(false);
          }}
          onCancel={() => {
            setIsOpen(false);
          }}
          {...calendarProps}
        />
      )}
    </div>
  );

  const CalendarModalComponent = (
    <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
      {isOpen && (
        <Calendar
          activeDate={date}
          showFooter
          onConfirm={(newDate) => {
            updateDateHandler(newDate);
            setIsOpen(false);
          }}
          onCancel={() => setIsOpen(false)}
          {...calendarProps}
        />
      )}
    </Modal>
  );

  function formatDateFromInput(input: string) {
    const separatorEscaped = separator.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const cleanDate = input.replace(new RegExp(`[^\\d${separatorEscaped}]`, "g"), "");
    if (!/^(\d{4}(\/\d{2}(\/\d{2})?)?)?$/.test(cleanDate)) return cleanDate.slice(0, dateFormat.length);

    const digits = cleanDate.replace(/\D/g, "");
    const formatParts = dateFormat.split(separator);
    let formatted = "";
    let index = 0;
    for (let i = 0; i < formatParts.length; i++) {
      const partLength = formatParts[i].length;
      if (digits.length > index) {
        const chunk = digits.substring(index, index + partLength);
        formatted += chunk;
        if (chunk.length === partLength && i < formatParts.length - 1) {
          formatted += separator;
        }
        index += chunk.length;
      }
    }
    return formatted;
  }

  const validateFormattedInput = (dateString: string) => {
    const invalidChars = dateString.split("").some((char) => char !== separator && !/\d/.test(char));
    if (invalidChars) return "";
    const parts = dateString.split(separator);
    const formatParts = dateFormat.split(separator);
    const normalizedParts = parts.map((part, index) => {
      const formatPart = formatParts[index];
      if (formatPart.length === 2 && part.length === 1) {
        return `0${part}`;
      }
      return part;
    });
    const normalizedDateString = normalizedParts.join(separator);
    const formatPattern = dateFormat.replace("yyyy", "\\d{4}").replace("MM", "\\d{2}").replace("dd", "\\d{2}");
    const regex = new RegExp(`^${formatPattern}$`);
    if (!regex.test(normalizedDateString)) return "";
    const [yearPart, monthPart, dayPart] = normalizedDateString.split(separator);
    const year = parseInt(yearPart, 10);
    const month = parseInt(monthPart, 10);
    const day = parseInt(dayPart, 10);
    if (yearPart.length === 4 && month >= 1 && month <= 12 && day >= 1 && day <= 31) return normalizedDateString;
    else return "";
  };

  function parseJalaliDate(dateString: string) {
    const date = parse(dateString, dateFormat, new Date());
    return isValid(date) ? date : null;
  }

  const submitTypingDate = (formatted: string) => {
    const result = validateFormattedInput(formatted);
    if (result) {
      const formatedDateObj = parseJalaliDate(result);
      if (formatedDateObj) {
        updateDateHandler(formatedDateObj);
        return true;
      }
      setTypingDate(result);
    }
    return false;
  };

  return (
    <div style={{ position: "relative", fontFamily: fontFamily }}>
      <style>{`
      .rssf-datepicker-input:focus-visible {
        outline: ${(calendarProps?.theme as any)?.headerBackgroundColor || "#119ef6"} auto 1px !important;
      }`}</style>
      <div style={{ direction: "ltr" }}>
        <input
          ref={reference}
          className={`p-2 rounded border border-gray-300 rssf-datepicker-input ${inputClassName}`}
          value={typingDate}
          readOnly={!canType}
          onBlur={() => {
            submitTypingDate(typingDate);
          }}
          onKeyDown={(event) => {
            if (canType && event.key === "Enter") {
              submitTypingDate(typingDate);
              setIsOpen(false);
            }
          }}
          onChange={(event) => {
            const isDeleting = event.target.value.length < typingDate.length;
            if (isDeleting) {
              setTypingDate(event.target.value);
              return;
            }
            const formatted = formatDateFromInput(event.target.value);
            setTypingDate(formatted);
            if (dateFormat.length === formatted.length) {
              submitTypingDate(formatted);
              setIsOpen(false);
            }
          }}
          onClick={(event) => {
            if (canType) return;
            setIsOpen(true);
            props.onClick?.(event);
          }}
          onFocus={(event) => {
            if (canType) {
              event.target.select();
            }
          }}
          {...props}
        />
      </div>
      <div
        style={{
          position: "absolute",
          backgroundColor: "#fff",
          color: "#777",
          padding: "0 0.25rem",
          transition: "all 0.1s",
          pointerEvents: "none",
          top: "-0.375rem",
          right: "0.375rem",
          fontSize: "0.75rem",
          opacity: 1,
          ...labelStyles,
        }}
      >
        {label}
      </div>
      {canType && (
        <div
          className="flex items-center absolute"
          style={{ top: "5px", left: "5px", bottom: "6px", cursor: "pointer" }}
          onClick={(event) => {
            setIsOpen(true);
            props.onClick?.(event as React.MouseEvent<HTMLInputElement>);
          }}
        >
          <IconCalendar
            style={{
              borderRadius: "2px",
              width: "26px",
              height: "26px",
              padding: "0.25rem",
              color: (calendarProps?.theme as any)?.headerBackgroundColor || "#119ef6",
            }}
          />
        </div>
      )}
      {calendarModal ? CalendarModalComponent : CalendarComponent}
    </div>
  );
};
