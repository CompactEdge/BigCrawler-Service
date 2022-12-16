import React, { useState } from "react";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "../../../Components/DashboardNavbar";
import MDBox from "components/MDBox";
import FilePreviewer from "./Components/FilePreviewer";

function Upload(props) {
  return (
    <>
      
      <MDBox mt={5}>
        <FilePreviewer/>
      </MDBox>
    </>
  );
}

export default Upload;