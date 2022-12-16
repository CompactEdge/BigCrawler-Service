import React, { useEffect, useMemo } from "react";
import Progress from "views/Components/Progress/Progress";
import MDBox from "components/MDBox";
import axios from "axios";
import SelectingDate from "./components/SelectingDate/SelectingDate";
import { Grid } from "@mui/material";
import CustomComplexProjectCard from "views/Components/CustomComplexProjectCard";
import EChartsReact from "echarts-for-react";
import moment from "moment";

const chartItems = [
  "온도",
  "주파수",
  "누적전력량",
  "유효전력평균",
  "무효전력평균",
  "전압고조파평균",
  "상전압평균",
  "선간전압평균",
  "역률평균",
  "전류고조파평균",
  "전류평균",
  "R상무효전력",
  "T상무효전력",
  "S상무효전력",
  "R상유효전력",
  "T상유효전력",
  "S상유효전력",
  "R상역률",
  "T상역률",
  "S상역률",
  "R상전류고조파",
  "T상전류고조파",
  "S상전류고조파",
  "R상선간전압",
  "T상선간전압",
  "S상선간전압",
  "R상전압고조파",
  "T상전압고조파",
  "S상전압고조파",
  "R상전류",
  "T상전류",
  "S상전류",
  "R상전압",
  "T상전압",
  "S상전압",
];

const timeRanges = ["15s", "30s", "1m", "5m", "10m", "1h", "1d"];
const autoRanges = ["15s", "30s", "1m", "5m", "10m"];

