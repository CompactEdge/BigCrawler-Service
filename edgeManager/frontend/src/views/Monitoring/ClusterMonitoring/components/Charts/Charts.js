import React from "react";
import { Grid } from "@mui/material";
import CustomComplexProjectCard from "views/Components/CustomComplexProjectCard";
import ChartGaugeV2 from "views/Components/Chart/ChartGauge/ChartGaugeV2";
import EchartComp from "./EchartComp";

function Charts({
  cpuGauge,
  memoryGauge,
  cpuNodes,
  memoryNodes,
  tableNames,
  reqData,
  reqLoading,
  setReqComplete,
  setReqLoading,
}) {
  // console.log("!! cpuNodes", cpuNodes);
  // console.log("!! memoryNodes", memoryNodes);
  return (
    <>
      <Grid container spacing={4} sx={{ mb: 4 }} >
        <Grid item xs={12} >
          <ChartGaugeV2 title={"CPU"} dataGauge={cpuGauge} gaugeItems={cpuNodes} />
        </Grid>
        <Grid item xs={12} >
          <ChartGaugeV2 title={"MEMORY"} dataGauge={memoryGauge} gaugeItems={memoryNodes} />
        </Grid>
        {tableNames && tableNames.map((item, index) => {
          return (
            <Grid item key={`chart_${index}_${item}`} xs={12} sm={6}>
              <CustomComplexProjectCard title={item} icon={"line"}>
                <EchartComp
                  item={item}
                  reqData={reqData}
                  reqLoading={reqLoading}
                  setReqComplete={setReqComplete}
                  setReqLoading={setReqLoading}
                />
              </CustomComplexProjectCard>
            </Grid>
          );
        })}

      </Grid>
    </>
  );
}

export default Charts;