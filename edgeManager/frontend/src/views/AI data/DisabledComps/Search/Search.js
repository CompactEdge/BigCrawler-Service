import React, { useState, useEffect } from "react";
import {
  Grid,
  TextField,
} from "@mui/material";
import { Search } from '@mui/icons-material';
import { Card } from "@mui/material";
import MDButton from "components/MDButton";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "../../../Components/DashboardNavbar";
import MDBox from "components/MDBox";
import axios from "axios";
import CustomDataTable from "views/Components/DataTable/CustomDataTable";
import * as config from "config";

let host = config.inferenceUrl;

function SearchMain(props) {
  const [fileData, setFileData] = useState([]);
  const [rowData, setRowData] = useState([]);
  const [fileName, setFileName] = useState("");

  const columnData = [
    // {
    //   Header: "", accessor: "id",
    //   Cell: ({ value }) => {
    //     return (
    //       <CustomIdCell
    //         id={value}
    //         selectedValue={selectedValue}
    //         setSelectedValue={setSelectedValue}
    //       />
    //     )
    //   },
    //   width: "5%"
    // },
    { Header: "author", accessor: "author" },
    { Header: "fileId", accessor: "fileId" },
    { Header: "fileName", accessor: "fileName" },
    { Header: "length", accessor: "length" },
    { Header: "modelName", accessor: "modelName" },
    { Header: "modelTags", accessor: "modelTags" },
    { Header: "modelVersion", accessor: "modelVersion" },
    { Header: "uploadDate", accessor: "uploadDate" },
  ];

  useEffect(() => {
    // const addr = process.env.NODE_ENV === "production" ? "localhost:38090/rest/1.0/inference/search" : "http://10.7.17.11:7000/rest/1.0/inference/search"
    // const addr = process.env.NODE_ENV === "production" ? "localhost:7000/rest/1.0/inference/search" : "http://10.7.17.11:7000/rest/1.0/inference/search"
    axios(`${host}/rest/1.0/inference/search`)
      .then((res) => { 
        console.log("res.data: ", res.data);
        let dataTmp = [];
        if (res.data.length > 0) {
          res.data.map((data, idx) => {
            dataTmp.push({ ...data, id: idx });
          });
          setRowData(dataTmp);
          console.log("dataTmp: ", dataTmp);
        }
      })
      .catch((err) => {
        console.log("err: ", err);
      });
  }, []);

  const handleSearchBtn = (e) => {
    let url;
    if (fileName) {
      url = `${host}/rest/1.0/inference/search?fileName=${fileName}`;
    } else {
      url = `${host}/rest/1.0/inference/search`
    }
    axios(url)
      .then((res) => {
        console.log("res.data: ", res.data);
        let dataTmp = [];
        if (res.data.length > 0) {
          res.data.map((data, idx) => {
            dataTmp.push({ ...data, id: idx });
          });
          setRowData(dataTmp);
          console.log("dataTmp: ", dataTmp);
        }
      })
      .catch((err) => {
        console.log("err: ", err);
      });
  };

  const handleFileNameVal = (e) => {
    setFileName(e.target.value);
  };

  return (
    <>
      
      <MDBox mt={4}>
        <MDBox mb={3} >
          <Grid container display="flex" alignItems="center" justifyContent="flex-end" spacing={2}>
            <Grid item>
              <TextField id="outlined-basic" label="fileName" variant="outlined" onChange={handleFileNameVal} />
            </Grid>
            <Grid item>
              <MDButton
                variant="gradient"
                color="info"
                size="large"
                onClick={handleSearchBtn}
              >
                <Search sx={{ color: "#fff" }} />
              </MDButton>
            </Grid>
          </Grid>
        </MDBox>
      </MDBox>
      <MDBox mt={5}>
        <Card>
          <MDBox p={3}>
            <CustomDataTable table={{ columns: columnData, rows: rowData }} />
          </MDBox>
        </Card>
      </MDBox>
    </>
  );
}

export default SearchMain;