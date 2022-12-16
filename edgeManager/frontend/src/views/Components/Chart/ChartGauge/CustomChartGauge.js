import React from "react";
import ReactEcharts from "echarts-for-react";

const CustomChartGauge = (props) => {
  // eslint-disable-next-line react/prop-types
  const { name, value, color } = props;

  const gaugeData = [
    {
      value: value,
      name: name,
      height: "50%",
      title: {
        offsetCenter: ["0%", "-15%"],
      },
      detail: {
        valueAnimation: true,
        offsetCenter: ["0%", "0%"],
      },
    },
  ];

  return (
    <div>
      <ReactEcharts
        option={{
          series: [
            {
              type: "gauge",
              startAngle: 90,
              endAngle: -270,
              pointer: {
                show: false,
              },
              progress: {
                show: true,
                overlap: false,
                roundCap: true,
                clip: false,
                itemStyle: {
                  color: color,
                  borderWidth: 0,
                  borderColor: "#464646",
                },
              },
              axisLine: {
                lineStyle: {
                  width: 10,
                },
              },
              splitLine: {
                show: false,
                distance: 0,
                length: 10,
              },
              axisTick: {
                show: false,
              },
              axisLabel: {
                show: false,
                distance: 50,
              },
              data: gaugeData,
              title: {
                fontSize: 0,
              },
              detail: {
                width: 55,
                height: 20,
                fontSize: 18,
                color: color,
                borderColor: color,
                borderRadius: 20,
                borderWidth: 1,
                formatter: "{value}%",
              },
            },
          ],
        }}
      />
    </div>
  );
};

export default CustomChartGauge;
