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

import React, { useEffect, useState } from "react";

// prop-types is a library for typechecking of props
import PropTypes from "prop-types";

// @mui material components
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";

// Material Dashboard 2 PRO React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDAvatar from "components/MDAvatar";

function NumberComp({
  color,
  title,
  count,
  percentage,
  icon,
  item,
  reqData,
  reqLoading,
  setReqComplete,
  image,
}) {

  const [eChartData, setEChartData] = useState(0);

  useEffect(() => {
    if (reqLoading) {
      getData();
    };
  }, [reqLoading]);

  useEffect(() => {
    // console.log("EchartData: ", eChartData);
  }, [eChartData]);

  const getData = async () => {
    let val = await reqData(item);
    if (val) {
      setEChartData(val);
      setReqComplete(prev => ([...prev, item]));
    };
  };

  return (
    <Card>
      <MDBox p={2}>
        <MDBox display="flex" alignItems="center">
          <MDAvatar
            src={image || null}
            alt={title}
            size="lg"
            variant="rounded"
            bgColor={color}
            sx={{ p: 1, mt: -4, borderRadius: ({ borders: { borderRadius } }) => borderRadius.xl }}
          >
            {/* <Speed fontSize="medium" /> */}
            <Icon fontSize="medium" color="inherit">
              {"source"}
            </Icon>
          </MDAvatar>
          <MDBox ml={2} mt={-1} lineHeight={0}>
            <MDTypography variant="h5" fontWeight="medium">
              {title}
            </MDTypography>
          </MDBox>
        </MDBox>
        <MDBox textAlign="right">
          <MDBox
            fontWeight="100"
            fontSize="35px"
          >
            {eChartData}
          </MDBox>
        </MDBox>
      </MDBox>
    </Card>
  );
}

// Setting default values for the props of ComplexStatisticsCard
NumberComp.defaultProps = {
  color: "info",
  percentage: {
    color: "success",
    text: "",
    label: "",
  },
};

// Typechecking props for the ComplexStatisticsCard
NumberComp.propTypes = {
  color: PropTypes.oneOf([
    "primary",
    "secondary",
    "info",
    "success",
    "warning",
    "error",
    "light",
    "dark",
  ]),
  title: PropTypes.string.isRequired,
  count: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  percentage: PropTypes.shape({
    color: PropTypes.oneOf([
      "primary",
      "secondary",
      "info",
      "success",
      "warning",
      "error",
      "dark",
      "white",
    ]),
    amount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    label: PropTypes.string,
  }),
  icon: PropTypes.node.isRequired,
};

export default NumberComp;
