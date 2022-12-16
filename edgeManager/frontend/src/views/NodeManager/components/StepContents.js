import React from 'react';

// Material Dashboard 2 PRO React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import LogBox from './LogBox';
import StepContentsInfo from './StepContentsInfo';
import { Box } from '@mui/material';
import DialogComp from './DialogComp';

function StepContents({
  title,
  onExcuteBTN,
  stepContentData,
}) {
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [contentData, setContentData] = React.useState(stepContentData);

  // React.useState(() => {
  //   console.log("dialogOpen: ", dialogOpen);
  // }, [dialogOpen]);

  const onEditBTN = () => {
    setDialogOpen(true);
  };

  const handleOnClose = () => {
    setDialogOpen(false);
  };

  return (
    <>
      <MDBox
        display="flex"
        justifyContent="space-between"
      >
        <MDTypography variant="h5">{title}</MDTypography>
        <MDBox>
          <MDButton variant="text" color="dark" onClick={onEditBTN}>edit</MDButton>
          <MDButton variant="text" color="error" onClick={onExcuteBTN}>execute</MDButton>
        </MDBox>
      </MDBox>
      <MDBox px={3}>
        {/* text box */}
        <MDBox mt={1} >
          {/* {InfoData.map((data, idx) => {
            return <StepContentsInfo key={`${data}_${idx}`} infoKey={data} infoVal={data} />
          })} */}
          {contentData && Object.keys(contentData).map((infoKey, idx) => {
            return <StepContentsInfo key={`${infoKey}_${idx}`} infoKey={infoKey} infoVal={contentData[infoKey]} />
          })}
          {/* log box */}
          <MDBox mt={2} />
          <LogBox />
        </MDBox>
      </MDBox>
      <MDBox my={3} px={3}>
        <Box height="1px" borderBottom="1px solid #e0e0e0" />
        {/* <Divider /> */}
      </MDBox>
      <DialogComp
        dialogOpen={dialogOpen}
        setDialogOpen={setDialogOpen}
        handleOnClose={handleOnClose}
        contentData={contentData}
        setContentData={setContentData}
      />
    </>
  );
}

export default StepContents;