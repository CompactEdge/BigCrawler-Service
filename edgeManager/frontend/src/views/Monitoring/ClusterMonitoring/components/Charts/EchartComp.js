import React, { useEffect, useState } from "react";
import EChartsReact from "echarts-for-react";

export default function EchartComp({
  item,
  reqData,
  reqLoading,
  setReqComplete,
  setReqLoading,
}) {

  const getChartSeries = (Data, type, isArea) => {
    const chartSeriesTmp = [];
    for (const key in Data) {
      chartSeriesTmp.push({
        name: key,
        data: Data[key],
        type: type,
        areaStyle: isArea ? {} : null,
        symbol: "none",
      });
    }
    return chartSeriesTmp;
  };

  const [EchartData, setEChartData] = useState({});

  const getData = async () => {
    let val = await reqData(item);
    if (val) {
      setEChartData(val);
      setReqComplete(prev => ([...prev, item]));
    };
  };

  useEffect(() => {
    if (reqLoading) {
      getData();
    };
  }, [reqLoading]);

  const getChartOption = () => {
    return {
      legend: {
        type: "scroll",

        orient: "vertical",
        right: 0,
        data: Object.keys(EchartData || {}),
      },
      tooltip: {
        confine: true,
        appendToBody: true,
        trigger: "axis",
        position: function (pt) {
          return pt;
        },
        formatter: function (params) {
          if (params.length > 0) {
            let data = params.map((param) => {
              return `
                <div class="outer-container">
                  <div class="box-dot">
                    <div class="dot" style="background-color: ${param.color}"></div>
                  </div>
                  <div class="data-name">${param.seriesName}:</div>
                  <div class="inner-container">
                    <div class="data-val">${param.data[1]}</div> 
                    <div class="data-unit">${param.data[2]}</div>
                  </div>
                </div>
              `});
            let result = `
                <div class="date">${params[0].data[0]}</div>
                ${data.join("")}
                `
            return result;
          }
        }
      },
      xAxis: {
        type: "time",
        axisLine: { onZero: true },
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
      series: getChartSeries(EchartData || {}, "line", true),
    };
  };
  return (
    <>
        <EChartsReact
          notMerge={true}
          style={{ height: "265.5px" }}
          option={getChartOption()}
        />
    </>
  );
}
