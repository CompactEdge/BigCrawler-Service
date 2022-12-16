import React from "react";
import {
  Grid,
  TextField,
} from "@mui/material";
import MDBox from "components/MDBox";

function DetailModalComp({ modalData }) {
  const getTextField = () => {
    return (
      Object.keys(modalData).map((dataKey, idx) => (
        <Grid item xs={12} key={`${dataKey}-${idx}`}>
          <TextField
            id="outlined-size-small"
            fullWidth
            variant="outlined"
            label={dataKey}
            value={modalData[dataKey] || ""}
            // sx={{ whiteSpace: "normal" }}
          />
        </Grid>
      ))
    );
  };

  return (
    <MDBox mt={2} mb={2}>
      <Grid container spacing={3}>
        {getTextField()}
      </Grid>
    </MDBox>
  );
}

export default DetailModalComp;