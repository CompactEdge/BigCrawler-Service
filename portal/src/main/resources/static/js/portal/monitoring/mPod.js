import util from '../common/util.js';
import monitoring from './monitoring.js';
import notification from '../common/notification.js';

function drawPodMonitoring(change, idraw) {
  // console.log(new Date(Date.now()));
  const _SELECT_NAMESPACE = document.querySelectorAll('.selectpicker')[0].value;
  const _SELECT_POD = document.querySelectorAll('.selectpicker')[1].value;
  const params = { namespace: _SELECT_NAMESPACE, pod: _SELECT_POD };
  const searchParams = new URLSearchParams(params).toString();
  const metricName = [ "container" ];
  const cpuQuotaPath =
  {
    cpuQuotaCpuUsage: 'usage',
    cpuQuotaCpuRequests: 'requests',
    cpuQuotaCpuRequestsRate: 'requestsRate',
    cpuQuotaCpuLimits: 'limits',
    cpuQuotaCpuLimitsRate: 'limitsRate',
  }
  const memoryRequestsPath =
  {
    memoryQuotaUsage: 'usage',
    memoryQuotaRequests: 'requests',
    memoryQuotaRequestsRate: 'requestsRate',
    memoryQuotaLimits: 'limits',
    memoryQuotaLimitsRate: 'limitsRate',
    memoryQuotaUsageRss: 'usageRss',
    memoryQuotaUsageCache: 'usageCache',
    memoryQuotaUsageSwap: 'usageSwap',
  }

  Promise.all([
    monitoring.drawCpuUsage("/monitoring/pod/cpuUsage", change, searchParams, metricName, idraw.timeunit),
    monitoring.drawMemoryUsage("/monitoring/pod/memoryUsage",change, searchParams, metricName, idraw.timeunit),
    drawCpuQuota(cpuQuotaPath, searchParams, metricName),
    drawMemoryQuota(memoryRequestsPath, searchParams, metricName),
  ])
  .catch(err => {
    notification.show('top','right', "An error occurred, please try again later.", 2);
    clearInterval(idraw.intervalID);
    throw err;
  })
}

async function drawCpuQuota(arg1, arg2, arg3) {
  const [ resourcePath, searchParams, metricName ] = arguments;
  const fetchData = await monitoring.getFetchData('pod', resourcePath, searchParams, metricName, true);
  const $cpuQuotaTbody = $("#cpuQuota").find('tbody');
  $cpuQuotaTbody.html('');

  if (fetchData) {
    fetchData.forEach(data => {
      const $tr = $('<tr></tr>');
      const $td0 = $('<td></td>').text(data['td1']);
      const $td1 = $('<td></td>').text(util.makeCpuMetric(data['usage']));
      const $td2 = $('<td></td>').text(util.makeCpuMetric(data['requests']));
      const $td3 = $('<td></td>').text(util.makePercent(data['requestsRate']));
      const $td4 = $('<td></td>').text(util.makeCpuMetric(data['limits']));
      const $td5 = $('<td></td>').text(util.makePercent(data['limitsRate']));
      $tr.append($td0)
        .append($td1)
        .append($td2)
        .append($td3)
        .append($td4)
        .append($td5);
      $cpuQuotaTbody.append($tr);
    })
  }
}

async function drawMemoryQuota(arg1, arg2, arg3) {
  const [ resourcePath, searchParams, metricName ] = arguments;
  const fetchData = await monitoring.getFetchData('pod', resourcePath, searchParams, metricName, false);
  const $memoryRequestsTbody = $("#memoryQuota").find('tbody');
  $memoryRequestsTbody.html('');

  if (fetchData) {
    fetchData.forEach(data => {
      const $tr = $('<tr></tr>');
      const $td0 = $('<td></td>').text(data['td1']);
      const $td1 = $('<td></td>').text(util.makeBiByte(data['usage']));
      const $td2 = $('<td></td>').text(util.makeBiByte(data['requests']));
      const $td3 = $('<td></td>').text(util.makePercent(data['requestsRate']));
      const $td4 = $('<td></td>').text(util.makeBiByte(data['limits']));
      const $td5 = $('<td></td>').text(util.makePercent(data['limitsRate']));
      const $td6 = $('<td></td>').text(util.makeBiByte(data['usageRss']));
      const $td7 = $('<td></td>').text(util.makeBiByte(data['usageCache']));
      const $td8 = $('<td></td>').text(util.makeBiByte(data['usageSwap']));
      $tr.append($td0)
        .append($td1)
        .append($td2)
        .append($td3)
        .append($td4)
        .append($td5)
        .append($td6)
        .append($td7)
        .append($td8);
      $memoryRequestsTbody.append($tr);
    })
  }
}

const mPod = {
  drawPodMonitoring: drawPodMonitoring,
}

export default mPod;
