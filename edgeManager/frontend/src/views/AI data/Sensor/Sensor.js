import React, { useState, useEffect } from "react";
import {
  Grid,
  TextField,
  Card,
  Autocomplete,
} from "@mui/material";
import { Search, Refresh } from '@mui/icons-material';
import MDButton from "components/MDButton";
import MDBox from "components/MDBox";
import CustomDataTable from "views/Components/DataTable/CustomDataTable";
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import moment from 'moment';
import axios from "axios";
import * as config from "config";

let host = config.inferenceUrl;

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
  { Header: "device_id", accessor: "device_id" },
  { Header: "item_name", accessor: "item_name" },
  { Header: "item_value", accessor: "item_value" },
  { Header: "facility_name", accessor: "facility_name" },
  { Header: "measures_date", accessor: "measures_date" },
];

const limitLange = ["10", "50", "100"];

function Sensor(props) {
  const [rowData, setRowData] = useState([]);
  const [deviceId, setDeviceId] = useState("");
  const [startDate, setStartDate] = React.useState(moment().utc().subtract(10, "day").format("YYYY-MM-DDTHH:mm:ss.SSSZ"));
  const [endDate, setEndDate] = React.useState(moment().utc().format("YYYY-MM-DDTHH:mm:ss.SSSZ"));
  const [limit, setLimit] = React.useState("100");

  const reqData = () => {
    let startDateTmp = startDate.split(".")[0];
    let endDateTmp = endDate.split(".")[0];
    console.log("startDateTmp: ", startDateTmp);
    console.log("endDateTmp: ", endDateTmp);
    let url;
    if (deviceId) {
      url = `${host}/rest/1.0/sensor/sensor_info?device_id=${deviceId}&startDate=${startDateTmp}&endDate=${endDateTmp}&limit=${limit}`;
    } else {
      url = `${host}/rest/1.0/sensor/sensor_info?startDate=${startDateTmp}&endDate=${endDateTmp}&limit=${limit}`
    };

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

  useEffect(() => {
    console.log("startDate: ", startDate);
    console.log("endDate: ", endDate);
    reqData();
  }, []);

  useEffect(() => {
    console.log("limit : ", limit);
  }, [limit]);

  const handleSearchBtn = (e) => {
    reqData();
  };

  const handleSearchText = (e) => {
    setDeviceId(e.target.value);
  };

  return (
    <>
      <MDBox mt={4}>
        <MDBox mb={3} >
          <Grid container display="flex" alignItems="center" justifyContent="flex-end" spacing={2}>
            <Grid item>
              <TextField id="outlined-basic" label="device_id" variant="outlined" onChange={handleSearchText} />
            </Grid>
            <Grid item>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DateTimePicker
                  inputFormat="yyyy-MM-dd HH:mm:ss"
                  label={`startDate`}
                  value={new Date(startDate)}
                  onChange={(e) => {
                    const a = moment(e);
                    // console.log("a1 : ", a.utc().format("YYYY-MM-DDTHH:mm:ss"));
                    a.isAfter(endDate)
                      ? alert("시작일은 종료일 이전으로 지정해주세요")
                      : setStartDate(a.utc().format("YYYY-MM-DDTHH:mm:ss.SSSZ"));
                  }}
                  renderInput={(params) => <TextField {...params} />}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DateTimePicker
                  inputFormat="yyyy-MM-dd HH:mm:ss"
                  label={`endDate`}
                  value={new Date(endDate)}
                  onChange={(e) => {
                    const a = moment(e);
                    // console.log("a2 : ", a.utc().format("YYYY-MM-DDTHH:mm:ss"));
                    a.isBefore(startDate)
                      ? alert("종료일은 시작일 이후로 지정해주세요")
                      : setEndDate(a.utc().format("YYYY-MM-DDTHH:mm:ss.SSSZ"));
                  }}
                  renderInput={(params) => <TextField {...params} />}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item>
              <Autocomplete
                sx={{ width: "100px" }}
                size="medium"
                disableClearable
                disablePortal
                value={limit}
                options={limitLange}
                onInputChange={(e) => {
                  if (e) {
                    setLimit(e.target.innerText);
                  }
                }}
                renderInput={(params) => <TextField {...params} label="limit" />}
              />
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

export default Sensor;