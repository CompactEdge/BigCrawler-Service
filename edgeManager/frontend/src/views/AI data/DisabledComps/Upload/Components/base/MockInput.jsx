/* eslint-disable react/prop-types */
import CustomInput from "components/CustomInput/CustomInput";
import PropTypes from "prop-types";
import React from "react";
export default function MockInput({
  label,
  id,
  value,
  disabled = false,
  onChange,
  error = false,
  required = false,
}) {
  //render component
  return (
    <CustomInput
      value={value}
      labelText={label}
      id={id}
      formControlProps={{ fullWidth: true }}
      inputProps={{
        disabled: disabled,
      }}
      error={error}
      onChange={onChange}
      required={required}
    />
  );
}

MockInput.prototype = {
  label: PropTypes.string,
  id: PropTypes.string,
  value: PropTypes.any,
  disabled: PropTypes.bool,
  onChange: PropTypes.func,
};
