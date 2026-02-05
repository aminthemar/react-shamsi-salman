import { defaultTimePickerTheme } from "@react-shamsi/timepicker";
import { useEffect, useMemo, useState } from "react";
import { DatePicker } from "../../../packages/react-shamsi-datepicker/dist/index";

const primaryColor = "#333";
const theme = {
  bodyBackgroundColor: "#fff",
  chevronLeftColor: "#6b7280",
  chevronRightColor: "#6b7280",
  topBarTextColor: "#6b7280",
  weekDaysBackgroundColor: "#f3f4f6",
  weekDaysTextColor: "#9ca3af",
  daysBackgroundColor: "transparent",
  daysSelectedBackgroundColor: primaryColor,
  todayBorderColor: primaryColor,
  daysSelectedColor: "#fff",
  daysColor: "#000",
  footerBackgroundColor: "#f1f5f9",
  footerButtonColor: primaryColor,
  headerBackgroundColor: primaryColor,
  headerTextColor: "#fff",
  offDaysColor: primaryColor,
  offDaysSelectedColor: "#fff",
  clock: defaultTimePickerTheme,
};

const NewHomework = () => {
  const [inputDate, setInputDate] = useState<Date>();
  const [minDate, setMinDate] = useState<Date>();
  const minDatePlusOne = useMemo(() => {
    if (!minDate) return undefined;
    const minDateClone = new Date(minDate);
    minDateClone.setDate(minDate.getDate() + 1);
    return minDateClone;
  }, [minDate]);

  useEffect(() => {
    if (minDatePlusOne && inputDate && minDate && inputDate <= minDate) setInputDate(minDatePlusOne);
  }, [minDate]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem", padding: "2rem", direction: "rtl", minHeight: "100vh" }}>
      {/* SMALL DATEPICKER */}
      <div style={{ width: "200px" }}>
        <DatePicker
          autoUpdate
          className="w-full p-2 border rounded border-gray-300"
          date={inputDate}
          onChange={setInputDate}
          placeholder="تاریخ کوچک"
          fontFamily="Vazirmatn FD"
          style={{ width: "100%", fontSize: "15px", paddingRight: "0.75rem", height: "36px", textAlign: "center" }}
          calendarProps={{
            minDate: minDate,
            showTimePicker: false,
            theme: theme,
          }}
        />
      </div>
      {/* SMALL DATEPICKER */}
      {/* LARGE DATEPICKER */}
      <div style={{ width: "360px" }}>
        <DatePicker
          autoUpdate
          className="w-full p-2 border rounded border-gray-300"
          date={inputDate}
          onChange={setInputDate}
          placeholder="تاریخ بزرگ"
          fontFamily="Vazirmatn FD"
          style={{ width: "100%", fontSize: "15px", paddingRight: "0.75rem", height: "36px", textAlign: "center" }}
          calendarProps={{
            minDate: minDate,
            showTimePicker: false,
            theme: theme,
          }}
        />
      </div>
      {/* LARGE DATEPICKER */}
      {/* TYPE DATEPICKER */}
      <div style={{ width: "360px" }}>
        <DatePicker
          autoUpdate
          canType
          className="w-full p-2 border rounded border-gray-300"
          date={inputDate}
          onChange={setInputDate}
          placeholder="تاریخ تایپی"
          fontFamily="Vazirmatn FD"
          style={{ width: "100%", fontSize: "15px", paddingRight: "0.75rem", height: "36px", textAlign: "center" }}
          calendarProps={{
            minDate: minDate,
            showTimePicker: false,
            theme: theme,
          }}
          calendarModal
        />
      </div>
      {/* TYPE DATEPICKER */}
      {/* MODAL DATEPICKER */}
      <div style={{ width: "360px" }}>
        <DatePicker
          autoUpdate
          className="w-full p-2 border rounded border-gray-300"
          date={inputDate}
          onChange={setInputDate}
          placeholder="تاریخ مودال"
          fontFamily="Vazirmatn FD"
          style={{ width: "100%", fontSize: "15px", paddingRight: "0.75rem", height: "36px", textAlign: "center" }}
          calendarProps={{
            minDate: minDate,
            showTimePicker: false,
            theme: theme,
          }}
          calendarModal
        />
      </div>
      {/* MODAL DATEPICKER */}
      {/* FULL WIDTH DATEPICKER */}
      <div style={{ width: "100%" }}>
        <DatePicker
          autoUpdate
          className="w-full p-2 border rounded border-gray-300"
          date={inputDate}
          onChange={setInputDate}
          placeholder="تاریخ تمام عرض"
          fontFamily="Vazirmatn FD"
          style={{ width: "100%", fontSize: "15px", paddingRight: "0.75rem", height: "36px", textAlign: "center" }}
          calendarProps={{
            minDate: minDate,
            showTimePicker: false,
            theme: theme,
          }}
        />
      </div>
      {/* FULL WIDTH DATEPICKER */}
    </div>
  );
};

export default NewHomework;
