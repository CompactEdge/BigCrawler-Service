import { MenuItem, makeStyles } from "@material-ui/core";
import React from "react";
import { MockSelect } from "../base";
import stylesSelect from "assets/jss/material-dashboard-pro-react/customSelectStyle";

const encodeType = [
  { index: 0, value: "utf-8", label: "utf-8" },
  { index: 1, value: "euc-kr", label: "euc-kr" },
  { index: 2, value: "cp949", label: "cp949" },
  { index: 3, value: "latin", label: "latin" },
];

// eslint-disable-next-line react/prop-types
export default function CsvEncoding({ csvEncode, setCsvEncode }) {
  const menuStyle = makeStyles(stylesSelect);
  const classes = menuStyle();

  //show selection
  const handleSelection = (event) => {
    setCsvEncode((prv) => ({
      ...prv,
      value: event.target.value,
      label: event.target.value,
    }));
  };
  return (
    <MockSelect
      fullWidth
      id="encoding-select"
      label="Encoding"
      value={csvEncode.value}
      name="encodingSelect"
      onChange={handleSelection}
    >
      {encodeType.map((encode, index) => {
        return (
          <MenuItem
            key={index}
            classes={{
              root: classes.selectMenuItem,
              selected: classes.selectMenuItemSelected,
            }}
            value={encode.value}
          >
            {encode.value}
          </MenuItem>
        );
      })}
    </MockSelect>
  );
}
