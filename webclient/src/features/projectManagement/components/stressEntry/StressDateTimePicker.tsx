import { DateTimePicker } from "@material-ui/pickers";
import React from "react";

export const StressDateTimePicker = ({ label, value, onChange }: any) => {
  return (
    <DateTimePicker
      label={label}
      inputVariant="outlined"
      format="YYYY-MM-DD HH:mm:ss"
      value={value}
      onChange={onChange}
    />
  );
};
