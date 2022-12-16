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

// prop-types is library for typechecking of props
import PropTypes from "prop-types";

// @mui material components
import Card from "@mui/material/Card";
// import Icon from "@mui/material/Icon";

// Material Dashboard 2 PRO React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDAvatar from "components/MDAvatar";

import { BarChart, Speed, Timeline } from "@mui/icons-material";

// Custom styles for CustomComplexProjectCard
function CustomComplexProjectCard({ color, title, children, icon, image }) {

  const getIcon = () => {
    if (icon === "line") {
      return <Timeline fontSize="medium" />;
    } else if (icon === "gauge") {
      return <Speed fontSize="medium" />;
    } else if (icon === "bar") {
      return <BarChart fontSize="medium" />;
    }; 
  }

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
            {getIcon()}
          </MDAvatar>
          <MDBox ml={2} mt={-1} lineHeight={0}>
            <MDTypography variant="h5" fontWeight="medium">
              {title}
            </MDTypography>
          </MDBox>
        </MDBox>
        <MDBox p={2}>
          {children}
        </MDBox>
      </MDBox>
    </Card>
  );
}

// Setting default values for the props of CustomComplexProjectCard
CustomComplexProjectCard.defaultProps = {
  color: "dark",
};

// Typechecking props for the ProfileInfoCard
CustomComplexProjectCard.propTypes = {
  color: PropTypes.oneOf([
    "primary",
    "secondary",
    "info",
    "success",
    "warning",
    "error",
    "dark",
    "light",
  ]),
  icon: PropTypes.oneOf([
    "line",
    "gauge",
  ]),
  title: PropTypes.string.isRequired,
};

export default CustomComplexProjectCard;
