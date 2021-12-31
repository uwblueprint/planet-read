/* eslint-disable react/jsx-props-no-spreading */
import React from "react";
import DatePicker, { ReactDatePickerProps } from "react-datepicker";
import { Box } from "@chakra-ui/react";

const StyledDatePicker = (props: ReactDatePickerProps) => {
  return (
    <Box marginRight="10px">
      <DatePicker {...props} />
    </Box>
  );
};

export default StyledDatePicker;
