import React from 'react';
import MDBox from 'components/MDBox';

const styleComp = {
  font: {
    size: "14px",
    lineSpace: 0,
  }
};

function StepContentsInfo({infoKey, infoVal}) {
  return (
    <MDBox mb={styleComp.font.lineSpace} display="flex">
      <MDBox fontSize={styleComp.font.size} color="text" >
        {infoKey}
      </MDBox>
      <MDBox ml={1} fontSize={styleComp.font.size} fontWeight="bold">
        {infoVal}
      </MDBox>
    </MDBox>
  );
}

export default StepContentsInfo;