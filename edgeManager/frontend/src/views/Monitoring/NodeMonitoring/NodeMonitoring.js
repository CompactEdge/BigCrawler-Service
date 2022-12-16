import React, { useEffect } from "react";
import Progress from "views/Components/Progress/Progress";
import MDBox from "components/MDBox";
import axios from "axios";
import SelectingDate from "./components/SelectingDate/SelectingDate";
import Charts from "./components/Charts/Charts";
import moment from "moment";

const timeRanges = ["15s", "30s", "1m", "5m", "10m", "1h", "1d"];

function NodeMonitoring(props) {
  const [isLoading, setIsloading] = React.useState(false);
  const [tableNames, setTableNames] = React.useState([]);
  const [reqLoading, setReqLoading] = React.useState(false);
  const [reqComplete, setReqComplete] = React.useState([]);
  const [startDate, setStartDate] = React.useState(moment().utc().subtract(15, "minute").format("YYYY-MM-DDTHH:mm:ss.SSSZ"));
  const [endDate, setEndDate] = React.useState(moment().utc().format("YYYY-MM-DDTHH:mm:ss.SSSZ"));
  const [timeInterval, setTimeInterval] = React.useState(timeRanges[0]);
  const [node, setNode] = React.useState();
  const [nodeList, setNodeList] = React.useState([]);
  const [selectData, setSelectData] = React.useState([]);

  const [coreGauge, setCoreGauge] = React.useState({});
  const [coreNodes, setCoreNodes] = React.useState([]);

  useEffect(() => {
    // console.log("reqComplete: ", reqComplete);
    if (reqComplete.length === tableNames.length) {
      setReqLoading(false);
      setIsloading(false);
    };
  }, [reqComplete]);

  useEffect(() => {
    console.log("node: ", node);
  }, [node]);
  useEffect(() => {
    console.log("timeInterval: ", timeInterval);
  }, [timeInterval]);

  // useEffect(() => {
  //   console.log("startDate: ", startDate);
  //   console.log("endDate: ", endDate);
  // }, [endDate]);

  React.useEffect(() => {
    // get tableNames
    axios(`/rest/1.0/monitoring/meta_datas?meta_name=NodeMonitoring`)
      .then((res) => {
        let result = res.data.data.result;
        console.log("tableNames: ", result);
        setTableNames(result);
      })
      .catch((err) => {
        console.log("err: ", err);
      });
    // get node
    axios(`/rest/1.0/monitoring/variable_values?variable_type=NodeMonitoring&variable_key=Instance`)
      .then((res) => {
        // console.log("res: ", res.data.data);
        setNodeList(res.data.data.result);
        setNode(res.data.data.result[0]);
      })
      .catch((err) => {
        console.log("err: ", err);
        setNodeList([]);
      });
    setSelectData(timeRanges);

    console.log("startDate: ", startDate);
    console.log("endDate: ", endDate);
    console.log("timeInterval: ", timeInterval);
    console.log("node: ", node);

    setReqLoading(true);
    setIsloading(true);
  }, []);

  const reqData = async (name) => {
    let params = {
      start_time: startDate,
      end_time: endDate,
      step_time: timeInterval,
      expr_type: "NodeMonitoring",
      expr_name: name,
      variable_key: "instance",
      variable_values: node,
    };
    // console.log("params: ", params);

    if (name ==="CPU Usage") {
      console.log("params.start_time:", params.start_time);
      console.log("params.end_time:", params.end_time);
    };

    let temp = null;
    const res = await axios(`/rest/1.0/monitoring/node_monitoring`, { params: params });
    // console.log(name, "-result: ", res.data.data.result);
    if (res.data.data.result) {
      // gaugeChart
      let itemsArry = [];
      let guageData = {};
      // echart
      let val = {};
      res.data.data.result.map((data) => {
        data.values.map(item => {
          item.push(data.metric.units);
        });
        val = { ...val, [data.metric.legend]: data.values };
        // set gaugeChart
        if (name === "Core Usage") {
          itemsArry.push(data.metric.legend);
          let dataTmp = data.values.slice(-1);
          // console.log("dataTmp: ", dataTmp);
          dataTmp[0][1] = Number(dataTmp[0][1]);
          guageData = { ...guageData, [data.metric.legend]: dataTmp }
          // console.log("coreNodes: ", itemsArry);
          setCoreNodes(itemsArry);
          setCoreGauge(guageData);
          // console.log("guageData: ", guageData);
        }
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
        <MDBox mb={3}>
          <SelectingDate
            setReqLoading={setReqLoading}
            startDate={startDate}
            setStartDate={setStartDate}
            endDate={endDate}
            setEndDate={setEndDate}
            timeInterval={timeInterval}
            setTimeInterval={setTimeInterval}
            node={node}
            setNode={setNode}
            nodeList={nodeList}
            setReqComplete={setReqComplete}
            setIsloading={setIsloading}
            selectData={selectData}
            handleOnReloadBtn={handleOnReloadBtn}
          />
        </MDBox>
      </MDBox>
      <MDBox mt={8} />
      <MDBox>
        {node ?
          <Charts
            coreGauge={coreGauge}
            coreNodes={coreNodes}
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

export default NodeMonitoring;