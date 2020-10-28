import util from '../common/util.js';
import monitoring from './monitoring.js';
import notification from '../common/notification.js';

async function drawClusterMonitoring(change, idraw) {
  // const? let?
  let metricName = [ "namespace" ];
  let cpuQuotaPath =
  {
    cpuQuotaPods: 'pods',
    cpuQuotaWorkloads: 'workload',
    cpuQuotaCpuUsage: 'usage',
    cpuQuotaCpuRequests: 'requests',
    cpuQuotaCpuRequestsRate: 'requestsRate',
    cpuQuotaCpuLimits:'limits',
    cpuQuotaCpuLimitsRate: 'limitsRate',
  }
  let memoryRequestsPath =
  {
    memoryRequestsPods: 'pods',
    memoryRequestsWorkloads: 'workload',
    memoryRequestsUsage: 'usage',
    memoryRequests: 'requests',
    memoryRequestsRate: 'requestsRate',
    memoryRequestsLimits: 'limits',
    memoryRequestsLimitsRate: 'limitsRate',
  }

  Promise.all([
    drawHeadlines("/monitoring/cluster/cpuUtilisation", 'head-1'),
    drawHeadlines("/monitoring/cluster/cpuRequestsCommitment", 'head-2'),
    drawHeadlines("/monitoring/cluster/cpuLimitsCommitment", 'head-3'),
    drawHeadlines("/monitoring/cluster/memoryUtilisation", 'head-4'),
    drawHeadlines("/monitoring/cluster/memoryRequestsCommitment", 'head-5'),
    drawHeadlines("/monitoring/cluster/memoryLimitsCommitment", 'head-6'),
    monitoring.drawCpuUsage("/monitoring/cluster/cpuUsage", change, "", metricName, idraw.timeunit),
    monitoring.drawMemoryUsage("/monitoring/cluster/memoryUsage", change, "", metricName, idraw.timeunit),
    drawCpuQuota(cpuQuotaPath, "", metricName),
    drawMemoryRequests(memoryRequestsPath, "", metricName),
  ])
  .catch(err => {
    // notification.show('top','center', "An error occurred, please try again later.", 2);
    notification.show('top','right', "An error occurred, please try again later.", 2);
    clearInterval(idraw.intervalID);
    throw err;
  });
}

function drawHeadlines(url, domId) {
  return fetch(url, {
    method: "GET"
  }).then(res => {
    if (res.ok) {
      return res.json();
    }
    return Promise.reject(new Error("fail " + domId));
  }).then(json => {
    if (json['status'] === 'success') {
      for (const data of json['data']['result']) {
        document.getElementById(domId).innerText = util.makePercent(data['value'][1]);
      }
    }
  });
}

async function drawCpuQuota(arg1, arg2, arg3) {
  const [ resourcePath, searchParams, metricName ] = arguments;
  const fetchData = await monitoring.getFetchData('cluster', resourcePath, searchParams, metricName, true);
  const $cpuQuotaTbody = $("#cpuQuota").find('tbody');
  $cpuQuotaTbody.html('');

  if (fetchData) {
    // console.log(fetchData);
    fetchData.forEach(data => {
      const $tr = $('<tr></tr>');
      const $td0 = $('<td></td>').text(data['td1']);
      const $td1 = $('<td></td>').text(data['pods']);
      const $td2 = $('<td></td>').text(data['workload'] ? data['workload'] : '-');
      const $td3 = $('<td></td>').text(util.makeCpuMetric(data['usage']));
      const $td4 = $('<td></td>').text(util.makeCpuMetric(data['requests']));
      const $td5 = $('<td></td>').text(util.makePercent(data['requestsRate']));
      const $td6 = $('<td></td>').text(util.makeCpuMetric(data['limits']));
      const $td7 = $('<td></td>').text(util.makePercent(data['limitsRate']));
      $tr.append($td0)
        .append($td1)
        .append($td2)
        .append($td3)
        .append($td4)
        .append($td5)
        .append($td6)
        .append($td7);
      $cpuQuotaTbody.append($tr);
    })
  }
}

async function drawMemoryRequests(arg1, arg2, arg3) {
  const [ resourcePath, searchParams, metricName ] = arguments;
  const fetchData = await monitoring.getFetchData('cluster', resourcePath, searchParams, metricName, false);
  const $memoryRequestsTbody = $("#memoryRequests").find('tbody');
  $memoryRequestsTbody.html('');

  if (fetchData) {
    fetchData.forEach(data => {
      const $tr = $('<tr></tr>');
      const $td0 = $('<td></td>').text(data['td1']);
      const $td1 = $('<td></td>').text(data['pods']);
      const $td2 = $('<td></td>').text(data['workload'] ? data['workload'] : '-');
      const $td3 = $('<td></td>').text(util.makeBiByte(data['usage']));
      const $td4 = $('<td></td>').text(util.makeBiByte(data['requests']));
      const $td5 = $('<td></td>').text(util.makePercent(data['requestsRate']));
      const $td6 = $('<td></td>').text(util.makeBiByte(data['limits']));
      const $td7 = $('<td></td>').text(util.makePercent(data['limitsRate']));
      $tr.append($td0)
        .append($td1)
        .append($td2)
        .append($td3)
        .append($td4)
        .append($td5)
        .append($td6)
        .append($td7);
      $memoryRequestsTbody.append($tr);
    })
  }
}

const mCluster = {
  drawClusterMonitoring: drawClusterMonitoring,
}

export default mCluster;
