// node_modules (NodeJS, CommonJS)
// const yaml = require('js-yaml');
// const { readFileSync } = require('fs');

// ES6
// import { readFileSync } from 'fs';

//=> without Node.js, require is not defined

export const _SHOW_LABEL = 2;
export const _LABEL_TD_INDEX = 3;
export const _FIXED_POINT = 5;

export const _SHOW_BUTTON = "<br><button class='show-all-btn badge badge-primary'>더보기</button>";
export const _HIDE_BUTTON = "<br><button class='hide-btn badge badge-primary'>숨기기</button>";

export const _CONSTANT = {
  // https://www.abeautifulsite.net/determining-your-apps-base-directory-in-nodejs
  // _KIALI: `${kiali.url}`,
  // _KUBE_OPS_VIEW: `${yaml.safeLoad(readFileSync(`${__dirname}/chart/files/application.yml`))}`,
  ALL: `all`,
  POD: `pod`,
  DEPLOYMENT: `deployment`,
  STATEFULSET: `statefulset`,
  DAEMONSET: `daemonset`,
  SERVICE: `service`,
  NAMESPACES: `namespaces`,
}

export const _TABLE = {
  PODS: `pods`,
  DEPLOYMENTS: `deployments`,
  STATEFULSETS: `statefulsets`,
  DAEMONSETS: `daemonsets`,
  SERVICES: `services`,
  RNODES: `rnodes`,
  RPODS: `rpods`,
  RSERVICES: `rservices`,
  RSTORAGES: `rstorages`,
  SKT_REGION: `sktRegion`,
  SKT_APPS: `sktApps`,
}

export const _KUBE_OBJECT = {
  ALL: `all`,
  POD: `Pod`,
  DEPLOY: `Deployment`,
  STS: `StatefulSet`,
  DS: `DaemonSet`,
  SVC: `Service`,
}

export const _NAME_DATA_INDEX = {
  NODE: 1,
  POD: 1,
  SERVICE: 1,
  STORAGE: 1,
  SKT_REGION: 1,
  SKT_APPS: 2,
}