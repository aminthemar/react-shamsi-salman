import classNames from "classnames";
import { getYear } from "date-fns-jalali";
import { convertDigits } from "persian-helpers";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { TThemeClasses } from ".";

interface IYearsBodyProps {
  onChangeYear: (year: number) => void;
  activeDate: Date;
  selectedDate: Date;
  themeClasses: TThemeClasses;
}
const YearsBody = ({ onChangeYear, activeDate, themeClasses, selectedDate }: IYearsBodyProps) => {
  const currentYear = useMemo(() => getYear(new Date()), []);
  const years = [...[...new Array(100)].map((item, index) => currentYear - (100 - index)), ...[...new Array(100)].map((item, index) => currentYear + index)];
  const [domNode, setDomNode] = useState<HTMLButtonElement | null>(null);
  const currentYearRef = useCallback(setDomNode, []);
  const yearsParentRef = useRef<HTMLDivElement>(null);
  const otherYearsRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!domNode || !yearsParentRef.current) return;

    const container = yearsParentRef.current;
    const element = domNode;

    const offsetTop = element.offsetTop;
    const elementHeight = element.offsetHeight;
    const containerHeight = container.clientHeight;

    container.scrollTop = offsetTop - containerHeight / 2 + elementHeight / 2;
  }, [domNode]);

  return (
    <div className="grid grid-cols-3 gap-4 max-h-72 overflow-y-scroll custom-scroll" ref={yearsParentRef}>
      {years.map((year, index) => (
        <button
          ref={year === getYear(selectedDate) ? currentYearRef : otherYearsRef}
          onClick={() => onChangeYear(year)}
          key={year}
          style={{
            backgroundColor: year === getYear(selectedDate) ? themeClasses.daysSelectedBackgroundColor : themeClasses.daysBackgroundColor,
            color: year === getYear(selectedDate) ? themeClasses.daysSelectedColor : themeClasses.daysColor,
          }}
          className={classNames("px-6 py-4 rounded-full text-center")}
        >
          {convertDigits(year)}
        </button>
      ))}
    </div>
  );
};

export default YearsBody;
