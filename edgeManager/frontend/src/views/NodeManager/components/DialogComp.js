import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  TextField,
  DialogActions,
  IconButton,
} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import MDBox from 'components/MDBox';
import MDButton from 'components/MDButton';

function DialogComp({
  dialogOpen,
  setDialogOpen,
  handleOnClose,
  contentData,
  setContentData
}) {

  const handleOnChange = (e) => {
    let infoKey = e.target.name;
    setContentData({ ...contentData, [infoKey]: e.target.value });
  };

  return (
    <>
      <Dialog
        fullWidth
        open={dialogOpen}
        onClose={handleOnClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <MDBox display="flex" justifyContent="space-between">
          <DialogTitle id="alert-dialog-title">Edit</DialogTitle>
          <IconButton
            aria-label="close"
            color="inherit"
            onClick={() => {
              setDialogOpen(false);
            }}
          >
            <CloseIcon />
          </IconButton>
        </MDBox>
        <DialogContent dividers>
          {contentData && Object.keys(contentData).map((infoKey, idx) => {
            return (
              <MDBox key={`${infoKey}_${idx}`} mb={2}>
                <DialogContentText id="alert-dialog-description">
                  {infoKey}
                </DialogContentText>
                <TextField
                  fullWidth
                  name={infoKey}
                  value={contentData[infoKey]}
                  id="outlined-size-small"
                  variant="outlined"
                  onChange={handleOnChange}
                >
                </TextField>
              </MDBox>
            )
          })}
        </DialogContent>

        <DialogActions>
          <MDButton variant="gradient" color="info" onClick={handleOnClose}>Save</MDButton>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default DialogComp;