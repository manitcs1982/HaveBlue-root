import React from "react";
import { DatePicker } from "@material-ui/pickers";

export const EditableCell = ({
  id,
  initialValue,
  type,
  onUpdate,
}: {
  id: string;
  initialValue: string | null;
  type: string;
  onUpdate: Function;
}) => {
  const [value, setValue] = React.useState(initialValue);

  const handleDateChange = (date: any) => {
    onUpdate(id, type, date, setValue);
  };

  React.useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  return (
    <DatePicker
      value={value}
      format="MM/DD/yyyy"
      label="Edit date"
      views={["year", "month", "date"]}
      onChange={(date) => handleDateChange(date)}
    />
  );
};
