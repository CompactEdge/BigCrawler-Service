/* eslint-disable react/prop-types */
import {
  Checkbox,
  IconButton,
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
} from "@mui/material";
import Delete from "@mui/material/Icon";
import MDBox from "components/MDBox";
import React from "react";

export default function ListForm({
  val,
  index,
  handleToggle,
  AvatarStyle,
  load,
  deleteIcon,
  labelId,
  check,
  byte,
  deleteList,
}) {
  return (
    <MDBox mb={1}>
      <ListItem
        key={index}
        onClick={() => handleToggle(val)}
        style={{
          cursor: "pointer",
          userSelect: "none",
        }}
      >
        <ListItemIcon style={AvatarStyle}>
          <Checkbox
            checked={check.indexOf(val) !== -1}
            tabIndex={-1}
            disableRipple
            inputProps={{ "aria-labelledby": labelId }}
          />
        </ListItemIcon>
        <ListItemText primary={val.name} secondary={byte(val.size)} />
        <ListItemSecondaryAction>
          <IconButton
            edge="end"
            aria-label="delete"
            onClick={() => {
              if (!load) deleteList(val);
            }}
          >
            <Delete style={deleteIcon} />
          </IconButton>
        </ListItemSecondaryAction>
      </ListItem>
    </MDBox>
  );
}
