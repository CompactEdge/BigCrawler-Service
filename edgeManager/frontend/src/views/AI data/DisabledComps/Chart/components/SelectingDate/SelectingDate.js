import React, { useEffect } from "react";
import {
  Grid,
  Autocomplete,
} from "@mui/material";
import { Search } from '@mui/icons-material';
import MDButton from "components/MDButton";
import TextField from '@mui/material/TextField';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import moment from 'moment';

// import CustomDateTime from "./components/CustomDateTime/CustomDateTime";

// const getDate = (dateData) => {
//   try {
//     // let tmp = "Wed, 03 Aug 2022 06:04:15 GMT";
//     let date = new Date(dateData);
//     let offset = date.getTimezoneOffset() * 60000;
//     let dateOffset = new Date(date.getTime() - offset);
//     let dateOffsetISO = dateOffset.toISOString();
//     let result = dateOffsetISO.replace("T", " ").split(".")[0];
//     return result;
//   } catch (error) {
//     console.log("error: ", error);
//   };
// };

function SelectingDate({
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  getDate,
  aggregationCycle,
  setAggregationCycle,
  selectData,
  getChartData,
}) {

  return (
    <>
      <Grid container display="flex" alignItems="center" justifyContent="flex-end" spacing={2}>
        <Grid item>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DateTimePicker
              inputFormat="yyyy-MM-dd HH:mm"
              label={`Date&Time picker`}
              value={startDate}
              onChange={(e) => {
                const a = moment(e);
                a.isAfter(endDate)
                  ? alert("시작일은 종료일 이전으로 지정해주세요")
                  : setStartDate(getDate(e));
              }}
              renderInput={(params) => <TextField {...params} />}
            />
          </LocalizationProvider>
        </Grid>
        <Grid item>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DateTimePicker
              inputFormat="yyyy-MM-dd HH:mm"
              label={`Date&Time picker`}
              value={new Date(endDate)}
              onChange={(e) => {
                const a = moment(e);
                console.log("a : ", a);
                a.isBefore(startDate)
                  ? alert("종료일은 시작일 이후로 지정해주세요")
                  : setEndDate(getDate(e));
              }}
              renderInput={(params) => <TextField {...params} />}
            />
          </LocalizationProvider>
        </Grid>
        <Grid item>
          <Autocomplete
            sx={{ width: "165px" }}
            size="medium"
            disableClearable
            disablePortal
            value={aggregationCycle}
            options={selectData.timeRanges}
            onInputChange={(e) => {
              if (e) {
                // console.log("e: ", e.target.innerText);
                setAggregationCycle(e.target.innerText);
              }
            }}
            renderInput={(params) => <TextField {...params} label="aggregationCycle" />}
          />
        </Grid>
        <Grid item>
          <MDButton
            variant="gradient"
            color="info"
            size="large"
            sx={{ height: "44.125px" }}
            onClick={() => {
              if (aggregationCycle) {
                getChartData();
              } else {
                alert("aggregationCycle을 선택하세요.");
              }
            }}
          >
            <Search sx={{ color: "#fff" }} />
          </MDButton>
        </Grid>
      </Grid>
      <Grid container>
      </Grid>
    </>
  );
}

export default SelectingDate;