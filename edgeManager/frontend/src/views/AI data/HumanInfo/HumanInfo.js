import React, { useState, useEffect } from "react";
import {
  Grid,
  TextField,
  Card,
} from "@mui/material";
import { Search } from '@mui/icons-material';
import MDButton from "components/MDButton";
import MDBox from "components/MDBox";
import CustomDataTable from "views/Components/DataTable/CustomDataTable";
import axios from "axios";
import * as config from "config";

let host = config.inferenceUrl;

// const dataFomat = {
//   "id" : null,
//   "human_id" : "",
//   "gender" : "",
//   "age" : "",
//   "daily_condition" : "",
//   "medical_history" : "",
// };

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
  { Header: "human_id", accessor: "human_id" },
  { Header: "gender", accessor: "gender" },
  { Header: "age", accessor: "age" },
  { Header: "daily_condition", accessor: "daily_condition" },
  { Header: "medical_history", accessor: "medical_history" },
];

function HumanInfo(props) {
  const [rowData, setRowData] = useState([]);
  const [humanId, setHumanId] = useState("");

  const reqData = () => {
    let url;
    if (humanId) {
      url = `${host}/rest/1.0/human/human_info?human_id=${humanId}`;
    } else {
      url = `${host}/rest/1.0/human/human_info`
    };

    axios(url)
    .then((res) => { 
      console.log("res.data: ", res.data);
      let dataTmp = [];
      if (res.data.length > 0) {
        res.data.map((data, idx) => {
          dataTmp.push({ ...data, id: idx});
        });
        setRowData(dataTmp);
        console.log("dataTmp: ", dataTmp);
      }
    })
    .catch((err) => {
      console.log("err: ", err);
    });
  };

  useEffect(() => {
    reqData();
  }, []);

  const handleSearchBtn = (e) => {
    reqData();
  };

  const handleSearchText = (e) => {
    setHumanId(e.target.value);
  };

  return (
    <>
      <MDBox mt={4}>
        <MDBox mb={3} >
          <Grid container display="flex" alignItems="center" justifyContent="flex-end" spacing={2}>
            <Grid item>
              <TextField id="outlined-basic" label="human_id" variant="outlined" onChange={handleSearchText} />
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

export default HumanInfo;