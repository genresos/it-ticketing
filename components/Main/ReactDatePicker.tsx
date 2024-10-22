import React, { HTMLAttributes, forwardRef } from "react";
import ReactDatePicker from "react-datepicker";
// import { useColorMode } from "@chakra-ui/react";
import { InputGroup, Input, InputRightElement } from "@chakra-ui/react";
import { CalendarIcon } from "@chakra-ui/icons";

const customDateInput = ({ value, onClick, onChange }: any, ref: any) => (
  <InputGroup>
    <Input
      autoComplete="off"
      value={value}
      ref={ref}
      onClick={onClick}
      onChange={onChange}
      w="300px"
    />
    <InputRightElement>
      <CalendarIcon color="gray.500" />
    </InputRightElement>
  </InputGroup>
);
customDateInput.displayName = "DateInput";

const CustomInput = forwardRef(customDateInput);

const icon = <CalendarIcon fontSize="sm" />;

interface Props {
  isClearable?: boolean;
  onChange: (
    date: Date | null,
    event?: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>
  ) => void;
  selectedDate: Date | undefined;
  showPopperArrow?: boolean;
}

const ReactDatePickerComponent = ({
  selectedDate,
  onChange,
  isClearable = false,
  showPopperArrow = false,
  ...props
}: Props & HTMLAttributes<HTMLElement>) => {
  // const isLight = useColorMode().colorMode === "light";
  return (
    <>
      <InputGroup>
        <ReactDatePicker
          selected={selectedDate}
          onChange={onChange}
          isClearable={isClearable}
          showPopperArrow={showPopperArrow}
          className="react-datepicker__input-text"
          dateFormat="MM/dd/yyyy"
          customInput={<CustomInput />}
        />
        <InputRightElement color="gray.500">{icon}</InputRightElement>
      </InputGroup>
    </>
  );
};

const DatePicker2 = ({ selectedDate, onChange, ...props }: Props) => {
  return (
    <>
      <div className="dark-theme">
        <ReactDatePicker
          selected={selectedDate}
          onChange={onChange}
          customInput={<CustomInput />}
          dateFormat="dd/MM/yyyy"
          {...props}
        />
      </div>
    </>
  );
};

// set className to "light-theme-original"
{
  /* <div className={isLight ? "light-theme" : "dark-theme"}>
<ReactDatePicker
  selected={selectedDate}
  onChange={onChange}
  isClearable={isClearable}
  showPopperArrow={showPopperArrow}
  className="react-datepicker__input-text"
  dateFormat="MM/dd/yyyy"
  customInput={<CustomInput />}
/>
</div> */
}

export default DatePicker2;
