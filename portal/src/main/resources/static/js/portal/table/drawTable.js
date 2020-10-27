import labels from '../resource/labels.js';
import {
  _SHOW_LABEL,
  _TABLE,
} from '../common/constants.js';

// https://datatables.net/reference/option/
const commonTableOption = {
  pagingType: "full_numbers",
  lengthMenu: [
    [5, 25, 50, -1],
    [5, 25, 50, "All"]
  ],
  responsive: true,
  destroy: true,
  initComplete: (settings, json) => {
    $('.data-loading').hide();
  },
  language: {
    search: "_INPUT_",
    searchPlaceholder: "Search objects",
    emptyTable: "조회된 결과가 없습니다.",
    zeroRecords: "검색된 결과가 없습니다.",
    lengthMenu: "페이지당 _MENU_ 개",
    info: "_START_-_END_ / 총 _TOTAL_개",
    infoFiltered: "(Filtered)",
    infoEmpty: "",
  },
}

// https://datatables.net/reference/option/
const podsTableOption = {
  columns: [
    { title: "<i class='material-icons'>sort</i>", data: "check" },
    { title: "Name", data: "name" },
    { title: "Image", data: "containers[0].image" },
    { title: "Namespace", data: "namespace" },
    { title: "Containers", data: "pods" },
    { title: "Status", data: "running" },
    { title: "Pod-IP", data: "ip" },
  ],
  order: [[ 0, "desc" ]],
}
Object.assign(podsTableOption, commonTableOption);

const deploymentsTableOption = {
  columns: [
    { title: "<i class='material-icons'>sort</i>", data: "check" },
    { title: "Name", data: "name" },
    { title: "Containers", data: "pods" },
    { title: "Status", data: "running" },
    { title: "Namespace", data: "namespace" },
  ],
  order: [[ 0, "desc" ]],
}
Object.assign(deploymentsTableOption, commonTableOption);

const statefulSetsTableOption = {
  columns: [
    { title: "<i class='material-icons'>sort</i>", data: "check" },
    { title: "Name", data: "name" },
    { title: "Image", data: "containers[0].image" },
    { title: "Namespace", data: "namespace" },
    { title: "Replicas", data: "pods" },
    { title: "Status", data: "running" },
  ],
  order: [[ 0, "desc" ]],
}
Object.assign(statefulSetsTableOption, commonTableOption);

const daemonSetsTableOption = {
  columns: [
    { title: "<i class='material-icons'>sort</i>", data: "check" },
    { title: "Name", data: "name" },
    { title: "Namespace", data: "namespace" },
    { title: "Desired", data: "status.desiredNumberScheduled" },
    { title: "Current", data: "status.currentNumberScheduled" },
    { title: "Ready", data: "status.numberReady" },
    { title: "Update", data: "status.updatedNumberScheduled" },
    { title: "Available", data: "status.numberAvailable" },
    { title: "Status", data: "running" },
  ],
  order: [[ 0, "desc" ]],
}
Object.assign(daemonSetsTableOption, commonTableOption);

const servicesTableOption = {
  columns: [
    { title: "#", data: "index" },
    { title: "Name", data: "name" },
    { title: "Namespace", data: "namespace" },
    { title: "Type", data: "type" },
    { title: "Cluster-IP", data: "clusterIp" },
    { title: "Port(s)", data: "ports" },
  ],
}
Object.assign(servicesTableOption, commonTableOption);

const resourceCommonTableOption = {
  pagingType: "full_numbers",
  lengthMenu: [
    [10, 25, 50, -1],
    [10, 25, 50, "All"]
  ],
  responsive: true,
  destroy: true,
  initComplete: (settings, json) => {
    $('.data-loading').hide();
  },
  language: {
    search: "_INPUT_",
    searchPlaceholder: "Search objects",
    emptyTable: "조회된 결과가 없습니다.",
    zeroRecords: "검색된 결과가 없습니다.",
    lengthMenu: "페이지당 _MENU_ 개",
    info: "_START_-_END_ / 총 _TOTAL_개",
    infoFiltered: "(Filtered)",
    infoEmpty: "",
  },
}

