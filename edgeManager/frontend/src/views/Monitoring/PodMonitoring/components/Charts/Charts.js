import React from "react";
import { Grid } from "@mui/material";
import CustomComplexProjectCard from "views/Components/CustomComplexProjectCard";
import EchartComp from "./EchartComp";

function Charts({
  tableNames,
  reqData,
  reqLoading,
  setReqComplete,
  setReqLoading,
}) {
  return (
    <>
      <Grid container spacing={4} sx={{ mb: 4 }}>
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
