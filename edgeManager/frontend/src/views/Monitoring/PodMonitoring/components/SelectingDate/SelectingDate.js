import React from "react";
import { Grid, Autocomplete } from "@mui/material";
import { Search, Refresh } from "@mui/icons-material";
import MDButton from "components/MDButton";
import TextField from "@mui/material/TextField";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import moment from "moment";
import MDBox from "components/MDBox";

const selectData = {
  timeRanges: ["15s", "30s", "1m", "5m", "10m", "1h", "1d"],
};

let check = false;

function SelectingDate({
  setReqLoading,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  timeInterval,
  setTimeInterval,
  nameSpace,
  setNameSpace,
  nameSpaceOption,
  setReqComplete,
  setIsloading,
  handleOnReloadBtn,
}) {
  const checkInterval = (calcStartDateStr, calcEndDateStr, checkDate) => {
    const calcStartDate = new Date(calcStartDateStr).getTime();
    const calcEndDate = new Date(calcEndDateStr).getTime();
    return Math.abs(calcEndDate - calcStartDate) > checkDate;
  };

  React.useEffect(() => {
    check = false;
    selectData.timeRanges.map((option, idx) => {
      if (!getDisabledOption(option) && !check) {
        // console.log("!!!", idx);
        setTimeInterval(selectData.timeRanges[idx]);
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

  return (
    <MDBox display="flex">
      <MDBox>
        <Autocomplete
          sx={{ width: "200px" }}
          size="medium"
          disableClearable
          disablePortal
          value={nameSpace || ""}
          options={nameSpaceOption || []}
          onInputChange={(e) => {
            if (e) {
              // console.log("e: ", e.target.innerText);
              setNameSpace(e.target.innerText);
            }
          }}
          renderInput={(params) => <TextField {...params} label="namespace" />}
        />
      </MDBox>
      <MDBox width="100%">
        <Grid container display="flex" alignItems="center" justifyContent="flex-end" spacing={2}>
          <Grid item>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DateTimePicker
                inputFormat="yyyy-MM-dd HH:mm:ss"
                label={`startDate`}
                value={new Date(startDate)}
                onChange={(e) => {
                  const a = moment(e);
                  console.log("a1 : ", a.utc().format("YYYY-MM-DDTHH:mm:ss.SSSZ"));
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
                  console.log("a2 : ", a.utc().format("YYYY-MM-DDTHH:mm:ss.SSSZ"));
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
              value={timeInterval}
              options={selectData.timeRanges}
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
              variant="gradient"
              color="info"
              size="large"
              sx={{ height: "44.125px" }}
              onClick={() => {
                setReqLoading(true);
                setReqComplete([]);
                setIsloading(true);
              }}
            >
              <Search sx={{ color: "#fff" }} />
            </MDButton>
          </Grid>
          <Grid item>
            <MDButton
              variant="gradient"
              color="info"
              size="large"
              sx={{ height: "44.125px" }}
              onClick={handleOnReloadBtn}
            >
              <Refresh sx={{ color: "#fff" }} />
            </MDButton>
          </Grid>
        </Grid>
      </MDBox>
    </MDBox>
  );
}

export default SelectingDate;