const resourceNodeTableOption = {
  columns: [
    { title: "<i class='material-icons'>sort</i>", data: "check" },
    { title: "Name", data: "name", width: "5%" },
    { title: "Role", data: "role" },
    { title: "Zone/Region", data: "zoneRegion", },
    { title: "Label", data: "labels" },
    { title: "Ready", data: "ready" },
    { title: "Allocatable", data: "allocatableResources", },
    { title: "Internal-IP", data: "address" },
    { title: "Kernel", data: "kernelVersion" },
  ],
  order: [[ 0, "desc" ]],
  columnDefs: [{
    // targets: 1,
    // render: function (data, type, row, meta) {
    //   $('td:eq(3)', row).css('min-width', '50%');
    // }
  }, {
    targets: 4,
    render: function ( data, type, row, meta ) {
      let labelEntry = [];
      // console.log(data);
      for (let [key, value] of Object.entries(data)) {
        if (key >= _SHOW_LABEL) {
          labelEntry.push(`<p class='hide-label'>${value}</p>\n`);
        } else {
          labelEntry.push(`<p>${value}</p>\n`);
        }
      }

      if (data.length > _SHOW_LABEL) {
        labelEntry = labels.initLabelsButton(labelEntry);
      }
      return labelEntry.join("");
    }
  }],
}
Object.assign(resourceNodeTableOption, resourceCommonTableOption);

const resourcePodTableOption = {
  columns: [
    { title: "<i class='material-icons'>sort</i>", data: "check" },
    { title: "Name", data: "name" },
    { title: "Image", data: "containers[0].image" },
    { title: "Namespace", data: "namespace" },
    { title: "Containers", data: "pods" },
    { title: "Status", data: "running" },
    { title: "Pod-IP", data: "ip" },
    // {
    //   title: "Action",
    //   data: "action",
    //   className: "disabled-sorting text-right",
    // },
  ],
  order: [[ 0, "desc" ]],
}
Object.assign(resourcePodTableOption, resourceCommonTableOption);

const resourceServiceTableOption = {
  columns: [
    { title: "#", data: "index" },
    { title: "Name", data: "name" },
    { title: "Namespace", data: "namespace" },
    { title: "Label", data: "labels" },
    { title: "Type", data: "type" },
    { title: "Cluster-IP", data: "clusterIp" },
    { title: "Port(s)", data: "ports" },
  ],
  columnDefs: [{
    targets: 3,
    // data: "data",
    render: function ( data, type, row, meta ) {
      let labelEntry = [];
      if (data === null || typeof data === 'undefined') return labelEntry;

      for (let [key, value] of Object.entries(data)) {
        if (key >= _SHOW_LABEL) {
          labelEntry.push(`<p class='hide-label'>${value}</p>\n`);
        } else {
          labelEntry.push(`<p>${value}</p>\n`);
        }
      }

      if (data.length > _SHOW_LABEL) {
        labelEntry = labels.initLabelsButton(labelEntry);
      }

      return labelEntry.join("");
    }
  }],
}
Object.assign(resourceServiceTableOption, resourceCommonTableOption);

const resourceStorageTableOption = {
  columns: [
    { title: "#", data: "index" },
    { title: "Persistent Volume Claim", data: "name" },
    { title: "Namespace", data: "namespace" },
    { title: "Label", data: "labels" },
    { title: "Status", data: "status" },
    { title: "Persistent Volume", data: "volume" },
    { title: "Capacity", data: "capacity" },
    { title: "Access Modes", data: "accessModes" },
    { title: "Storage Class", data: "storageClass" },
  ],
  columnDefs: [{
    /* Labels */
    targets: 3,
    render: function ( data, type, row, meta ) {
      if (row.labels !== null) {
        let labelEntry = [];
        for (let [key, value] of Object.entries(row.labels)) {
          if (key >= _SHOW_LABEL) {
            labelEntry.push(`<p class='hide-label'>${value}</p>\n`);
          } else {
            labelEntry.push(`<p>${value}</p>\n`);
          }
        }

        if (row.labels != null && row.labels.length > _SHOW_LABEL) {
          labelEntry = labels.initLabelsButton(labelEntry);
        }
        return labelEntry.join("");
      } else {
        return "-";
      }
    }
  }, {
    /* Access Modes */
    targets: 7,
    render: function ( data, type, row, meta ) {
      if (row.accessModes !== null) {
        let accessModeEntry = [];
        for (let [key, value] of Object.entries(row.accessModes)) {
          if (key >= _SHOW_LABEL) {
            accessModeEntry.push(`<p class='hide-label'>${value}</p>\n`);
          } else {
            accessModeEntry.push(`<p>${value}</p>\n`);
          }
        }

        if (row.accessModes != null && row.accessModes.length > _SHOW_LABEL) {
          accessModeEntry = labels.initLabelsButton(accessModeEntry);
        }
        return accessModeEntry.join("");
      } else {
        return "-";
      }
    }
  }],
}
Object.assign(resourceStorageTableOption, resourceCommonTableOption);

