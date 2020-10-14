import util from '../common/util.js';
import monitoring from './monitoring.js';

// (()=>{
//   if (window.location.pathname.includes('/monitoring/namespace')) {
//     fetch(`/monitoring/pod/selectns`, {
//       method: "GET"
//     }).then(res => {
//       return res.json();
//     }).then(data => {
//       util.drawPicker("Namespace", data, 0);
//       monitoring.getObjects(2, drawNamespaceMonitoring)
//     }).catch(err => {
//       console.error(err);
//     });

//     document.querySelectorAll('.selectpicker')[0].addEventListener('change', ()=>{getObjects(2, drawNamespaceMonitoring)}, false);
//     document.querySelectorAll('.selectpicker')[1].addEventListener('change', ()=>{getObjects(2, drawNamespaceMonitoring)}, false);
//     document.querySelectorAll('.selectpicker')[2].addEventListener('change', ()=>{getObjects(2, drawNamespaceMonitoring)}, false);
//   }
// })();

function drawNamespaceMonitoring(change, timeunit) {
  // console.log(new Date(Date.now()));
  const _SELECT_NAMESPACE = document.querySelectorAll('.selectpicker')[0].value;
  const _SELECT_TYPE = document.querySelectorAll('.selectpicker')[1].value;
  const params = { namespace: _SELECT_NAMESPACE, type: _SELECT_TYPE };
  const searchParams = new URLSearchParams(params).toString();
  const metricName = [ "workload", "workload_type" ];

  monitoring.drawCpuUsage("/monitoring/namespace/cpuUsage", change, searchParams, metricName, timeunit);
  monitoring.drawMemoryUsage("/monitoring/namespace/memoryUsage", change, searchParams, metricName, timeunit);

  const cpuQuotaPath =
  {
    cpuQuotaRunningPods: 'runningPods',
    cpuQuotaCpuUsage: 'usage',
    cpuQuotaCpuRequests: 'requests',
    cpuQuotaCpuRequestsRate: 'requestsRate',
    cpuQuotaCpuLimits: 'limits',
    cpuQuotaCpuLimitsRate: 'limitsRate',
  }
  drawCpuQuota(cpuQuotaPath, searchParams, metricName);

  const memoryRequestsPath = 
  {
    memoryQuotaRunningPods: 'runningPods',
    memoryQuotaUsage: 'usage',
    memoryQuotaRequests: 'requests',
    memoryQuotaRequestsRate: 'requestsRate',
    memoryQuotaLimits: 'limits',
    memoryQuotaLimitsRate: 'limitsRate',
  }
  drawMemoryQuota(memoryRequestsPath, searchParams, metricName);
}

async function drawCpuQuota(arg1, arg2, arg3) {
  const [ resourcePath, searchParams, metricName ] = arguments;
  const fetchData = await monitoring.getFetchData('namespace', resourcePath, searchParams, metricName, true);
  const $cpuQuotaTbody = $("#cpuQuota").find('tbody');
  $cpuQuotaTbody.html('');

  if (fetchData) {
    fetchData.forEach(data => {
      const $tr = $('<tr></tr>');
      const $td0 = $('<td></td>').text(data['td1']);
      const $td1 = $('<td></td>').text(data['td2']);
      const $td2 = $('<td></td>').text(data['runningPods'] ? data['runningPods'] : '-');
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

async function drawMemoryQuota(arg1, arg2, arg3) {
  const [ resourcePath, searchParams, metricName ] = arguments;
  const fetchData = await monitoring.getFetchData('namespace', resourcePath, searchParams, metricName, false);
  const $memoryRequestsTbody = $("#memoryQuota").find('tbody');
  $memoryRequestsTbody.html('');

  if (fetchData) {
    fetchData.forEach(data => {
      const $tr = $('<tr></tr>');
      const $td0 = $('<td></td>').text(data['td1']);
      const $td1 = $('<td></td>').text(data['td2']);
      const $td2 = $('<td></td>').text(data['runningPods'] ? data['runningPods'] : '-');
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

const mNamespace = {
  drawNamespaceMonitoring: drawNamespaceMonitoring,
}

export default mNamespace;