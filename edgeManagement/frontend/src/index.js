/*!

=========================================================
* Material Dashboard PRO React - v1.10.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-pro-react
* Copyright 2021 Creative Tim (https://www.creative-tim.com)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";

import AuthLayout from "layouts/Auth.js";
import AdminLayout from "layouts/Admin.js";

import "assets/scss/material-dashboard-pro-react.scss?v=1.10.0";
import { createStore } from "redux";
import { Provider } from "react-redux";
import indicator from "store/indicator";

const store = createStore(indicator);

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      {sessionStorage.getItem("is_login") === "true" ? (
        <Switch>
          <Route path="/admin" component={AdminLayout} />
          <Redirect from="/" to="/admin/dashboard" />
        </Switch>
      ) : (
        <Switch>
          <Route path="/auth" component={AuthLayout} />
          <Redirect from="/" to="/auth/login" />
        </Switch>
      )}
    </BrowserRouter>
  </Provider>,
  document.getElementById("root")
);
