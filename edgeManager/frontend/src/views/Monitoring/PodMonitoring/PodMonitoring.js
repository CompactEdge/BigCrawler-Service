import React, { useEffect } from "react";
import MDBox from "components/MDBox";
import SelectingDate from "./components/SelectingDate/SelectingDate";
import axios from "axios";
import Progress from "views/Components/Progress/Progress";
import Charts from "./components/Charts/Charts";
import moment from "moment";

function PodMonitoring() {
  const [isLoading, setIsloading] = React.useState(false);
  const [tableNames, setTableNames] = React.useState([]);
  const [reqLoading, setReqLoading] = React.useState(false);
  const [reqComplete, setReqComplete] = React.useState([]);
  const [startDate, setStartDate] = React.useState(moment().utc().subtract(15, "minute").format("YYYY-MM-DDTHH:mm:ss.SSSZ"));
  const [endDate, setEndDate] = React.useState(moment().utc().format("YYYY-MM-DDTHH:mm:ss.SSSZ"));
  const [timeInterval, setTimeInterval] = React.useState("15s");
  const [nameSpace, setNameSpace] = React.useState();
  const [nameSpaceOption, setNameSpaceOption] = React.useState([]);

  const getParamData = async () => {
    // get tableNames
    await axios(`/rest/1.0/monitoring/meta_datas?meta_name=PodMonitoring`)
      .then((res) => {
        // console.log("tableNames: ", res.data.data.result);
        setTableNames(res.data.data.result);
      })
      .catch((err) => {
        console.log("err: ", err);
      });
    // get namespace
    await axios(`/rest/1.0/monitoring/variable_values?variable_type=PodMonitoring&variable_key=Namespace`)
      .then((res) => {
        // console.log("res: ", res.data.data);
        setNameSpaceOption(res.data.data.result);
        setNameSpace(res.data.data.result[0]);
      })
      .catch((err) => {
        console.log("err: ", err);
        setNameSpaceOption([]);
      });
  };

  useEffect(() => {
    // console.log("reqComplete: ", reqComplete);
    if (reqComplete.length === tableNames.length) {
      setReqLoading(false);
      setIsloading(false);
    };
  }, [reqComplete]);

  useEffect(() => {
    console.log("nameSpace: ", nameSpace);
  }, [nameSpace]);

  React.useEffect(() => {
    getParamData();
    // console.log("startDate: ", startDate);
    // console.log("endDate: ", endDate);
    // console.log("timeInterval: ", timeInterval);
    // console.log("nameSpace: ", nameSpace);
    setReqLoading(true);
    setIsloading(true);
  }, []);

  const reqData = async (name) => {
    let params = {
      start_time: startDate,
      end_time: endDate,
      step_time: timeInterval,
      expr_type: "PodMonitoring",
      expr_name: name,
      variable_key: "namespace",
      variable_values: nameSpace,
    };

    if (name ==="CPU Usage") {
      console.log("params.start_time:", params.start_time);
      console.log("params.end_time:", params.end_time);
    };

    let temp = null;
    const res = await axios(`/rest/1.0/monitoring/pod_monitoring`, { params: params });
    // console.log(name, "-result: ", res.data.data.result);
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
      // console.log(name, "-temp: ", temp);
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
            nameSpace={nameSpace}
            setNameSpace={setNameSpace}
            nameSpaceOption={nameSpaceOption}
            setReqComplete={setReqComplete}
            setIsloading={setIsloading}
            handleOnReloadBtn={handleOnReloadBtn}
          />
        </MDBox>
      </MDBox>
      <MDBox mt={8} />
      <MDBox>
        {nameSpace ?
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

export default PodMonitoring;
