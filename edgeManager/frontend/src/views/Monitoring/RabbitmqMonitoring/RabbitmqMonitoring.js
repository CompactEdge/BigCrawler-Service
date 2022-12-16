import React, { useEffect } from "react";
import Progress from "views/Components/Progress/Progress";
import MDBox from "components/MDBox";
import axios from "axios";
import SelectingDate from "./components/SelectingDate/SelectingDate";
import Charts from "./components/Charts/Charts";
import moment from "moment";

const timeRanges = ["15s", "30s", "1m", "5m", "10m", "1h", "1d"];

function RabbitmqMonitoring(props) {
  const [isLoading, setIsloading] = React.useState(false);
  const [tableNames, setTableNames] = React.useState([]);
  const [reqLoading, setReqLoading] = React.useState(false);
  const [reqComplete, setReqComplete] = React.useState([]);
  const [startDate, setStartDate] = React.useState(moment().utc().subtract(15, "minute").format("YYYY-MM-DDTHH:mm:ss.SSSZ"));
  const [endDate, setEndDate] = React.useState(moment().utc().format("YYYY-MM-DDTHH:mm:ss.SSSZ"));
  const [timeInterval, setTimeInterval] = React.useState(timeRanges[0]);
  const [namespace, setNamespace] = React.useState();
  const [namespaceList, setNamespaceList] = React.useState([]);
  const [selectData, setSelectData] = React.useState([]);

  useEffect(() => {
    // console.log("reqComplete: ", reqComplete);
    if (reqComplete.length === tableNames.length) {
      setReqLoading(false);
      setIsloading(false);
    };
  }, [reqComplete]);

  useEffect(() => {
    console.log("namespace: ", namespace);
  }, [namespace]);
  useEffect(() => {
    console.log("timeInterval: ", timeInterval);
  }, [timeInterval]);

  // useEffect(() => {
  //   console.log("startDate: ", startDate);
  //   console.log("endDate: ", endDate);
  // }, [endDate]);

  React.useEffect(() => {
    // get tableNames
    axios(`/rest/1.0/monitoring/meta_datas?meta_name=RabbitmqMonitoring`)
      .then((res) => {
        let tableNames = res.data.data.result;
        // console.log("tableNames: ", tableNames);
        setTableNames(tableNames);
      })
      .catch((err) => {
        console.log("err: ", err);
      });
    // get node
    axios(`/rest/1.0/monitoring/variable_values?variable_type=RabbitmqMonitoring&variable_key=Namespace`)
      .then((res) => {
        // console.log("res: ", res.data.data);
        setNamespaceList(res.data.data.result);
        setNamespace(res.data.data.result[0]);
      })
      .catch((err) => {
        console.log("err: ", err);
        setNamespaceList([]);
      });
    setSelectData(timeRanges);

    // console.log("startDate: ", startDate);
    // console.log("endDate: ", endDate);
    // console.log("timeInterval: ", timeInterval);
    // console.log("node: ", node);

    setReqLoading(true);
    setIsloading(true);
  }, []);

  const reqData = async (name) => {
    let params = {
      start_time: startDate,
      end_time: endDate,
      step_time: timeInterval,
      expr_type: "RabbitmqMonitoring",
      expr_name: name,
      variable_key: "namespace",
      variable_values: namespace,
    };
    // console.log("params: ", params);

    let temp = null;
    const res = await axios(`/rest/1.0/monitoring/rabbitmq_monitoring`, { params: params });
    if (res.data.data.result) {
      console.log("!!! ", name, "-result: ", res.data.data.result[0]);
      if (name === "Publishers" || name === "Consumers" || name === "Channels" || name === "Nodes") {
        // console.log("!!! ", name, "-result: ", res.data.data.result[0].values.slice(-1)[0][1]);
        let val = res.data.data.result[0].values.slice(-1)[0][1];
        temp = Number(val);
      } else {
        // echart
        let val = {};
        res.data.data.result.map((data) => {
          data.values.map(item => {
            item.push(data.metric.units);
          });
          val = { ...val, [data.metric.legend]: data.values };
          // set gaugeChart
        });
        temp = val;
      };
    } else {
      console.log("err:", name, "- 데아터 조회에 실패했습니다.");
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
            namespace={namespace}
            setNamespace={setNamespace}
            namespaceList={namespaceList}
            setReqComplete={setReqComplete}
            setIsloading={setIsloading}
            selectData={selectData}
            handleOnReloadBtn={handleOnReloadBtn}
          />
        </MDBox>
      </MDBox>
      <MDBox mt={8} />
      <MDBox>
        {namespace ?
          <Charts
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

export default RabbitmqMonitoring;