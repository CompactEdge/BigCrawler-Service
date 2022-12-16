import React from "react";
import {
  Grid,
  Button,
  Autocomplete,
  Box
} from "@mui/material";
import { Search } from '@mui/icons-material';
import Datetime from "react-datetime";
import "assets/css/react-datetime.css";
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import MDInput from "components/MDInput";

import FormField from "layouts/pages/account/components/FormField";
import selectData from "layouts/pages/account/settings/components/BasicInfo/data/selectData";


function CustomDateTime() {
  const [startDate, setStartDate] = React.useState(
    new Date(Date.parse(new Date()) - 1000 * 60 * 5).toISOString()
  );
  const [endDate, setEndDate] = React.useState(new Date().toISOString());
  const [timeInterval, setTimeInterval] = React.useState("10s");

  function TestBox(params) {
    // console.log(params);
    return (
      <Box
        width="100px"
        height="45px"
        border="0.7px solid #344767"
        borderRadius="0.375rem"
        display="flex"
        justifyContent="center"
        alignItems="center"
        fontFamily="Roboto"
        fontSize="1.25rem"
        fontWeight="400"
      >
        test
      </Box>
    );
  };

  const getDate = (dateData) => {
    try {
      // let tmp = "Wed, 03 Aug 2022 06:04:15 GMT";
      let date = new Date(dateData);
      let offset = date.getTimezoneOffset() * 60000;
      let dateOffset = new Date(date.getTime() - offset);
      let dateOffsetISO = dateOffset.toISOString();
      let result = dateOffsetISO.replace("T", " ").split(".")[0];
      return result;
    } catch (error) {
      console.log("error: ", error);
    };
  };
  

  function TestBox(params) {
    // console.log(params);
    return (
      <Box
        width="100px"
        height="45px"
        border="0.7px solid #344767"
        borderRadius="0.375rem"
        display="flex"
        justifyContent="center"
        alignItems="center"
        fontFamily="Roboto"
        fontSize="1.25rem"
        fontWeight="400"
      >
        test
      </Box>
    );
  };

  return (
    <>
      <MDBox mb={9} ></MDBox>
      <Grid container display="flex" alignItems="center" justifyContent="flex-end" spacing={2}>
        <Grid item>
          <Autocomplete
            disableClearable
            value={timeInterval}
            options={selectData.timeRanges}
            renderInput={(params) => (
              <FormField
                {...params}
                InputLabelProps={{ shrink: true }}
              />
            )}
          />
        </Grid>
        <Grid item>
          <Autocomplete
            disableClearable
            value="10s"
            options={selectData.timeRanges}
            size="medium"
            sx={{ width: "5rem" }}
            renderInput={(params) => <MDInput {...params} />}
          />
        </Grid>
        <Grid item>
          <TestBox></TestBox>
        </Grid>
        <Grid item>
          <TestBox></TestBox>
        </Grid>
        <Grid item>
          <MDButton variant="outlined" color="info" size="small" sx={{ width: "80px", height: "45px" }}>
            test
          </MDButton>
        </Grid>
        <Grid item>
          <MDButton variant="gradient" color="info" size="large" sx={{ height: "45px" }}>
            <Search sx={{ color: "#fff" }} />
          </MDButton>
        </Grid>
      </Grid>

      <MDBox mb={9} ></MDBox>
      <Grid container display="flex" alignItems="center" justifyContent="flex-end">
        <Grid item xs={12} sm={"auto"}>
          <Grid container justify="center" alignItems="center">
            <Grid item xs={"auto"}>
              <Datetime
                timeFormat={"HH:mm:ss"}
                inputProps={{
                  placeholder: "시작일",
                  readOnly: true,
                  style: { fontSize: "17px" },
                }}
                dateFormat={"YYYY-MM-DD"}
                value={new Date(startDate)}
                isValidDate={(current) => {
                  return current.isBefore(endDate);
                }}
                onChange={(e) => {
                  if (e.isAfter(endDate)) {
                    alert("시작일은 종료일 이전으로 지정해주세요");
                    return false;
                  } else {
                    setStartDate(e.toISOString());
                  }
                }}
              />
            </Grid>
            <Grid item xs={"auto"}>
              <div style={{ textAlign: "center", marginTop: "7px" }}>~</div>
            </Grid>

            <Grid item xs={"auto"}>
              <Datetime
                timeFormat={"HH:mm:ss"}
                inputProps={{
                  placeholder: "종료일",
                  readOnly: true,
                  style: { fontSize: "17px" },
                }}
                dateFormat={"YYYY-MM-DD"}
                value={new Date(endDate)}
                isValidDate={(current) => {
                  return current.isAfter(startDate);
                }}
                onChange={(e) => {
                  e.isBefore(startDate)
                    ? alert("종료일은 시작일 이전으로 지정해주세요")
                    : setEndDate(e.toISOString());
                }}
              />
            </Grid>
            <Grid item xs={"auto"}>
              <Autocomplete
                defaultValue="10s"
                options={selectData.timeRanges}
                renderInput={(params) => (
                  <FormField
                    {...params}
                    InputLabelProps={{ shrink: true }}
                  />
                )}
              />
            </Grid>
            <Grid item xs={"auto"}>
              <Button
                variant="contained"
                color="primary"
                size="large"
                onClick={() => {
                  // getChartData(startDate, endDate, timeInterval);
                }}
              >
                <Search sx={{ color: "#fff" }} />
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
}

export default CustomDateTime;