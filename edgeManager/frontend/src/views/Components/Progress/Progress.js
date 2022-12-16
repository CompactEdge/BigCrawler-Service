import * as React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';


export default function Progress({ isLoading }) {

  return (
    <Dialog
    sx={{
      textAlign: "center",
      overflow: "auto",
      alignItems: "unset",
      justifyContent: "unset",
    }}
    open={isLoading}
    aria-labelledby="classic-modal-slide-title"
    aria-describedby="classic-modal-slide-description"
    fullWidth
    PaperProps={{
      style: { backgroundColor: "transparent", boxShadow: "none" },
    }}
  >
    <DialogContent
      id="classic-modal-slide-description"
      sx={{
        paddingTop: "24px",
        paddingRight: "24px",
        paddingBottom: "16px",
        paddingLeft: "24px",
        position: "relative",
        overflow: "visible",
      }}
    >
      <CircularProgress color="info"/>
    </DialogContent>
  </Dialog>
  );
}
