import React, { useState, useEffect } from "react";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "../../../Components/DashboardNavbar";
import MDBox from "components/MDBox";
import DefaultLineChart from "./components/Chart/DefaultLineChart";
import SelectingDate from "./components/SelectingDate/SelectingDate";
import Progress from "views/Components/Progress/Progress";
import axios from "axios";
import * as config from "config";

let host = config.inferenceUrl;

// chartData sample!!
// const defaultLineChartData = {
//   labels: ["Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
//   datasets: [
//     {
//       label: "Facebook Ads",
//       color: "info",
//       data: [50, 100, 200, 190, 400, 350, 500, 450, 700],
//     },
//     {
//       label: "Google Ads",
//       color: "dark",
//       data: [10, 30, 40, 120, 150, 220, 280, 250, 280],
//     },
//   ],
// };

const selectData = {
  timeRanges: ["minute", "hour", "day", "month"],
};

const getDate = (dateData) => {
  try {
    // let tmp = "Wed, 03 Aug 2022 06:04:15 GMT";
    let date = new Date(dateData);
    let offset = date.getTimezoneOffset() * 60000;
    let dateOffset = new Date(date.getTime() - offset);
    let dateOffsetISO = dateOffset.toISOString();
    let dateTmp = dateOffsetISO.split("T")[0];
    let parseTime = dateOffsetISO.split("T")[1];
    let timeArry = parseTime.split(":");
    let timeTmp = `${timeArry[0]}:${timeArry[1]}`;
    let result = `${dateTmp} ${timeTmp}`;

    return result;
  } catch (error) {
    console.log("error: ", error);
  };
};

const today = new Date();
const setStart = new Date(2022, 7, 1);

function Chart(props) {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [],
  });
  const [chartOn, setChartOn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [startDate, setStartDate] = React.useState(getDate(
    setStart.setDate(1))
  );
  const [endDate, setEndDate] = React.useState(getDate(today));
  const [aggregationCycle, setAggregationCycle] = React.useState(selectData.timeRanges[1]);

  // React.useEffect(() => {
  //   console.log("today: ", today);
  //   console.log("setStart: ", setStart);
  // }, []);
  React.useEffect(() => {
    console.log("startDate: ", startDate);
    console.log("endDate: ", endDate);
  }, [startDate, endDate]);
  React.useEffect(() => {
    console.log("aggregationCycle: ", aggregationCycle);
  }, [aggregationCycle]);

  // useEffect(() => {
  //   console.log("chartData: ", chartData);
  // }, [chartData]);

  useEffect(() => {
    getChartData();
  }, []);

  const getChartData = () => {
    const params = `?startDate=${startDate}&endDate=${endDate}&interval=${aggregationCycle}`;
    axios
      .get(`${host}/rest/1.0/inference/data_count${params}`, {
        startDate: startDate,
        endDate: endDate,
        aggregationCycle: aggregationCycle,
      })
      .then((res) => {
        // console.log("res ", res);
        if (res.data === "No results.") {
          alert("데이터가 없습니다.");
        } else {
          setIsLoading(false);
          setChartOn(true);
          // console.log("res.data: ", res.data);
          let labelArry = [];
          let dataArry = [];
          let dataSets = {};
          res.data.map((data) => {
            labelArry.push(data.uploadDate);
            dataArry.push(data.count);
          });
          // console.log("labelArry: ", labelArry);
          // console.log("dataArry: ", dataArry);

          dataSets = [
            {
              label: "Chart data",
              color: "info",
              data: dataArry,
            }
          ]
          setChartData({ ...chartData, labels: labelArry, datasets: dataSets });
        }
      })
      .catch((err) => {
        console.log("err: ", err);
      });
  };
  return (
    <>
      
      <MDBox mt={4}>
        <MDBox mb={3} >
          <SelectingDate
            startDate={startDate}
            setStartDate={setStartDate}
            endDate={endDate}
            setEndDate={setEndDate}
            getDate={getDate}
            aggregationCycle={aggregationCycle}
            setAggregationCycle={setAggregationCycle}
            selectData={selectData}
            getChartData={getChartData}
          />
        </MDBox>
      </MDBox>
      <MDBox mt={8}>
        <DefaultLineChart
          title="Data count"
          chart={chartData}
        />

        {/* <DefaultLineChart
          title="Revenue"
          description={
            <MDBox display="flex" justifyContent="space-between">
              <MDBox display="flex" ml={-1}>
                <MDBadgeDot color="info" size="sm" badgeContent="Facebook Ads" />
                <MDBadgeDot color="dark" size="sm" badgeContent="Google Ads" />
              </MDBox>
              <MDBox mt={-4} mr={-1} position="absolute" right="1.5rem">
                <Tooltip title="See which ads perform better" placement="left" arrow>
                  <MDButton
                    variant="outlined"
                    color="secondary"
                    size="small"
                    circular
                    iconOnly
                  >
                    <Icon>priority_high</Icon>
                  </MDButton>
                </Tooltip>
              </MDBox>
            </MDBox>
          }
          chart={defaultLineChartData}
        /> */}
      </MDBox>
      <Progress isLoading={isLoading} />
    </>
  );
}

export default Chart;