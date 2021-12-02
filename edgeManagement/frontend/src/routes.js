import DeployContainer from "views/DeployContainer/DeployContainer.js";
import LoginPage from "views/Pages/LoginPage.js";
//import RunAppService from "views/RunAppService/RunAppService.js";

// @material-ui/icons
import DashboardIcon from "@material-ui/icons/Dashboard";
//import PlaylistPlayIcon from "@material-ui/icons/PlaylistPlay";
import Image from "@material-ui/icons/Image";

var dashRoutes = [
  {
    path: "/deployContainer",
    name: "container 관리",
    icon: DashboardIcon,
    component: DeployContainer,
    layout: "/admin",
  },
  {
    path: "/login-page",
    name: "Login Page",
    icon: Image,
    component: LoginPage,
    layout: "/auth",
  },
];
export default dashRoutes;
