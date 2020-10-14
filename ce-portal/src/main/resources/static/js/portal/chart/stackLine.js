const theme = [
  "#bffcc6",
  "#ff9cee",
  "#85e3ff",
  "#ffffd1",
  "#c5a3ff",
  "#aff8db",
  "#ffabab",
  "#e7ffac",
];

const stackLineOption = {
  title: {
    show: false,
  },
  legend: {
    show: true,
    type: 'scroll',
    top: 0,
  },
  grid: {
    top: "12%",
    bottom: "20%",
    left: "5%",
    right: "5%",
  },
  tooltip: {},
  xAxis: {
    type: 'time',
    maxInterval: 1000 * (60 * 1),
    minInterval: 1000 * (60 * 1),
    axisLabel: { formatter: '' },
    axisPointer: {
      label: { formatter: '' }
    },
  },
  yAxis: {
    type: 'value',
    boundaryGap: [0, '100%'],
    min: 0
  },
  dataZoom: [{
    show: true,
    type: 'inside',
  },{
    show: true,
    type: 'slider',
    bottom: 0,
  }],
  series: [],
  color: theme
};

// How to deep-copy JS Object
// console.log(cpuOption)
// const test = JSON.parse(JSON.stringify(cpuOption));
// console.log(test)
// console.log(cpuOption === test) // false
// function은 string 형식이 아니기 때문에 json 변환 과정에서 무시됨
const cpuOption = JSON.parse(JSON.stringify(stackLineOption));
const memoryOption = JSON.parse(JSON.stringify(stackLineOption));
let cpuUsage = '';
let memoryUsage = '';

function drawStackLine(redraw, option, chart, jsonData, metricName, divisor, fixedPoint, timeunit) {
  if (redraw) {
    chart.clear();
    option.series = [];
  }
  // Add metric_name
  if (!jsonData.length) {
    noDataToDisplay(option, chart);
    return;
  } else {
    chartFormatter(option);
  }

  if (!option.series.length) {
    // init
    initialize(option, jsonData, metricName, divisor, fixedPoint);
  } else {
    // Add last values
    addLastValues(option, jsonData, metricName, divisor, fixedPoint, timeunit);
  }

  option.xAxis['min'] = new Date(Date.now() - (1000 * 60 * 30));
  option.xAxis['max'] = new Date(Date.now());
  chart.setOption(option);

  window.addEventListener('resize', () => {chart.resize()}, true);
}

function noDataToDisplay(option, chart) {
  option.title = {
    show: true,
    textStyle: {
      color: "grey",
      fontSize: 20
    },
    text: "No data",
    left: "center",
    top: "center"
  };
  option.xAxis = {show: false};
  option.yAxis = {show: false};
  chart.setOption(option);
}

function chartFormatter(option) {
  option.title = {
    show: false,
  }
  option.xAxis = {
    type: 'time',
    maxInterval: 1000 * (60 * 1),
    minInterval: 1000 * (60 * 1),
    axisLabel: {
      formatter: function (value) {
        return echarts.format.formatTime('hh:mm', value);
      }
    },
    axisPointer: {
      label: {
        formatter: function (params) {
          return echarts.format.formatTime('hh:mm:ss', new Date(params.value));
        }
      }
    },
  };
  option.yAxis = {
    type: 'value',
    boundaryGap: [0, '100%'],
    min: 0
  };
}

function initialize(option, jsonData, metricName, divisor, fixedPoint) {
  // console.log(metricName[0]);
  option.tooltip = {
    trigger: 'axis',
    axisPointer: {
      type: 'cross',
    },
    backgroundColor: 'rgba(50,50,50,0.85)',
    position: function (pos, params, dom, rect, size) {
      var obj = { bottom: 50 };
      obj[['left', 'right'][+(pos[0] < size.viewSize[0] / 2)]] = 5;
      obj[['top', 'bottom'][+(pos[1] < size.viewSize[1] / 2)]] = '10%';
      return obj;
    }
  }

  // 날짜 기준으로 가장 오래된 데이터
  let maxLengthData = jsonData
    .filter(e => Math.max(e.values.length))
    .filter(e => Object.entries(e['metric']).length !== 0)
    .map(e => e['values'])
    .pop(0)
    .map(e => e[0]);

  const copyMaxLengthData = JSON.parse(JSON.stringify(maxLengthData));
  let initMaxLengthData = [];
  // 전부 0으로 초기화
  for (let index = 0;; index++) {
    const t = (copyMaxLengthData[0]+(index*30))*1000;
    const now = Date.now();
    if (t > now) break;
    initMaxLengthData.push({
      value: [
        new Date(t),
        0
      ]
    });
  }
  // console.log('initMaxLengthData :', initMaxLengthData);

  // Add metric_name
  for (let i = 0; i < jsonData.length; i++) {
    // console.log(jsonData[i]['metric'][metricName[0]]);
    if (!Object.entries(jsonData[i]['metric']).length) continue;

    // console.log(jsonData[i]['metric']);
    option.series[i] = {
      name: jsonData[i]['metric'][metricName[0]],
      type: 'line',
      stack: 'total',
      areaStyle: {},
      showSymbol: false,
      hoverAnimation: true,
      connectNulls: false,
      data: JSON.parse(JSON.stringify(initMaxLengthData)),
    }
  }

  // Add values
  inputSeriesData(option, jsonData, metricName, divisor, fixedPoint);
}

