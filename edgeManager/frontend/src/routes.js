import DashboardIcon from '@mui/icons-material/Dashboard';
import EdgeMonitoring from "views/Monitoring/EdgeMonitoring/EdgeMonitoring";
import ClusterMonitoring from "views/Monitoring/ClusterMonitoring/ClusterMonitoring";
import NodeMonitoring from "views/Monitoring/NodeMonitoring/NodeMonitoring";
import PodMonitoring from "views/Monitoring/PodMonitoring/PodMonitoring";
import ControllerMonitoring from "views/Monitoring/ControllerMonitoring/ControllerMonitoring";
import StorageMonitoring from "views/Monitoring/StorageMonitoring/StorageMonitoring";
import ServiceMonitoring from "views/Monitoring/ServiceMonitoring/ServiceMonitoring";
import CreateDeployment from "views/Management/CreateDeployment/CreateDeployment";
import CreatePod from "views/Management/CreatePod/CreatePod";
import CreateService from "views/Management/CreateService/CreateService";
import BigCrawlerManagement from "views/Management/BigCrawlerManagement/BigCrawlerManagement";
import RabbitmqMonitoring from 'views/Monitoring/RabbitmqMonitoring/RabbitmqMonitoring';

const routesEdge = [
  { type: "title", title: "Monitoring", key: "title-monitoring" },
  {
    type: "collapse",
    name: "Monitoring",
    key: "monitoring",
    icon: <DashboardIcon/>,
    collapse: [
      {
        name: "EdgeMonitoring",
        key: "edgeMonitoring",
        route: "/views/monitoring/edgeMonitoring",
        component: <EdgeMonitoring/>,
        layout: "/admin",
      },
      {
        name: "ClusterMonitoring",
        key: "clusterMonitoring",
        route: "/views/monitoring/clusterMonitoring",
        component: <ClusterMonitoring/>,
        layout: "/admin",
      },
      {
        name: "NodeMonitoring",
        key: "nodeMonitoring",
        layout: "/admin",
        route: "/views/monitoring/nodeMonitoring",
        component: <NodeMonitoring/>,
      },
      {
        type: "collapse",
        name: "PodMonitoring",
        key: "podMonitoring",
        route: "/views/monitoring/podMonitoring",
        component: <PodMonitoring />,
        noCollapse: true,
        layout: "/admin",
      },
      {
        type: "collapse",
        name: "ControllerMonitoring",
        key: "controllerMonitoring",
        route: "/views/monitoring/controllerMonitoring",
        component: <ControllerMonitoring/>,
        noCollapse: true,
        layout: "/admin",
      },
      {
        type: "collapse",
        name: "StorageMonitoring",
        key: "storageMonitoring",
        route: "/views/monitoring/storageMonitoring",
        component: <StorageMonitoring />,
        noCollapse: true,
        layout: "/admin",
      },
      {
        type: "collapse",
        name: "ServiceMonitoring",
        key: "serviceMonitoring",
        route: "/views/monitoring/serviceMonitoring",
        component: <ServiceMonitoring />,
        noCollapse: true,
        layout: "/admin",
      },
      {
        type: "collapse",
        name: "EdgeMQMonitoring",
        key: "EdgeMQMonitoring",
        route: "/views/monitoring/edgeMQMonitoring",
        component: <RabbitmqMonitoring />,
        noCollapse: true,
        layout: "/admin",
      },
    ],
  },
  {
    type: "collapse",
    name: "Management",
    key: "management",
    icon: <DashboardIcon/>,
    collapse: [
      {
        type: "collapse",
        name: "CreatePod",
        key: "createPod",
        route: "/views/management/createPod",
        component: <CreatePod/>,
        noCollapse: true,
        layout: "/admin",
      },
      {
        type: "collapse",
        name: "CreateDeployment",
        key: "createDeployment",
        route: "/views/management/createDeployment",
        component: <CreateDeployment/>,
        noCollapse: true,
        layout: "/admin",
      },
      {
        type: "collapse",
        name: "CreateService",
        key: "createService",
        route: "/views/management/createService",
        component: <CreateService/>,
        noCollapse: true,
        layout: "/admin",
      },
      {
        type: "collapse",
        name: "BigCrawler",
        key: "bigCrawler",
        route: "/views/management/bigCrawler",
        component: <BigCrawlerManagement/>,
        noCollapse: true,
        layout: "/admin",
      },
    ],
  },
];

export default routesEdge;