function BigCrawlerManagement(props) {
  const [isLoading, setIsloading] = React.useState(false);
  const [tableNames, setTableNames] = React.useState([]);

  const [startDate, setStartDate] = React.useState(moment().subtract(15, "minute").format("YYYY-MM-DDTHH:mm:ss"));
  const [endDate, setEndDate] = React.useState(moment().format("YYYY-MM-DDTHH:mm:ss"));
  
  const [timeInterval, setTimeInterval] = React.useState(timeRanges[0]);
  const [autoInterval, setAutoInterval] = React.useState(autoRanges[0]);

  const [chartData, setChartData] = React.useState({});
  const [listDeviceId, setListDeviceId] = React.useState([]);
  const [selectedDeviceId, setSelectedDeviceId] = React.useState("all");

  const [selectData, setSelectData] = React.useState([]);

  const [isAuto, setIsAuto] = React.useState(false);
  const [timerId, setTimerId] = React.useState();

  // state loge
  // useEffect(() => {
  //   console.log("startDate: ", startDate);
  // }, [startDate]);
  // useEffect(() => {
  //   console.log("endDate: ", endDate);
  // }, [endDate]);
  // useEffect(() => {
  //   console.log("node: ", timeInterval);
  // }, [timeInterval]);

  useEffect(() => {
    console.log("[selectedDeviceId]: ", selectedDeviceId);
  }, [selectedDeviceId]);
  useEffect(() => {
    console.log("[chartData]: ", chartData);
  }, [chartData]);

  const getChartSeries = (Data, type, isArea) => {
    const chartSeriesTmp = [];
    for (const key in Data) {
      chartSeriesTmp.push({
        name: key,
        data: Data[key].map((item) => {
          return [item[0], parseFloat(item[1]).toFixed(2)];
        }),
        type: type,
        areaStyle: isArea ? {} : null,
        symbol: "none",
        zlevel:1,
        z:1,
      });
    }
    return chartSeriesTmp;
  };

  const reqChartData = (str = null, end = null) => {
    // console.log("!! item_name:", chartItems.join());
    // console.log("!! device_id: ", selectedDeviceId);
    // console.log("!! startDate: ", startDate);
    // console.log("!! endDate: ", endDate);
    // console.log("!! timeInterval: ", timeInterval);
    setIsloading(true);
    if (str != null && end != null) {
      getChartData(chartItems.join(), str, end, timeInterval, selectedDeviceId);
    } else {
      getChartData(chartItems.join(), startDate, endDate, timeInterval, selectedDeviceId);
    };
  };

  const getChartData = (
    item_name,
    start_date,
    end_date,
    time_interval,
    selectedDeviceId
  ) => {

    console.log("! item_name:", item_name);
    console.log("! device_id:", selectedDeviceId);
    console.log("! start_date:", start_date);
    console.log("! end_date:", end_date);
    console.log("! time_interval:", time_interval);
    
    axios
      .post(`/rest/1.0/elasticsearch/edge_sensor/all`, {
        item_name: item_name,
        start_date: start_date,
        end_date: end_date,
        time_interval: time_interval,
        device_id: selectedDeviceId === "all" ? null : selectedDeviceId,
      })
      .then((res) => {
        // console.log("data: ", res.data);
        let resTmp = res.data;
        setChartData({ ...resTmp });
        setIsloading(false);
      })
      .catch((err) => {
        console.log(err);
        setIsloading(false);
      });
  };

  const getChartOption = (item) => {
    return {
      legend: {
        type: "scroll",
        orient: "vertical",
        right: 0,
        data: Object.keys(chartData[item] ? chartData[item] : {}),
      },
      tooltip: {
        appendToBody: true,
        trigger: "axis",
      },
      xAxis: {
        type: "time",
        axisLabel: {
          formatter: {
            year: "{yyyy}년",
            month: "{MM}월",
            day: "{dd}일",
            hour: "{HH}:{mm}",
            minute: "{HH}:{mm}",
            second: "{HH}:{mm}:{ss}",
            millisecond: "{hh}:{mm}:{ss} {SSS}",
            none: "{yyyy}-{MM}-{dd} {hh}:{mm}:{ss} {SSS}",
          },
        },
      },
      yAxis: {
        type: "value",
      },
      series: getChartSeries(
        chartData[item] ? chartData[item] : {},
        "line",
        true
      ),
    };
  };

  const getAutoInterval = () => {
    if (autoInterval === "15s") {
      return 15000;
    } else if (autoInterval === "30s") {
      return 30000;
    } else if (autoInterval === "1m") {
      return 60000;
    } else if (autoInterval === "5m") {
      return 300000;
    } else if (autoInterval === "10m") {
      return 600000;
    } else {
      return 15000;
    }
  };

  useEffect(() => {
    // get tableNames
    setTableNames(chartItems);
    // get device id
    let listDeviceIdTmp = ["all"];
    axios(`/rest/1.0/elasticsearch/edge_sensor/device_id`)
      .then((res) => {
        // console.log("[listDeviceId]: ", res.data);
        setListDeviceId(listDeviceIdTmp.concat(res.data));
        setSelectedDeviceId(listDeviceIdTmp[0]);
      })
      .catch((err) => {
        console.log("err: ", err);
      });
    setSelectData(timeRanges);
    reqChartData();
  }, []);

  useEffect(() => {
    console.log("isAuto: ", isAuto);
    if (isAuto) {
      let timerIdTmp = setInterval(scheduler, getAutoInterval());
      setTimerId(timerIdTmp);
    } else {
      clearInterval(timerId);
    }
  }, [isAuto]);

  const scheduler = () => {
    let str = moment().subtract(15, "minute").format("YYYY-MM-DDTHH:mm:ss");
    let end = moment().format("YYYY-MM-DDTHH:mm:ss");
    setStartDate(str);
    setEndDate(end);
    reqChartData(str, end);
  };

  function GetCharts() {
    return (
      <>
        <Grid container spacing={4} sx={{ mb: 4 }}>
          <Grid item xs={12}>
            <CustomComplexProjectCard title="총계" icon={"line"}>
              <EChartsReact
                notMerge={true}
                style={{ height: "265.5px" }}
                option={getChartOption("총계")}
              />
            </CustomComplexProjectCard>
          </Grid>
          {tableNames && tableNames.map((item, index) => {
            return (
              <Grid item key={`chart_${index}_${item}`} xs={12} sm={6}>
                <CustomComplexProjectCard title={item} icon={"line"}>
                  <EChartsReact
                    notMerge={true}
                    style={{ height: "265.5px" }}
                    option={getChartOption(item)}
                  />
                </CustomComplexProjectCard>
              </Grid>
            );
          })}
        </Grid>
      </>
    )
  };

  const charts = useMemo(() => GetCharts(), [chartData]);

  return (
    <>
      <MDBox mt={4}>
        <MDBox mb={3}>
          <SelectingDate
            startDate={startDate}
            setStartDate={setStartDate}
            endDate={endDate}
            setEndDate={setEndDate}
            timeInterval={timeInterval}
            setTimeInterval={setTimeInterval}
            selectedDeviceId={selectedDeviceId}
            setSelectedDeviceId={setSelectedDeviceId}
            listDeviceId={listDeviceId}
            setIsloading={setIsloading}
            selectData={selectData}
            isAuto={isAuto}
            setIsAuto={setIsAuto}
            reqChartData={reqChartData}
            autoRanges={autoRanges}
            autoInterval={autoInterval}
            setAutoInterval={setAutoInterval}
          />
        </MDBox>
      </MDBox>
      <MDBox mt={8} />
      <MDBox>
        {charts}
      </MDBox>
      <Progress isLoading={isLoading} />
    </>
  );
}

export default BigCrawlerManagement;