function inputSeriesData(option, jsonData, metricName, divisor, fixedPoint) {
  // console.log('jsonData:', jsonData);
  const convertedData  =
    jsonData.reduce((workloadMap, obj) => {
      let valueMap = {};
      for (const [ t, v ] of obj['values']) {
        valueMap[t] = v;
      }
      workloadMap[obj.metric[metricName[0]]] = valueMap;
      return workloadMap;
    }, {});
  // console.log('convertedData :', convertedData);

  for (let [ name, data ] of Object.entries(convertedData)) {
    // console.log('name :', name);
    // console.log('data :', data);
    for (const seriesData of option['series']) {
      if (!seriesData) continue;
      // const compareDate = Object.keys(data);
      // console.log(compareDate);
      if (name === seriesData['name']) {
        for (const d of seriesData['data']) {
          const initDate = new Date(d['value'][0]).getTime()/1000;
          // console.log(data[initDate]);
          if (!data[initDate]) continue;
          d['value'] = [
            new Date(initDate*1000),
            parseFloat(data[initDate]/divisor).toFixed(fixedPoint),
          ];
        }
      }
    }
  }
  // console.log('option.series:', option['series']);
}

function addLastValues(option, jsonData, metricName, divisor, fixedPoint, timeunit) {
  // console.log(jsonData);
  for (let obj of jsonData) {
    // 기존에 있던 오브젝트 인지 체크
    let nonExistFlag = true;

    for (const el of option.series) {
      if (obj.metric[metricName[0]] === el['name']) {
        nonExistFlag = false;
        // 30분 이상의 데이터는 shift해서 삭제
        if (el.data.length > (1000*60*30)/(timeunit)) {
          // console.log("before shift :", el.data.length);
          el.data.shift();
          // ex) 5s -> 15s
          // 데이터 개수의 차이가 생기기 때문에 시간을 늘린다면 한번 더 삭제
          if (el.data.length > (1000*60*30)/(timeunit)) el.data.shift();
          // console.log("after shift :", el.data.length);
        }
        // 마지막 값의 시간이 바로 5초 이상 차이가 난다면 데이터 0
        if (Math.abs(obj.values[obj.values.length-1][0] - (Date.now()/1000)) > 5) {
          el.data.push({
            value: [
              new Date(Date.now()),
              0,
            ]
          });
        } else {
          el.data.push({
            value: [
              new Date(Date.now()),
              (parseFloat(obj.values[obj.values.length-1][1])/divisor).toFixed(fixedPoint),
            ]
          });
        }
      }
    }
    // 기존의 차트에 해당 오브젝트가 없었다면 새롭게 추가
    if (nonExistFlag) {
      console.log("New instance");
      // console.log(obj);
      // console.log(obj['metric']);

      // 날짜 기준으로 가장 오래된 데이터
      let maxLengthData =
        option.series
          .filter(e => Math.max(e.data.length))
          .map(e => e['data'])
          .pop(0)
          .map(e => e['value'][0]);
      const copyMaxLengthData = JSON.parse(JSON.stringify(maxLengthData));
      // console.log('maxLengthData :', maxLengthData);
      // console.log('copyMaxLengthData :', copyMaxLengthData);
      let initMaxLengthData = [];
      // 전부 0으로 초기화
      for (let index = 0; index < copyMaxLengthData.length; index++) {
        const t = copyMaxLengthData[index];
        initMaxLengthData.push({
          value: [
            new Date(t),
            0
          ]
        });
      }
      // console.log('initMaxLengthData :', initMaxLengthData);

      // Add metric_name
      option.series.push({
        name: obj.metric[metricName[0]],
        type: 'line',
        stack: 'total',
        areaStyle: {},
        showSymbol: false,
        hoverAnimation: true,
        connectNulls: false,
        data: JSON.parse(JSON.stringify(initMaxLengthData)),
      });
    }
  }
}

const stackLine = {
  cpuOption: cpuOption,
  memoryOption: memoryOption,
  cpuUsage: cpuUsage,
  memoryUsage: memoryUsage,
  drawStackLine: drawStackLine,
}

export default stackLine;