import React from "react";
import { Grid } from "@mui/material";
import CustomComplexProjectCard from "views/Components/CustomComplexProjectCard";
import EchartComp from "./EchartComp";
import ChartGaugeV3 from "views/Components/Chart/ChartGauge/ChartGaugeV3";

function Charts({
  coreGauge,
  coreNodes,
  tableNames,
  reqData,
  reqLoading,
  setReqComplete,
  setReqLoading,
}) {
  return (
    <>
      <Grid container spacing={4} sx={{ mb: 4 }}>
        <Grid item xs={12} >
          <ChartGaugeV3 title={"CPU Core"} dataGauge={coreGauge} gaugeItems={coreNodes} />
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
