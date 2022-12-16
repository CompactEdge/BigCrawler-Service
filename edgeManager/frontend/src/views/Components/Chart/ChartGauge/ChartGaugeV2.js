import React from "react";
import { Grid } from "@mui/material";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import { blue, grey } from '@mui/material/colors';
import CustomChartGauge from "./CustomChartGauge";
import CustomComplexProjectCard from "views/Components/CustomComplexProjectCard";

function ChartGaugeV2({
  title,
  dataGauge, // cpuGauge, memoryGauge
  gaugeItems,
}) {

  // const gaugeItems = ["edge-m1", "edge-w1", "edge-w2", "edge-w3", "edge-w4", "edge-w5", "edge-w6", "edge-w7"];
  // const gaugeItems1 = ["edge-m1", "edge-w1", "edge-w2", "edge-w3"];
  // const gaugeItems2 = ["edge-w4", "edge-w5", "edge-w6", "edge-w7"];

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
      <Grid container
        sx={{
          display: "flex",
          justifyContent: "flex-start",
          alignItems: "center",
        }}
      >
        {gaugeItems.map((item, index) => {
          return (
            <Grid item
              width="155px"
              height="180px"
              key={`cpuChart_${index}_${item}`}
            >
              <MDBox
                sx={{
                  position: "relative",
                  top: "-70px",
                  left: "0px",
                }}
              >
                <CustomChartGauge
                  name={item}
                  value={getGaugeValue(item)}
                  color={blue[800]}
                />
              </MDBox>
              <MDBox
                textAlign="center"
                pt={2}
                sx={{
                  position: "relative",
                  top: "-170px",
                  left: "0px",
                }}
              >
                <MDTypography variant="body2" sx={{ color: grey[900] }} >
                  {item}
                </MDTypography>
              </MDBox>
            </Grid>
          );
        })}
      </Grid>
    </CustomComplexProjectCard>
  );
}

export default ChartGaugeV2;