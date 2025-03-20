import React from "react";
import {  Input } from "@sparrowengg/twigs-react";

export const CustomInput = ({ value, customWidth="$inputWidth", type = "text", onChangeHandler,placeholder, disabled }) => {
  return (
    <Input
      disabled={disabled}
      value={value}
      size="lg"
      type={type}
      placeholder={placeholder}
      onChange={onChangeHandler}
    />
  );
};