import React from "react";
import { TextField, Grid, Button } from "@mui/material"; // Button
import {
  createTheme,
  ThemeProvider,
} from "@mui/material/styles";
import { makeStyles } from "@mui/styles";
import { cyan, blue } from "@mui/material/colors";
import oc from "open-color";
import styled from "styled-components";
import MDButton from "components/MDButton";

const FileSubmit = ({
  handleSubmit,
  jsonData,
  setJsonData,
}) => {

  const handleInputchange = (e) => {
    const name = e.target.name;
    if (name === "name") {
      setJsonData({ ...jsonData, ["modelName"]: e.target.value });
    } else if (name === "version") {
      setJsonData({ ...jsonData, ["modelVersion"]: e.target.value });
    }
  };

  return (
    <>
      <Grid
        container
        display="flex"
        alignItems="center"
        justifyContent="flex-end"
      >
        <Grid item>
          <MDButton
            variant="gradient"
            color="info"
            onClick={handleSubmit}
          >
            upload
          </MDButton>
        </Grid>
      </Grid>
    </>
  );
};

export default FileSubmit;