const sktRegionTableOption = {
  columns: [
    { title: "#", data: "id" },
    { title: "Name", data: "name" },
    { title: "dType", data: "deploy_type" },
    { title: "sType", data: "service_type" },
    { title: "HA", data: "highavailability" },
    { title: "MEPM", data: "mepm_version" },
    // { title: "Datacenter", data: "numDatacenter" },
  ],
  columnDefs: [],
}
Object.assign(sktRegionTableOption, resourceCommonTableOption);

const sktAppsTableOption = {
  columns: [
    { title: "#", data: "id" },
    { title: "Catalog", data: "catalog_id" },
    { title: "Name", data: "app_pkg_name" },
    { title: "ORG", data: "org_id" },
    { title: "Region", data: "region_id" },
    { title: "dType", data: "deployment_type" },
    { title: "Status", data: "status" },
    { title: "MEPM", data: "mepm_version" },
  ],
  columnDefs: [],
}
Object.assign(sktAppsTableOption, resourceCommonTableOption);

function drawTable(name, dataArray) {
  if (name === _TABLE.SERVICES || name === _TABLE.RSERVICES) {
    dataArray.forEach((element, index) => {
      element["index"] = index + 1;
      // let ports = "";
      // element.ports.forEach((item, index) => {
      //   if (index === 0) {
      //     ports = `${item.port}${element.type === 'NodePort' ? `:${item.nodePort}` : ''}/${item.protocol}`;
      //   } else {
      //     ports += `, ${item.port}${element.type === 'NodePort' ? `:${item.nodePort}` : ''}/${item.protocol}`;
      //   }
      // });
      // element.ports = ports;
    });
  } else if (name === _TABLE.RNODES) {
    dataArray.forEach(element => {
      element["check"] = `
        <i class='material-icons ${element.ready === 'True' ? 'text-success' : 'text-warning'}'>
          ${element.ready === 'True' ? 'check_circle' : 'warning'}
        </i>
      `.trim();
    });
  } else if (name === _TABLE.RSTORAGES) {
    dataArray.forEach((element, index) => {
      element["index"] = index + 1;
    });
  } else if (name === _TABLE.SKT_REGION) {
    const tmp = dataArray;
    dataArray = [];
    dataArray.push(tmp);
    // dataArray.forEach((element) => {
    //   element["numDatacenter"] = element["datacenter"].length;
    // });
  } else if (name === _TABLE.SKT_APPS) {
    console.log(_TABLE.SKT_APPS);
  } else {
    dataArray.forEach(element => {
      element["check"] = `
        <i class='material-icons ${element.running === 'Running' ? 'text-success' : 'text-warning'}'>
          ${element.running === 'Running' ? 'check_circle' : 'warning'}
        </i>
      `.trim();
    });
  }
  // console.log("drawTable dataArray : ", dataArray);

  let option;
  switch(name) {
    case _TABLE.PODS:
      option = podsTableOption;
      break;
    case _TABLE.DEPLOYMENTS:
      option = deploymentsTableOption;
      break;
    case _TABLE.STATEFULSETS:
      option = statefulSetsTableOption;
      break;
    case _TABLE.DAEMONSETS:
      option = daemonSetsTableOption;
      break;
    case _TABLE.SERVICES:
      option = servicesTableOption;
      break;
    case _TABLE.RNODES:
      option = resourceNodeTableOption;
      break;
    case _TABLE.RPODS:
      option = resourcePodTableOption;
      break;
    case _TABLE.RSERVICES:
      option = resourceServiceTableOption;
      break;
    case _TABLE.RSTORAGES:
      option = resourceStorageTableOption;
      break;
    case "sktRegion":
      option = sktRegionTableOption;
      break;
    case "sktApps":
      option = sktAppsTableOption;
      break;
    default:
      console.error("Unknown");
      console.log(name);
  }

  const table = $(`#${name}`).DataTable(option);

  // 네임스페이스 변경 등 테이블만 redraw할 경우 clear 필요
  table.clear();
  // console.log('debug1');
  table.rows.add(dataArray);
  // console.log('debug2');

  // adjust 하기 전에 draw 하지 않으면 Node에서 에러
  table.draw();
  // console.log('debug3');
  // adjust 한 후에 draw 하지 않으면 Dashboard에서 에러
  table.columns.adjust().draw();  // responsive, autowidth
  // console.log('debug4');

  // action
  return table;
}

const table = {
  drawTable: drawTable
}

export default table;