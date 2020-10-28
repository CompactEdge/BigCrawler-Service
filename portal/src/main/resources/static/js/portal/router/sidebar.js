import componentUserProfile from "../components/userProfile.js";
import componentDashboard from "../components/dashboard.js";
import componentResourceNode from "../components/rNode.js";
import componentResourcePod from "../components/rPod.js";
import componentResourceService from "../components/rService.js";
import componentResourceStorage from "../components/rStorage.js";
import componentMonitoringCluster from "../components/mCluster.js";
import componentMonitoringNamespace from "../components/mNamespace.js";
import componentMonitoringNode from "../components/mNode.js";
import componentMonitoringPod from "../components/mPod.js";
import componentTrace from "../components/trace.js";
import componentAppRepo from "../components/appRepo.js";

import util from "../common/util.js";
import notification from "../common/notification.js";
import profile from "../user/profile.js";
import pie from "../chart/pie.js";
import dashboard from "../dashboard/dashboard.js";
import rNode from "../resource/rNode.js";
import rPod from "../resource/rPod.js";
import rService from "../resource/rService.js";
import rStorage from "../resource/rStorage.js";
// import monitoring from '../monitoring/monitoring.js';
import mCluster from "../monitoring/mCluster.js";
import mNamespace from "../monitoring/mNamespace.js";
import mNode from "../monitoring/mNode.js";
import mPod from "../monitoring/mPod.js";
import trace from "../trace/trace.js";
import app from "../app/app.js";

const container = document.querySelector(".main-panel");

const sbUserProfile = document.querySelector("#userProfile");
const sbDashboard = document.querySelector("#dashboard");
const sbResourceNode = document.querySelector("#rNode");
const sbResourcePod = document.querySelector("#rPod");
const sbResourceService = document.querySelector("#rService");
const sbResourceStorage = document.querySelector("#rStorage");
const sbMonitoring = document.querySelector("#sbMonitoring");
const sbMonitoringCluster = document.querySelector("#mCluster");
const sbMonitoringNamespace = document.querySelector("#mNamespace");
const sbMonitoringNode = document.querySelector("#mNode");
const sbMonitoringPod = document.querySelector("#mPod");
const sbTrace = document.querySelector("#trace");
const sbAppRepo = document.querySelector("#appRepo");
const sbKubeOpsView = document.querySelector("#opsview");

import IntervalDraw from "../common/IntervalDraw.js";
const intervalDraw = new IntervalDraw();

// import { _CONSTANT } from "../common/constants.js";

