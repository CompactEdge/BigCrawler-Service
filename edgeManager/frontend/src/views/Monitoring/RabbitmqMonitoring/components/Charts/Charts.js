import React from "react";
import { Grid } from "@mui/material";
import CustomComplexProjectCard from "views/Components/CustomComplexProjectCard";
import EchartComp from "./EchartComp";
import MDBox from "components/MDBox";
import NumberComp from "./NumberComp";

function Charts({
  tableNames,
  reqData,
  reqLoading,
  setReqComplete,
  setReqLoading,
}) {

  const getChart = (item, index) => {
    if (item === "Publishers" || item === "Consumers" || item === "Channels" || item === "Nodes") {
      return (
        <Grid item key={`chart_${index}_${item}`} xs={12} sm={3}>
          <NumberComp
            color="dark"
            icon="weekend"
            title={item}
            count={281}
            percentage={{
              color: "success",
              amount: "+55%",
              label: "than lask week",
            }}
            item={item}
            reqData={reqData}
            reqLoading={reqLoading}
            setReqComplete={setReqComplete}
            setReqLoading={setReqLoading}
          />
        </Grid>
      )
    } else {
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
      )
    }
  }

  return (
    <>
      <Grid container spacing={4} sx={{ mb: 0 }}>
        {tableNames && tableNames.map((item, index) => {
          return getChart(item, index);
        })}
      </Grid>
    </>
  );
}

export default Charts;
