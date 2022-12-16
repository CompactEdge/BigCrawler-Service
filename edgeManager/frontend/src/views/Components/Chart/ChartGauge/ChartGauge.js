import React from "react";
import {
  Box,
} from "@mui/material";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import { blue, grey } from '@mui/material/colors';
import CustomChartGauge from "./CustomChartGauge";
import CustomComplexProjectCard from "views/Components/CustomComplexProjectCard";

function ChartGauge({
  title,
  dataGauge, // cpuGauge, memoryGauge
}) {

  const gaugeItems1 = ["edge-m1", "edge-w1", "edge-w2", "edge-w3"];
  const gaugeItems2 = ["edge-w4", "edge-w5", "edge-w6", "edge-w7"];

  const getGaugeValue = (item) => {
    const data = dataGauge[item];
    let value = 0;
    if (data && data.length > 0) {
      value = data[0][1];
    }
    return value.toFixed(2);
  };

  return (
    <CustomComplexProjectCard title={title} icon="gauge">
      <MDBox
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexFlow: "wrap",
        }}
      >
        <MDBox
          sx={{
            flexGrow: "1",
            display: "flex",
            justifyContent: "space-around",
            alignItems: "center",
          }}
        >
          {gaugeItems1.map((item, index) => {
            return (
              <MDBox
                width="155px"
                height="180px"
                key={`cpuChart_${index}_${item}`}
              >
                <MDBox textAlign="center" pt={2}>
                  <MDTypography variant="body2" sx={{ color: grey[900] }} >
                    {item}
                  </MDTypography>
                </MDBox>
                <MDBox
                  sx={{
                    position: "relative",
                    top: "-85px",
                    left: "0px",
                  }}
                >
                  <CustomChartGauge
                    name={item}
                    value={getGaugeValue(item)}
                    color={blue[800]}
                  />
                </MDBox>
              </MDBox>
            );
          })}
        </MDBox>
        <MDBox
          sx={{
            flexGrow: "1",
            display: "flex",
            justifyContent: "space-around",
            alignItems: "center",
          }}
        >
          {gaugeItems2.map((item, index) => {
            return (
              <MDBox
                width="155px"
                height="180px"
                key={`cpuChart_${index}_${item}`}
              >
                <Box textAlign="center" paddingTop={2}>
                  <MDTypography variant="body2" sx={{ color: grey[900] }} >
                    {item}
                  </MDTypography>
                </Box>
                <MDBox
                  sx={{
                    position: "relative",
                    top: "-85px",
                    left: "0px",
                  }}
                >
                  <CustomChartGauge
                    name={item}
                    value={getGaugeValue(item)}
                    color={blue[800]}
                  />
                </MDBox>
              </MDBox>
            );
          })}
        </MDBox>
      </MDBox>
    </CustomComplexProjectCard>
  );
}

export default ChartGauge;