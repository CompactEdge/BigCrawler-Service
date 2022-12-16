import React, { useEffect } from "react";
import Progress from "views/Components/Progress/Progress";
import axios from "axios";
import MDBox from "components/MDBox";
import SelectingDate from "./components/SelectingDate/SelectingDate";
import Charts from "./components/Charts/Charts";
import moment from "moment";

function ClusterMonitoring() {
  const [isLoading, setIsloading] = React.useState(false);
  const [tableNames, setTableNames] = React.useState([]);
  const [reqLoading, setReqLoading] = React.useState(false);
  const [reqComplete, setReqComplete] = React.useState([]);

  const [cpuGauge, setCpuGauge] = React.useState({});
  const [memoryGauge, setMemoryGauge] = React.useState({});

  const [startDate, setStartDate] = React.useState(moment().utc().subtract(15, "minute").format("YYYY-MM-DDTHH:mm:ss.SSSZ"));
  const [endDate, setEndDate] = React.useState(moment().utc().format("YYYY-MM-DDTHH:mm:ss.SSSZ"));
  const [timeInterval, setTimeInterval] = React.useState("15s");
  const [nodeList, setNodeList] = React.useState([]);

  const [cpuNodes, setCpuNodes] = React.useState([]);
  const [memoryNodes, setMemoryNodes] = React.useState([]);

  const getParamData = async () => {
    // get tableNames
    await axios(`/rest/1.0/monitoring/meta_datas?meta_name=ClusterMonitoring`)
      .then((res) => {
        // console.log("tableNames: ", res.data.data.result);
        setTableNames(res.data.data.result);
      })
      .catch((err) => {
        console.log("err: ", err);
      });

    // get nodes
    await axios(`/rest/1.0/monitoring/variable_values?variable_type=ClusterMonitoring&variable_key=Instance`)
      .then((res) => {
        // console.log("nodes: ", res.data.data.result);
        let dataTmp = res.data.data.result;
        let nodes = dataTmp.join("|");
        setNodeList(nodes);
        setCpuNodes(dataTmp);
        setMemoryNodes(dataTmp);
        // console.log("nodes join: ", nodes);
      })
      .catch((err) => {
        console.log("err: ", err);
        setNodeList([]);
      });
  };

  useEffect(() => {
    // console.log("reqComplete: ", reqComplete);
    if (reqComplete.length === tableNames.length) {
      setReqLoading(false);
      setIsloading(false);
    };
  }, [reqComplete]);

  // useEffect(() => {
  //   console.log("nodeList: ", nodeList);
  // }, [nodeList]);

  useEffect(() => {
    getParamData();
    // console.log("startDate: ", startDate);
    // console.log("endDate: ", endDate);
    // console.log("timeInterval: ", timeInterval);
    // console.log("nodeList: ", nodeList);
    setReqLoading(true);
    setIsloading(true);
  }, []);

  const reqData = async (name) => {
    // console.log("name: ", name);
    // console.log("nodeList: ", nodeList);

    let params = {
      start_time: startDate,
      end_time: endDate,
      step_time: timeInterval,
      expr_type: "ClusterMonitoring",
      expr_name: name,
      variable_key: "instance",
      variable_values: nodeList,
    };

    // if (name ==="CPU Usage") {
    //   console.log("params.start_time:", params.start_time);
    //   console.log("params.end_time:", params.end_time);
    // };

    // gaugeChart - set startTime
    if (name === "CPU Usage" || name === "Memory Usage") {
      let startDateTmp = moment().utc().subtract(1, "minute").format("YYYY-MM-DDTHH:mm:ss.SSSZ");
      // console.log(`startDateTmp: " ${startDateTmp}, ${name}`);

      let gaugeParams = { ...params, start_time: startDateTmp };
      
      const res = await axios(`/rest/1.0/monitoring/cluster_monitoring`, { params: gaugeParams });
      console.log(`gaugeParams: ", ${gaugeParams.start_time}, ${name}`);
      if (res.data.data.result) {
        let itemsArry = [];
        let guageData = {};
        res.data.data.result.map((data) => {
          itemsArry.push(data.metric.legend);
          let dataTmp = data.values.slice(-1);
          dataTmp[0][1] = Number(dataTmp[0][1]);
          guageData = { ...guageData, [data.metric.legend]: dataTmp }
          if (name === "CPU Usage") {
            setCpuNodes(itemsArry);
            setCpuGauge(guageData);
          } else if (name === "Memory Usage") {
            setMemoryNodes(itemsArry);
            setMemoryGauge(guageData);
          };
        });
      } else {
        console.log("err: req fail")
      };
    };

    // lineChart
    let temp = null;
    const res = await axios(`/rest/1.0/monitoring/cluster_monitoring`, { params: params });
    // console.log(name, "-result: ", res.data.data.result);
    // console.log(`params: ", ${params.start_time}, ${name}`);
    if (res.data.data.result) {
      // echart
      let val = {};
      res.data.data.result.map((data) => {
        data.values.map(item => {
          item.push(data.metric.units);
        });
        val = { ...val, [data.metric.legend]: data.values };
      });
      temp = val;
    } else {
      console.log(name, "- 데아터 조회에 실패했습니다.");
    };
    return temp;
  };

  const handleOnReloadBtn = () => {
    setStartDate(moment().utc().subtract(15, "minute").format("YYYY-MM-DDTHH:mm:ss.SSSZ"));
    setEndDate(moment().utc().format("YYYY-MM-DDTHH:mm:ss.SSSZ"));
    setReqLoading(true);
    setReqComplete([]);
    setIsloading(true);
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
            timeInterval={timeInterval}
            setTimeInterval={setTimeInterval}
            setReqLoading={setReqLoading}
            setReqComplete={setReqComplete}
            setIsloading={setIsloading}
            handleOnReloadBtn={handleOnReloadBtn}
          />
        </MDBox>
      </MDBox>
      <MDBox mt={8} />
      <MDBox>
        {nodeList.length > 0 ?
          <Charts
            cpuGauge={cpuGauge}
            memoryGauge={memoryGauge}
            cpuNodes={cpuNodes}
            memoryNodes={memoryNodes}
            tableNames={tableNames}
            reqData={reqData}
            reqLoading={reqLoading}
            setReqComplete={setReqComplete}
            setReqLoading={setReqLoading}
          />
          : ""}
      </MDBox>
      <Progress isLoading={isLoading} />
    </>
  );
}

export default ClusterMonitoring;