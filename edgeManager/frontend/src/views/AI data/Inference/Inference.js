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

const dataFomat = {
  "id" : null,
  "inference_id" : "",
  "edge_server_id" : "",
  "device_id" : "",
  "model_name" : "",
  "pose_estimation" : "",
  "result_image" : "",
};

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
  { Header: "inference_id", accessor: "inference_id" },
  { Header: "edge_server_id", accessor: "edge_server_id" },
  { Header: "device_id", accessor: "device_id" },
  { Header: "model_name", accessor: "model_name" },
  { Header: "pose_estimation", accessor: "pose_estimation" },
  { Header: "result_image", accessor: "result_image" },
];

function Inference(props) {
  const [rowData, setRowData] = useState([]);
  const [inferenceId, setInferenceId] = useState("");

  const reqData = () => {
    let url;
    if (inferenceId) {
      url = `${host}/rest/1.0/inference/search?inference_id=${inferenceId}`;
    } else {
      url = `${host}/rest/1.0/inference/search`
    };

    axios(url)
    .then((res) => { 
      console.log("res.data: ", res.data);
      let dataTmp = [];
      if (res.data.length > 0) {
        res.data.map((data, idx) => {
          dataTmp.push({ 
            ...dataFomat, 
            id: idx,
            inference_id: data.inference_id,
            edge_server_id: data.inference_image.edge_server_id,
            device_id: data.inference_image.device_id,
            model_name: data.inference_model.model_name,
            pose_estimation: data.alphapose_result.pose_estimation,
            result_image: data.inference_result.image_name,
          });
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
    setInferenceId(e.target.value);
  };

  return (
    <>
      <MDBox mt={4}>
        <MDBox mb={3} >
          <Grid container display="flex" alignItems="center" justifyContent="flex-end" spacing={2}>
            <Grid item>
              <TextField id="outlined-basic" label="inference_id" variant="outlined" onChange={handleSearchText} />
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

export default Inference;