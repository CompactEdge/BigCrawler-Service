/*!

=========================================================
* Paper Dashboard PRO React - v1.2.0
=========================================================

* Product Page: https://www.creative-tim.com/product/paper-dashboard-pro-react
* Copyright 2020 Creative Tim (https://www.creative-tim.com)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
// Dashboard
import Dashboard from 'views/Dashboard.js';

// Monitoring
import MetricCluster from 'views/pages/metrics/MetricCluster.js';
import MetricNamespace from 'views/pages/metrics/MetricNamespace.js';
import MetricNode from 'views/pages/metrics/MetricNode.js';
import MetricPod from 'views/pages/metrics/MetricPod.js';

// Kubernetes
import KubernetesNode from 'views/pages/resources/KubernetesNode.js';
import KubernetesPod from 'views/pages/resources/KubernetesPod.js';
import KubernetesDeployment from 'views/pages/resources/KubernetesDeployment.js';
import KubernetesDaemonSet from 'views/pages/resources/KubernetesDaemonset.js';
import KubernetesReplicaSet from 'views/pages/resources/KubernetesReplicaset.js';
import KubernetesReplicationController from 'views/pages/resources/KubernetesReplicationController.js';
import KubernetesStatefulSet from 'views/pages/resources/KubernetesStatefulset.js';
import KubernetesJob from 'views/pages/resources/KubernetesJob.js';
import KubernetesService from 'views/pages/resources/KubernetesService.js';
import KubernetesStorage from 'views/pages/resources/KubernetesStorage.js';

// User
import UserProfile from 'views/pages/UserProfile.js';

// Components
// import Buttons from 'views/components/Buttons.js';
// import GridSystem from 'views/components/GridSystem.js';
// import Icons from 'views/components/Icons.js';
// import Notifications from 'views/components/Notifications.js';
// import Panels from 'views/components/Panels.js';
// import SweetAlert from 'views/components/SweetAlert.js';
// import Typography from 'views/components/Typography.js';
// import ExtendedTables from 'views/tables/ExtendedTables.js';
// import ReactTables from 'views/tables/ReactTables.js';
// import RegularTables from 'views/tables/RegularTables.js';
// import Timeline from 'views/pages/Timeline.js';

// Deprecated
// import Calendar from "views/Calendar.js";
// import Charts from "views/Charts.js";
// import ExtendedForms from "views/forms/ExtendedForms.js";
// import FullScreenMap from "views/maps/FullScreenMap.js";
// import GoogleMaps from "views/maps/GoogleMaps.js";
// import LockScreen from "views/pages/LockScreen.js";
// import Login from "views/pages/Login.js";
// import Register from "views/pages/Register.js";
// import RegularForms from "views/forms/RegularForms.js";
// import ValidationForms from "views/forms/ValidationForms.js";
// import VectorMap from "views/maps/VectorMap.js";
// import Widgets from "views/Widgets.js";
// import Wizard from "views/forms/Wizard.js";

const routes = [
  {
    path: '/dashboard',
    name: 'Dashboard',
    // icon: 'nc-icon nc-chart-pie-36',
    icon: 'nc-icon nc-layout-11',
    component: Dashboard,
    layout: '/admin',
  },
  {
    collapse: true,
    name: 'Monitoring',
    // icon: 'nc-icon nc-laptop',
    icon: 'nc-icon nc-tv-2',
    state: 'monitoringCollapse',
    views: [
      {
        path: '/monitoring/cluster',
        name: 'Cluster',
        mini: 'C',
        component: MetricCluster,
        layout: '/admin',
      },
      {
        path: '/monitoring/namespace',
        name: 'Namespace',
        mini: 'NS',
        component: MetricNamespace,
        layout: '/admin',
      },
      {
        path: '/monitoring/node',
        name: 'Node',
        mini: 'NO',
        component: MetricNode,
        layout: '/admin',
      },
      {
        path: '/monitoring/pod',
        name: 'Pod',
        mini: 'PO',
        component: MetricPod,
        layout: '/admin',
      },
    ],
  },
  {
    collapse: true,
    name: 'Kubernetes',
    icon: 'nc-icon nc-cloud-upload-94',
    state: 'resourcesCollapse',
    views: [
      {
        path: '/kubernetes/nodes',
        name: 'Node',
        mini: 'NO',
        component: KubernetesNode,
        layout: '/admin',
      },
      {
        path: '/kubernetes/pods',
        name: 'Pod',
        mini: 'PO',
        component: KubernetesPod,
        layout: '/admin',
      },
      {
        path: '/kubernetes/deployments',
        name: 'Deployment',
        mini: 'DP',
        component: KubernetesDeployment,
        layout: '/admin',
      },
      {
        path: '/kubernetes/daemonsets',
        name: 'DaemonSet',
        mini: 'DS',
        component: KubernetesDaemonSet,
        layout: '/admin',
      },
      {
        path: '/kubernetes/replicasets',
        name: 'ReplicaSet',
        mini: 'RS',
        component: KubernetesReplicaSet,
        layout: '/admin',
      },
      {
        path: '/kubernetes/replicationcontrollers',
        name: 'ReplicationController',
        mini: 'RC',
        component: KubernetesReplicationController,
        layout: '/admin',
      },
      {
        path: '/kubernetes/statefulsets',
        name: 'StatefulSet',
        mini: 'STS',
        component: KubernetesStatefulSet,
        layout: '/admin',
      },
      {
        path: '/kubernetes/storages',
        name: 'Storage',
        mini: 'STR',
        component: KubernetesStorage,
        layout: '/admin',
      },
      {
        path: '/kubernetes/services',
        name: 'Service',
        mini: 'SVC',
        component: KubernetesService,
        layout: '/admin',
      },
      {
        path: '/kubernetes/jobs',
        name: 'Job',
        mini: 'J',
        component: KubernetesJob,
        layout: '/admin',
      },
    ],
  },
  // {
  //   path: '/registry',
  //   name: 'Registry',
  //   icon: 'nc-icon nc-app',
  //   component: UserProfile,
  //   layout: '/admin',
  // },
  // {
  //   path: '/setting',
  //   name: 'Setting',
  //   // icon: 'nc-icon nc-settings',
  //   icon: 'nc-icon nc-circle-10',
  //   component: UserProfile,
  //   layout: '/admin',
  // },
  /////////////////////////////////////////////////
  // Deprecated
  // {
  //   collapse: true,
  //   name: 'Components',
  //   icon: 'nc-icon nc-world-2',
  //   state: 'componentsCollapse',
  //   views: [
  //     {
  //       path: '/buttons',
  //       name: 'Buttons',
  //       mini: 'B',
  //       component: Buttons,
  //       layout: '/admin',
  //     },
  //     {
  //       path: '/grid-system',
  //       name: 'Grid System',
  //       mini: 'GS',
  //       component: GridSystem,
  //       layout: '/admin',
  //     },
  //     {
  //       path: '/panels',
  //       name: 'Panels',
  //       mini: 'P',
  //       component: Panels,
  //       layout: '/admin',
  //     },
  //     {
  //       path: '/sweet-alert',
  //       name: 'Sweet Alert',
  //       mini: 'SA',
  //       component: SweetAlert,
  //       layout: '/admin',
  //     },
  //     {
  //       path: '/notifications',
  //       name: 'Notifications',
  //       mini: 'N',
  //       component: Notifications,
  //       layout: '/admin',
  //     },
  //     {
  //       path: '/icons',
  //       name: 'Icons',
  //       mini: 'I',
  //       component: Icons,
  //       layout: '/admin',
  //     },
  //     {
  //       path: '/typography',
  //       name: 'Typography',
  //       mini: 'T',
  //       component: Typography,
  //       layout: '/admin',
  //     },
  //   ],
  // },
  // {
  //   collapse: true,
  //   name: 'Table',
  //   icon: 'nc-icon nc-mobile',
  //   state: 'tablesCollapse',
  //   views: [
  //     {
  //       path: '/regular-tables',
  //       name: 'Regular Tables',
  //       mini: 'RT',
  //       component: RegularTables,
  //       layout: '/admin',
  //     },
  //     {
  //       path: '/extended-tables',
  //       name: 'Extended Tables',
  //       mini: 'ET',
  //       component: ExtendedTables,
  //       layout: '/admin',
  //     },
  //     {
  //       path: '/react-tables',
  //       name: 'React Tables',
  //       mini: 'RT',
  //       component: ReactTables,
  //       layout: '/admin',
  //     },
  //   ],
  // },
  // {
  //   collapse: true,
  //   name: "Forms",
  //   icon: "nc-icon nc-planet",
  //   state: "formsCollapse",
  //   views: [
  //     {
  //       path: "/regular-forms",
  //       name: "Regular Forms",
  //       mini: "RF",
  //       component: RegularForms,
  //       layout: "/admin",
  //     },
  //     {
  //       path: "/extended-forms",
  //       name: "Extended Forms",
  //       mini: "EF",
  //       component: ExtendedForms,
  //       layout: "/admin",
  //     },
  //     {
  //       path: "/validation-forms",
  //       name: "Validation Forms",
  //       mini: "VF",
  //       component: ValidationForms,
  //       layout: "/admin",
  //     },
  //     {
  //       path: "/wizard",
  //       name: "Wizard",
  //       mini: "W",
  //       component: Wizard,
  //       layout: "/admin",
  //     },
  //   ],
  // },
  // {
  //   collapse: true,
  //   name: "Maps",
  //   icon: "nc-icon nc-support-17",
  //   state: "mapsCollapse",
  //   views: [
  //     {
  //       path: "/google-maps",
  //       name: "Google Maps",
  //       mini: "GM",
  //       component: GoogleMaps,
  //       layout: "/admin",
  //     },
  //     {
  //       path: "/full-screen-map",
  //       name: "Full Screen Map",
  //       mini: "FSM",
  //       component: FullScreenMap,
  //       layout: "/admin",
  //     },
  //     {
  //       path: "/vector-map",
  //       name: "Vector Map",
  //       mini: "VM",
  //       component: VectorMap,
  //       layout: "/admin",
  //     },
  //   ],
  // },
  // {
  //   collapse: true,
  //   name: "View",
  //   icon: "nc-icon nc-tag-content",
  //   state: "viewsCollapse",
  //   views: [
  //     {
  //       path: "/login",
  //       name: "Login",
  //       mini: "L",
  //       component: Login,
  //       layout: "/auth",
  //     },
  //     {
  //       path: "/register",
  //       name: "Register",
  //       mini: "R",
  //       component: Register,
  //       layout: "/auth",
  //     },
  //     {
  //       path: "/lock-screen",
  //       name: "LockScreen",
  //       mini: "LS",
  //       component: LockScreen,
  //       layout: "/auth",
  //     },
  //   ],
  // },
  // {
  //   path: "/widgets",
  //   name: "Widgets",
  //   icon: "nc-icon nc-tile-56",
  //   component: Widgets,
  //   layout: "/admin",
  // },
  // {
  //   path: "/charts",
  //   name: "Charts",
  //   icon: "nc-icon nc-zoom-split",
  //   component: Charts,
  //   layout: "/admin",
  // },
  // {
  //   path: "/calendar",
  //   name: "Calendar",
  //   icon: "nc-icon nc-delivery-fast",
  //   component: Calendar,
  //   layout: "/admin",
  // },
];

export default routes;
