/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable react/prop-types */
import { FormControl, InputLabel, Select } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import selectStyle from "assets/jss/material-dashboard-pro-react/customSelectStyle";

export default function MockComponent({
  label,
  id,
  value,
  fullWidth = true,
  children,
  name,
  onChange,
  readOnly,
  style,
}) {
  //Load Style
  const selects = makeStyles(selectStyle);
  const classes = selects();

  return (
    <FormControl
      className={classes.selectFormControl}
      fullWidth={fullWidth}
      style={style}
    >
      <InputLabel className={classes.selectLabel} htmlFor={id} color="primary">
        {label}
      </InputLabel>
      <Select
        MenuProps={{
          className: classes.selectMenu,
        }}
        classes={{ select: classes.select }}
        value={value}
        inputProps={{
          name: name,
          id: id,
          readOnly: readOnly,
        }}
        onChange={onChange}
      >
        {children}
      </Select>
    </FormControl>
  );
}
