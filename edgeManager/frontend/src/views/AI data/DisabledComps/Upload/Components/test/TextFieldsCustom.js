import React from "react";
import { TextField } from "@material-ui/core";

function TextFieldsCustom(props) {
  const [obj, key] = props;
  return (
    <TextField
      fullWidth
      id="outlined-size-small"
      defaultValue={obj[key] || "no data"}
      variant="outlined"
      size="small"
    />
  );
}

export default TextFieldsCustom;
