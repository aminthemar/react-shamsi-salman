import { DatePicker } from "../../../packages/react-shamsi-datepicker/dist/index";
import { useEffect, useMemo, useState } from "react";

const getTodayWithoutHours = () => {
  const today = new Date();
  today.setHours(0, 0, 0);
  return today;
};

const getNowWithoutHours = () => {
  const today = new Date();
  today.setHours(0, 0, 0);
  return today;
};

const NewHomework = () => {
  const [minDate, setMinDate] = useState<Date>();
  const minDatePlusOne = useMemo(() => {
    if (!minDate) return undefined;
    const minDateClone = new Date(minDate);
    minDateClone.setDate(minDate.getDate() + 1);
    return minDateClone;
  }, [minDate]);

  useEffect(() => {
    if (minDatePlusOne && maxDate && minDate && maxDate <= minDate) setMaxDate(minDatePlusOne);
  }, [minDate]);

  const [maxDate, setMaxDate] = useState<Date>();

  return (
    <div style={{ padding: "20px" }}>
      {/* <Calendar showFooter /> */}
      <DatePicker
        className="w-full lg:w-auto p-2 rounded-xl border border-gray-300"
        placeholder="تاریخ شروع"
        calendarProps={{
          minDate: getTodayWithoutHours(),
          presistTimeOnDateChange: true,
          theme: "darkRed",
          defaultActiveDate: minDate || getNowWithoutHours(),
        }}
        onChange={setMinDate}
        autoUpdate
        persianDigits
      />
      <h1 className="text-lg hidden lg:block">تا</h1>
      <DatePicker
        className="w-full lg:w-auto p-2 rounded-xl border border-gray-300"
        placeholder="تاریخ پایان"
        calendarProps={{
          minDate: minDatePlusOne || getTodayWithoutHours(),
          showTimePicker: false,
          presistTimeOnDateChange: true,
        }}
        date={maxDate}
        onChange={setMaxDate}
        autoUpdate
        persianDigits
      />
    </div>
  );
};

export default NewHomework;
