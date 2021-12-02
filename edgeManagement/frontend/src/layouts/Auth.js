/* eslint-disable no-unused-vars */
import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";

// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";

// core components
import Footer from "components/Footer/Footer.js";

import routes from "routes.js";

import styles from "assets/jss/material-dashboard-pro-react/layouts/authStyle.js";

import register from "assets/img/register.jpeg";
import login from "assets/img/login.jpeg";
import lock from "assets/img/lock.jpeg";
import error from "assets/img/clint-mckoy.jpg";
import pricing from "assets/img/bg-pricing.jpeg";

const useStyles = makeStyles(styles);

export default function Pages() {
  // ref for the wrapper div
  const wrapper = React.createRef();
  // styles
  const classes = useStyles();
  React.useEffect(() => {
    document.body.style.overflow = "unset";
    // Specify how to clean up after this effect:
    return function cleanup() {};
  });
  const getRoutes = (routes) => {
    return routes.map((prop, key) => {
      if (prop.collapse) {
        return getRoutes(prop.views);
      }
      if (prop.layout === "/auth") {
        return (
          <Route
            path={prop.layout + prop.path}
            component={prop.component}
            key={key}
          />
        );
      } else {
        return null;
      }
    });
  };

  return (
    <div>
      <div className={classes.wrapper} ref={wrapper}>
        <div
          className={classes.fullPage}
          style={{ backgroundImage: "url(/kubernetes_image.jpeg)" }}
        >
          <Switch>
            {getRoutes(routes)}
            <Redirect from="/auth" to="/auth/login-page" />
          </Switch>
        </div>
      </div>
    </div>
  );
}
