import util from '../common/util.js';
import pie from '../chart/pie.js';
import Sidebar from '../router/sidebar.js';

import {
  _TABLE,
  _KUBE_OBJECT,
} from '../common/constants.js';

/**
 * 대시보드 그리기
 * @param {}
 */
const draw = async (pieChart) => {
  let _SELECT_NAMESPACE = $('.selectpicker').eq(0).val();
  
  // pod.then(data => { console.log(data) }) // async-await 만들어주면 Promise 반환이 아닌 바로 데이터 반환
  const pods = await util.fetchTableData(`/portal/${_SELECT_NAMESPACE}/${_TABLE.PODS}`, '');
  createPodTable('pods', pods);
  pie.drawPieChart(pods, pie.pieOption, pieChart[0], _KUBE_OBJECT.POD, '#scrollToPod');

  const deployments = await util.fetchTableData(`/portal/${_SELECT_NAMESPACE}/${_TABLE.DEPLOYMENTS}`, '');
  createDeployTable('deployments', deployments);
  pie.drawPieChart(deployments, pie.pieOption, pieChart[1], _KUBE_OBJECT.DEPLOY, '#scrollToDeployment');

  const statefulsets = await util.fetchTableData(`/portal/${_SELECT_NAMESPACE}/${_TABLE.STATEFULSETS}`, '');
  createStsTable('statefulsets', statefulsets);
  pie.drawPieChart(statefulsets, pie.pieOption, pieChart[2], _KUBE_OBJECT.STS, '#scrollToStatefulset');

  const daemonsets = await util.fetchTableData(`/portal/${_SELECT_NAMESPACE}/${_TABLE.DAEMONSETS}`, '');
  createDsTable('daemonsets', daemonsets);
  pie.drawPieChart(daemonsets, pie.pieOption, pieChart[3], _KUBE_OBJECT.DS, '#scrollToDaemonset');

  const services = await util.fetchTableData(`/portal/${_SELECT_NAMESPACE}/${_TABLE.SERVICES}`, '');
  createSvcTable('services', services);
  pie.drawSvcPieChart(services, pie.pieOption, pieChart[4], _KUBE_OBJECT.SVC, '#scrollToService');
}

/**
 * Namespace selectpicker 생성
 * @param {*} returnMap 
 */
function picker(namespaces) {
  $('.selectpicker').eq(0).html(
    `
    <optgroup label="Namespace" data-max-options="1">
      <option selected value="all">All namespaces</option>
    </optgroup>
    `
  );

  namespaces.forEach(ns => {
    const nsOptions = `<option>${ns.name}</option>`;
    $(".selectpicker").eq(0).append(nsOptions);
  });
  $('.selectpicker').eq(0).selectpicker('refresh');
}

/**
 * 테이블 생성
 * @param {*} returnMap 
 */
async function createPodTable(type, json) {
  const [ objType, data ] = arguments;
  const table = util.k8sObjectArrayTable(objType, data);
  if (table) {
    table.off('click');
    table.on('click', 'tbody>tr>td:nth-child(2)', function(e) {
      const podName = e.target.innerText;
      new Sidebar().resourcePod(podName);
      // location.href = `/resource/pod?name=${podName}`;
    });
  }
}

async function createDeployTable(type, json) {
  const [ objType, data ] = arguments;
  const table = util.k8sObjectArrayTable(objType, data);
  if (table) {
    table.off('click');
    table.on('click', 'tbody>tr>td:nth-child(2)', function(e) {
      const deploymentName = e.target.innerText;
      new Sidebar().resourcePod(deploymentName);
      // location.href = `/resource/pod?type=${_KUBE_OBJECT.DEPLOY}&name=${deploymentName}`;
    });
  }
}
async function createStsTable(type, json) {
  const [ objType, data ] = arguments;
  const table = util.k8sObjectArrayTable(objType, data);
  if (table) {
    table.off('click');
    table.on('click', 'tbody>tr>td:nth-child(2)', function(e) {
      const statefulSetName = e.target.innerText;
      new Sidebar().resourcePod(statefulSetName);
      // location.href = `/resource/pod?type=${_KUBE_OBJECT.STS}&name=${statefulSetName}`;
    });
  }
}
async function createDsTable(type, json) {
  const [ objType, data ] = arguments;
  const table = util.k8sObjectArrayTable(objType, data);
  if (table) {
    table.off('click');
    table.on('click', 'tbody>tr>td:nth-child(2)', function(e) {
      const daemonSetName = e.target.innerText;
      new Sidebar().resourcePod(daemonSetName);
      // location.href = `/resource/pod?type=${_KUBE_OBJECT.DS}&name=${daemonSetName}`;
    });
  }
}
async function createSvcTable(type, json) {
  const [ objType, data ] = arguments;
  const table = util.k8sObjectArrayTable(objType, data);
  if (table) {
    table.off('click');
    table.on('click', 'tbody>tr>td:nth-child(2)', function(e) {
      const serviceName = e.target.innerText;
      new Sidebar().resourceService(serviceName);
      // location.href = `/resource/service?serviceName=${serviceName}`;
    });
  }
}

const dashboard = {
  draw: draw,
  picker: picker,
}

export default dashboard;