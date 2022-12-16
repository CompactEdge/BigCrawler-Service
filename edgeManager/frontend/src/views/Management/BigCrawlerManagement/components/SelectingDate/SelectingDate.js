import React from "react";
import { Grid, Autocomplete } from "@mui/material";
import { Search } from "@mui/icons-material";
import MDButton from "components/MDButton";
import TextField from "@mui/material/TextField";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import moment from "moment";
import MDBox from "components/MDBox";

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

let check = false;

function SelectingDate({
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  timeInterval,
  setTimeInterval,
  selectedDeviceId,
  setSelectedDeviceId,
  listDeviceId,
  setIsloading,
  selectData,
  isAuto,
  setIsAuto,
  reqChartData,
  autoRanges,
  autoInterval,
  setAutoInterval,
}) {
  const checkInterval = (calcStartDateStr, calcEndDateStr, checkDate) => {
    const calcStartDate = new Date(calcStartDateStr).getTime();
    const calcEndDate = new Date(calcEndDateStr).getTime();
    return Math.abs(calcEndDate - calcStartDate) > checkDate;
  };

  React.useEffect(() => {
    check = false;
    selectData.map((option, idx) => {
      if (!getDisabledOption(option) && !check) {
        // console.log("!!!", idx);
        setTimeInterval(selectData[idx]);
        check = true;
      }
    });
  }, [startDate, endDate]);

  const getDisabledOption = (option) => {
    // console.log(option);
    if (checkInterval(startDate, endDate, 1000 * 60 * 60 * 24 * 7)) {
      return (
        option === selectData[0] ||
        option === selectData[1] ||
        option === selectData[2] ||
        option === selectData[3] ||
        option === selectData[4] ||
        option === selectData[5]
      );
    } else if (checkInterval(startDate, endDate, 1000 * 60 * 60 * 24 * 2)) {
      return (
        option === selectData[0] ||
        option === selectData[1] ||
        option === selectData[2] ||
        option === selectData[3] ||
        option === selectData[4]
      );
    } else if (checkInterval(startDate, endDate, 1000 * 60 * 60 * 24)) {
      return (
        option === selectData[0] ||
        option === selectData[1] ||
        option === selectData[2] ||
        option === selectData[3]
      );
    } else if (checkInterval(startDate, endDate, 1000 * 60 * 60 * 12)) {
      return (
        option === selectData[0] ||
        option === selectData[1] ||
        option === selectData[2]
      );
    } else if (checkInterval(startDate, endDate, 1000 * 60 * 60)) {
      return option === selectData[0] || option === selectData[1];
    } else if (checkInterval(startDate, endDate, 1000 * 60 * 30)) {
      return option === selectData[0];
    } else {
      return null;
    }
  };

  // React.useEffect(() => {
  //   console.log("node: ", node);
  // }, [node]);

  return (
    <MDBox display="flex">
      <MDBox>
        <Autocomplete
          disabled={isAuto}
          sx={{ width: "200px" }}
          size="medium"
          value={selectedDeviceId || null}
          disableClearable
          disablePortal
          options={listDeviceId || []}
          onInputChange={(e) => {
            if (e) {
              // console.log("e: ", e.target.innerText);
              setSelectedDeviceId(e.target.innerText);
            }
          }}
          renderInput={(params) => <TextField {...params} label="deviceId" />}
        />
      </MDBox>
      <MDBox width="100%">
        <Grid container display="flex" alignItems="center" justifyContent="flex-end" spacing={2}>
          <Grid item>
            <LocalizationProvider dateAdapter={AdapterMoment}>
              <DateTimePicker
                disabled={isAuto}
                inputFormat="yyyy-MM-DD HH:mm:ss"
                label={`startDate`}
                value={startDate}
                onChange={(e) => {
                  const a = moment(e);
                  a.isAfter(endDate)
                    ? alert("시작일은 종료일 이전으로 지정해주세요")
                    : setStartDate(a.format("YYYY-MM-DDTHH:mm:ss"));
                }}
                renderInput={(params) => <TextField {...params} />}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item>
            <LocalizationProvider dateAdapter={AdapterMoment}>
              <DateTimePicker
                disabled={isAuto}
                inputFormat="yyyy-MM-DD HH:mm:ss"
                label={`endDate`}
                value={endDate}
                onChange={(e) => {
                  const a = moment(e);
                  a.isBefore(startDate)
                    ? alert("종료일은 시작일 이후로 지정해주세요")
                    : setEndDate(a.format("YYYY-MM-DDTHH:mm:ss"));
                }}
                renderInput={(params) => <TextField {...params} />}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item>
            <Autocomplete
              disabled={isAuto}
              sx={{ width: "100px" }}
              size="medium"
              disableClearable
              disablePortal
              value={timeInterval || ""}
              options={selectData}
              getOptionDisabled={(option) => {
                let result = getDisabledOption(option);
                return result;
              }}
              onInputChange={(e) => {
                if (e) {
                  // console.log("e: ", e.target.innerText);
                  setTimeInterval(e.target.innerText);
                }
              }}
              renderInput={(params) => <TextField {...params} label="interval" />}
            />
          </Grid>
          <Grid item>
            <MDButton
              disabled={isAuto}
              variant="gradient"
              color="info"
              size="large"
              sx={{ height: "44.125px" }}
              onClick={() => {
                reqChartData();
              }}
            >
              <Search sx={{ color: "#fff" }} />
            </MDButton>
          </Grid>
        </Grid>
      </MDBox>
      <MDBox width="40%">
        <Grid container display="flex" alignItems="center" justifyContent="flex-end" spacing={2}>
          <Grid item>
            <Autocomplete
              disabled={isAuto}
              sx={{ width: "100px" }}
              size="medium"
              value={autoInterval || ""}
              disableClearable
              disablePortal
              options={autoRanges}
              onInputChange={(e) => {
                if (e) {
                  setAutoInterval(e.target.innerText);
                }
              }}
              renderInput={(params) => <TextField {...params} label="" />}
            />
          </Grid>
          <Grid item>
            <MDButton
              variant="gradient"
              color="info"
              size="large"
              sx={{ height: "44.125px" }}
              onClick={() => {
                if (isAuto) {
                  setIsAuto(false);
                } else {
                  setIsAuto(true);
                };
              }}
            >
              {isAuto ? `auto off` : `auto on`}
            </MDButton>
          </Grid>
        </Grid>
      </MDBox>
    </MDBox>
  );
}

export default SelectingDate;
