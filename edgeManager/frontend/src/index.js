/**
=========================================================
* Material Dashboard 2 PRO React - v2.1.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-pro-react
* Copyright 2022 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import App from "App";

// Material Dashboard 2 PRO React Context Provider
import { MaterialUIControllerProvider } from "context";

import { createStore } from "redux";
import { Provider } from "react-redux";
import indicator from "store/indicator";
import Admin from "route/Admin";
import Frame from "route/Frame";
import AppPage from "route/AppPage";


const store = createStore(indicator);

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <MaterialUIControllerProvider>
        <App />
      </MaterialUIControllerProvider>
    </BrowserRouter>,
  </Provider>,
  document.getElementById("root")
);