// USER-PROFILE
function goUserProfile() {
  intervalDraw.stop();
  console.log("stop interval ID :", intervalDraw.id);

  container.innerHTML = componentUserProfile;

  fetch(`/user/1`, { method: "GET" })
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      document.querySelector(
        "input[name=userId]"
      ).value = document.querySelector(
        "input[type=hidden][name=user-id]"
      ).value;
      document.querySelector(
        "input[name=username]"
      ).value = document.querySelector(
        "input[type=hidden][name=user-name]"
      ).value;
      document.querySelector("input[name=userGroup]").value = data["userGroup"];
      document.querySelector("input[name=status]").value = data["status"];
      document.querySelector("input[name=email]").value = data["email"];
      document.querySelector("input[name=phone]").value = data["phone"];
      document.querySelector(
        ".text-user-name"
      ).innerHTML = document.querySelector(
        "input[type=hidden][name=user-name]"
      ).value;
      document.querySelector(".text-user-group").innerHTML = data["userGroup"];
    })
    .catch((err) => console.log(err));

  const postUserProfile = document.querySelector("#postUserProfile");
  postUserProfile.addEventListener(
    "submit",
    (e) => {
      e.preventDefault();

      // formdata to jsondata
      const jsonData = util.form2json(postUserProfile);
      // console.log(jsonData);

      // ajax
      fetch(`/user/${postUserProfile.userId.value}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(jsonData),
      })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        if (data.errors) {
          notification.show("top", "right", data.errors[0].defaultMessage, 2);
          return;
        }
        // console.log(data);
        profile.changeFormdata(data);
        notification.show("top", "right", "성공적으로 수정되었습니다.", 3);
      })
      .catch((err) => {
        console.error(err);
      });
    },
    false
  );
}

// DASHBOARD
function goDashboard() {
  container.innerHTML = componentDashboard(
    // _KUBE_OPS_VIEW_ENABLE,
    // _KUBE_OPS_VIEW
  );
  const pieChart = pie.initPieChart();
  // TODO:
  // intervalDraw.getObjects(0, () => dashboard.draw(pieChart));
  dashboard.draw(pieChart);

  //차트 resize
  window.onresize = () => {
    pieChart.forEach((e) => {
      e.resize();
    });
  };

  fetch(`/portal/selectns`, {
    method: "GET",
  })
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      dashboard.picker(data);
    })
    .catch((err) => {
      console.error(err);
    });

  document.querySelector(".selectpicker").addEventListener(
    "change",
    () => {
      dashboard.draw(pieChart);
    },
    false
  );

  // document.querySelector('.iframe-toggle').addEventListener('click', (e) => {
  //   e.preventDefault();
  //   setTimeout(()=>{ $(e.target).closest('.iframe-box').remove() }, 1000*0.3);
  // });
}

// RESOURCE
function goResourceNode() {
  intervalDraw.stop();
  container.innerHTML = componentResourceNode;
  rNode.initNodeTable();
}

function goResourcePod(name) {
  intervalDraw.stop();
  container.innerHTML = componentResourcePod;
  $(".selectpicker").selectpicker("render");
  rPod.initPodTable(name);
  const picker = document.querySelectorAll(".selectpicker");
  for (let item of picker) {
    item.addEventListener("change", rPod.select, false);
  }
}

function goResourceService(name) {
  intervalDraw.stop();
  container.innerHTML = componentResourceService;
  rService.initServiceTable(name);
  const picker = document.querySelectorAll(".selectpicker");
  for (let item of picker) {
    item.addEventListener("change", rService.select, false);
  }
}

function goResourceStorage() {
  intervalDraw.stop();
  container.innerHTML = componentResourceStorage;
  rStorage.initPvcTable();
  const picker = document.querySelectorAll(".selectpicker");
  for (let item of picker) {
    item.addEventListener("change", rStorage.select, false);
  }
}

// MONITORING
function goMonitoringCluster() {
  container.innerHTML = componentMonitoringCluster;
  $(".selectpicker").selectpicker("render");
  intervalDraw.getObjects(0, mCluster.drawClusterMonitoring);
  document
    .querySelectorAll(".selectpicker")[0]
    .addEventListener(
      "change",
      () => intervalDraw.getObjects(0, mCluster.drawClusterMonitoring),
      false
    );
}

function goMonitoringNamespace() {
  container.innerHTML = componentMonitoringNamespace;
  fetch(`/monitoring/pod/selectns`, {
    method: "GET",
  })
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      util.drawPicker("Namespace", data, 0);
      $(".selectpicker").selectpicker("render");
      intervalDraw.getObjects(2, mNamespace.drawNamespaceMonitoring);
    })
    .catch((err) => {
      console.error(err);
    });

  document
    .querySelectorAll(".selectpicker")[0]
    .addEventListener(
      "change",
      () => intervalDraw.getObjects(2, mNamespace.drawNamespaceMonitoring),
      false
    );
  document
    .querySelectorAll(".selectpicker")[1]
    .addEventListener(
      "change",
      () => intervalDraw.getObjects(2, mNamespace.drawNamespaceMonitoring),
      false
    );
  document
    .querySelectorAll(".selectpicker")[2]
    .addEventListener(
      "change",
      () => intervalDraw.getObjects(2, mNamespace.drawNamespaceMonitoring),
      false
    );
}

function goMonitoringNode() {
  container.innerHTML = componentMonitoringNode;
  fetch(`/monitoring/node/selectnode`, {
    method: "GET",
  })
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      util.drawPicker("Node", data, 0);
      $(".selectpicker").selectpicker("render");
      intervalDraw.getObjects(1, mNode.drawNodeMonitoring);
    })
    .catch((err) => {
      console.error(err);
    });

  document
    .querySelectorAll(".selectpicker")[0]
    .addEventListener(
      "change",
      () => intervalDraw.getObjects(1, mNode.drawNodeMonitoring),
      false
    );
  document
    .querySelectorAll(".selectpicker")[1]
    .addEventListener(
      "change",
      () => intervalDraw.getObjects(1, mNode.drawNodeMonitoring),
      false
    );
}

const getNamespacedPods = () => {
  const _SELECT_NAMESPACE = document.querySelectorAll(".selectpicker")[0].value;
  const params = { namespace: _SELECT_NAMESPACE };
  fetch(`/monitoring/pod/selectpod?${new URLSearchParams(params).toString()}`, {
    method: "GET",
  })
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      util.drawPicker("Pod", data, 1);
      intervalDraw.getObjects(2, mPod.drawPodMonitoring);
    })
    .catch((err) => {
      console.error(err);
    });
};

function goMonitoringPod() {
  container.innerHTML = componentMonitoringPod;
  fetch(`/monitoring/pod/selectns`, {
    method: "GET",
  })
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      util.drawPicker("Namespace", data, 0);
      $(".selectpicker").selectpicker("render");
      // getNamespacedPods(false);
      getNamespacedPods();
    })
    .catch((err) => {
      console.error(err);
    });

  document
    .querySelectorAll(".selectpicker")[0]
    .addEventListener("change", getNamespacedPods, false);
  document
    .querySelectorAll(".selectpicker")[1]
    .addEventListener(
      "change",
      () => intervalDraw.getObjects(2, mPod.drawPodMonitoring),
      false
    );
  document
    .querySelectorAll(".selectpicker")[2]
    .addEventListener(
      "change",
      () => intervalDraw.getObjects(2, mPod.drawPodMonitoring),
      false
    );
}

// TRACE
function goTrace() {
  intervalDraw.stop();
  container.innerHTML = componentTrace(_KIALI);
  trace();
}

// APP REPO
function goAppRepo() {
  intervalDraw.stop();
  container.innerHTML = componentAppRepo;

  const btnCommand = document.querySelector("#btnCommand");
  if (btnCommand) {
    btnCommand.addEventListener("click", app.appCommand);
  }

  const btnInstall = document.querySelectorAll(".btn-install");
  for (let item of btnInstall) {
    item.addEventListener("click", app.appInstall, false);
  }

  const btnDelete = document.querySelectorAll(".btn-delete");
  for (let item of btnDelete) {
    item.addEventListener("click", app.appDelete, false);
  }
}

function openKubeOpsView() {
  const win = window.open(_KUBE_OPS_VIEW, '_blank');
  win.focus();
}

sbUserProfile.addEventListener("click", (e) => {
  e.preventDefault();
  goUserProfile();
});
sbDashboard.addEventListener("click", (e) => {
  e.preventDefault();
  goDashboard();
});
sbResourceNode.addEventListener("click", (e) => {
  e.preventDefault();
  goResourceNode();
});
sbResourcePod.addEventListener("click", (e) => {
  e.preventDefault();
  goResourcePod();
});
sbResourceService.addEventListener("click", (e) => {
  e.preventDefault();
  goResourceService();
});
sbResourceStorage.addEventListener("click", (e) => {
  e.preventDefault();
  goResourceStorage();
});
if (sbMonitoring) {
  sbMonitoringCluster.addEventListener("click", (e) => {
    e.preventDefault();
    goMonitoringCluster();
  });
  sbMonitoringNamespace.addEventListener("click", (e) => {
    e.preventDefault();
    goMonitoringNamespace();
  });
  sbMonitoringNode.addEventListener("click", (e) => {
    e.preventDefault();
    goMonitoringNode();
  });
  sbMonitoringPod.addEventListener("click", (e) => {
    e.preventDefault();
    goMonitoringPod();
  });
}
if (sbTrace) {
  sbTrace.addEventListener("click", (e) => {
    e.preventDefault();
    goTrace();
  });
}

if (sbAppRepo) {
  sbAppRepo.addEventListener("click", (e) => {
    e.preventDefault();
    goAppRepo();
  });
}

// if (sbKubeOpsView) {
//   sbKubeOpsView.addEventListener("click", (e) => {
//     e.preventDefault();
//     openKubeOpsView();
//   })
// }

export default class Sidebar {
  constructor(msg) {
    this.msg = msg;
  }

  get message() {
    return this.msg;
  }

  dashboard() {
    goDashboard();
  }

  resourcePod(name) {
    goResourcePod(name);
  }
  resourceService(name) {
    goResourceService(name);
  }
}
