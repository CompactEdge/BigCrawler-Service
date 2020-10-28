import util from '../common/util.js';
import stackLine from '../chart/stackLine.js';
import {
  _FIXED_POINT,
} from '../common/constants.js';


function drawCpuUsage(url, change, searchParams, metricName, timeunit) {
  if (change) {
    const cpuChart = document.querySelector('#cpuUsage');
    stackLine.cpuUsage = echarts.init(cpuChart, 'default', { render: "canvas" });
  }

  fetch(`${url}?${searchParams}`, {
    method: "GET"
  }).then(res => {
    return res.json();
  }).then(json => {
    if (json['status'] === 'success') {
      let redraw = true;
      if (json['data']['result'].length && !change) redraw = false;
      stackLine.drawStackLine(redraw, stackLine.cpuOption, stackLine.cpuUsage, json['data']['result'], metricName, 1, _FIXED_POINT, timeunit);
    }
  }).catch(err => {
    console.error(err);
  });
}

function drawMemoryUsage(url, change, searchParams, metricName, timeunit) {
  if (change) {
    const memoryChart = document.querySelector('#memoryUsage');
    stackLine.memoryUsage = echarts.init(memoryChart, 'default', { render: "canvas" });
  }

  fetch(`${url}?${searchParams}`, {
    method: "GET"
  }).then(res => {
    return res.json();
  }).then(json => {
    if (json['status'] === 'success') {
      let redraw = true;
      if (json['data']['result'].length && !change) redraw = false;
      stackLine.drawStackLine(redraw, stackLine.memoryOption, stackLine.memoryUsage, json['data']['result'], metricName, 1024*1024, _FIXED_POINT, timeunit);
    }
  }).catch(err => {
    console.error(err);
  });
}

async function getFetchData(obj, resourcePath, searchParams, metricName, cpu) {
  const path = Object.keys(resourcePath);
  let chainMap = [];

  for (const itPath of path) {
    const cpuData = await util.fetchTableData(`/monitoring/${obj}/${itPath}`, searchParams);
    const data = cpuData.data.result;

    data.forEach(result => {
      // time을 제외하고 데이터만 저장
      const value = result.value[1];
      // 첫 쿼리에서 td1과 td2 데이터를 먼저 저장
      if (itPath === path[0]) {
        chainMap.push({ td1: result.metric[metricName[0]] });
        if (metricName[1]) chainMap[chainMap.length-1]['td2'] = result.metric[metricName[1]];
      }
      // td1(name)이 같은 데이터라면 해당 프로퍼티에 저장
      chainMap.forEach((element, index) => {
        if (element['td1'] === result.metric[metricName[0]]) {
          element[resourcePath[itPath]] = value;
        }
      });
    });
  }
  // 데이터 결과들을 usage를 기준으로 정렬
  if (cpu) {
    return chainMap.sort((a, b) => (parseFloat(a['usage']) > parseFloat(b['usage']))
                                    ? -1
                                    : (parseFloat(a['usage']) < parseFloat(b['usage']))
                                      ? 1
                                      : 0);
  } else {
    return chainMap.sort((a, b) => (parseInt(a.usage) > parseInt(b.usage))
                                    ? -1
                                    : (parseInt(a.usage) < parseInt(b.usage))
                                      ? 1
                                      : 0);
  }
}

const monitoring = {
  getFetchData,
  drawCpuUsage,
  drawMemoryUsage,
}

export default monitoring;
