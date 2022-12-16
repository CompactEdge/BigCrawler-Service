import { Backdrop, CircularProgress } from "@mui/material";
import React from "react";
import { makeStyles } from "@mui/styles";
import styled from "styled-components";

const useStyles = makeStyles((theme) => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: "#fff",
  },
}));

const LoadStateWrap = styled.div`
  display: flex;
  flex-flow: column;
  justify-content: center;
`;
const UploadedRow = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 1rem;
  color: white;
  font-weight: bold;
`;
const CircularDiv = styled.div`
  display: flex;
  justify-content: center;
`;
// eslint-disable-next-line react/prop-types
export default function Loader({ open, socketThroughputed = null }) {
  const classes = useStyles();
  return (
    <Backdrop className={classes.backdrop} open={open}>
      <LoadStateWrap>
        <CircularDiv>
          <CircularProgress color="inherit" />
        </CircularDiv>
        {socketThroughputed !== null ? (
          <UploadedRow>
            {(socketThroughputed["throughputed_count"] || 0).toLocaleString(
              "ko-KR"
            )}
          </UploadedRow>
        ) : (
          <></>
        )}
      </LoadStateWrap>
    </Backdrop>
  );
}
