import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Grid,
  TextField,
  Autocomplete,
} from "@mui/material";
import MDButton from 'components/MDButton';
import { orange, green } from '@mui/material/colors';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';

import PropTypes from "prop-types";
import MDBox from 'components/MDBox';

function DialogComp({
  type,
  modalCreate,
  setModalCreate,
  modalDelete,
  setModalDelete,
  modalState,
  setModalState,
  modalAlert,
  setModalAlert,
  destinationData,
  imageName,
  selectedName,
  sourceData,
  handleCreateBtn,
  handleDeleteBtn,
  inputName,
  setInputName,
  inputPort,
  setInputPort,
  inputReplicas,
  setInputReplicas,
  inputType,
  setInputType,
  inputSelector,
  setInputSelector,
  inputTargetPort,
  setInputTargetPort,
  inputNodePort,
  setInputNodePort,
}) {

  const typeList = ["ClusterIP", "NodePort", "LoadBalancer"];

  const modalType = () => {
    if (modalState === "namespace") {
      return (
        <>
          <ErrorOutlineIcon style={{ color: orange[500], fontSize: 30, marginRight: 6, marginBottom: 10 }} />
          <DialogContentText id="alert-dialog-description">
            {/* Please select namespace. */}
            namespace를 선택해주세요.
          </DialogContentText>
        </>
      );
    } else if (modalState === "inputName") {
      return (
        <>
          <ErrorOutlineIcon style={{ color: orange[500], fontSize: 30, marginRight: 6, marginBottom: 10 }} />
          <DialogContentText id="alert-dialog-description">
            {/* Please enter a POD name. */}
            배포할 이름을 입력해주세요.
          </DialogContentText>
        </>
      );
    } else if (modalState === "ok") {
      return (
        <>
          <CheckCircleOutlineOutlinedIcon style={{ color: green[500], fontSize: 30, marginRight: 6, marginBottom: 10 }} />
          <DialogContentText id="alert-dialog-description">
            {/* Deployment is complete. */}
            배포가 완료됐습니다.
          </DialogContentText>
        </>
      );
    } else if (modalState === "fail") {
      return (
        <>
          <ErrorOutlineIcon style={{ color: orange[500], fontSize: 30, marginRight: 6, marginBottom: 10 }} />
          <DialogContentText id="alert-dialog-description">
            {/* Deployment failed. */}
            배포에 실패했습니다.
          </DialogContentText>
        </>
      );
    } else if (modalState === "regex") {
      return (
        <>
          <ErrorOutlineIcon style={{ color: orange[500], fontSize: 30, marginRight: 6, marginBottom: 10 }} />
          <DialogContentText id="alert-dialog-description">
            {/* The character format does not fit. */}
            형식에 맞지 않습니다.
          </DialogContentText>
        </>
      );
    } else if (modalState === "delete") {
      return (
        <>
          <CheckCircleOutlineOutlinedIcon style={{ color: green[500], fontSize: 30, marginRight: 6, marginBottom: 10 }} />
          <DialogContentText id="alert-dialog-description">
            {/* Deleted successfully. */}
            삭제가 완료됐습니다.
          </DialogContentText>
        </>
      );
    } else if (modalState === "deleteError") {
      return (
        <>
          <ErrorOutlineIcon style={{ color: orange[500], fontSize: 30, marginRight: 6, marginBottom: 10 }} />
          <DialogContentText id="alert-dialog-description">
            {/* Delete failed. */}
            삭제에 실패했습니다.
          </DialogContentText>
        </>
      );
    }
  };

  const handleClose = (close) => {
    if (close === "alert") {
      setModalAlert(false);
    } else if (close === "delete") {
      setModalDelete(false);
    } else if (close === "create") {
      setModalCreate(false);
      setInputName();
      if (type === "deployment") {
        setInputPort();
        setInputReplicas();
      } else if (type === "service") {
      }
    }
  };

  // function InputBoxStyle({
  //   iKey, inputName
  // }) {
  //   return (
  //     <>
  //       <MDBox mb={2}>
  //         <DialogContentText id="alert-dialog-description">
  //           {iKey}
  //         </DialogContentText>
  //         <TextField
  //           fullWidth
  //           value={inputName || ""}
  //           id="outlined-size-small"
  //           variant="outlined"
  //           onChange={handleOnChangeName}
  //         >
  //         </TextField>
  //       </MDBox>
  //     </>
  //   );
  // };

  const getDialogContent = () => {
    if (type === "pod") {
      return (
        <>
          <DialogTitle id="alert-dialog-title">{`Pod 배포`}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              {destinationData ? `${imageName}를 ${destinationData["droppableId"]}에 배포할 이름을 입력하세요.` : ""}
            </DialogContentText>
            <TextField
              fullWidth
              value={inputName || ""}
              id="outlined-size-small"
              variant="outlined"
              onChange={handleOnChangeName}
            >
            </TextField>
          </DialogContent>
        </>
      );
    } else if (type === "deployment") {
      return (
        <>
          <DialogTitle id="alert-dialog-title">{`deployment 배포`}</DialogTitle>
          <DialogContent>
            <MDBox mb={2}>
              <DialogContentText id="alert-dialog-description">
                {destinationData ? `${imageName}를 ${destinationData["droppableId"]}에 배포하시겠습니까?` : ""}
              </DialogContentText>
            </MDBox>
            <MDBox mb={2}>
              <DialogContentText id="alert-dialog-description">
                deploymentName
              </DialogContentText>
              <TextField
                fullWidth
                value={inputName || ""}
                id="outlined-size-small"
                variant="outlined"
                onChange={handleOnChangeName}
              >
              </TextField>
            </MDBox>
            <MDBox mb={2}>
              <DialogContentText id="alert-dialog-description">
                containerPort
              </DialogContentText>
              <TextField
                fullWidth
                value={inputPort || ""}
                id="outlined-size-small"
                variant="outlined"
                onChange={handleOnChangePort}
              >
              </TextField>
            </MDBox>
            <MDBox>
              <DialogContentText id="alert-dialog-description">
                replicas
              </DialogContentText>
              <TextField
                fullWidth
                value={inputReplicas || ""}
                id="outlined-size-small"
                variant="outlined"
                onChange={handleOnChangeReplicas}
              >
              </TextField>
            </MDBox>
          </DialogContent>
        </>
      );
    } else if (type === "service") {
      return (
        <>
          <DialogTitle id="alert-dialog-title">{`service 배포`}</DialogTitle>
          <DialogContent>
            <MDBox mb={2}>
              <DialogContentText id="alert-dialog-description">
                {destinationData ? `${imageName}를 ${destinationData["droppableId"]}에 배포하시겠습니까?` : ""}
              </DialogContentText>
            </MDBox>
            {/* <InputBoxStyle iKey={"serviceName"} inputName={inputName} /> */}
            <MDBox mb={2}>
              <DialogContentText id="alert-dialog-description">
                name
              </DialogContentText>
              <TextField
                fullWidth
                value={inputName || ""}
                id="outlined-size-small"
                variant="outlined"
                onChange={handleOnChangeName}
              >
              </TextField>
            </MDBox>
            <MDBox mb={2}>
              <DialogContentText id="alert-dialog-description">
                type
              </DialogContentText>
              <Autocomplete
                size="medium"
                disableClearable
                disablePortal
                value={inputType}
                options={typeList}
                onInputChange={(e) => {
                  if (e) {
                    const inputTypeTmp = e.target.innerText;
                    setInputType(inputTypeTmp);
                  }
                }}
                renderInput={(params) => <TextField {...params} sx={{ width: "100%" }} />}
              />
            </MDBox>
            <MDBox mb={2}>
              <DialogContentText id="alert-dialog-description">
                selector
              </DialogContentText>
              <TextField
                fullWidth
                disabled
                value={inputSelector || ""}
                id="outlined-size-small"
                variant="outlined"
                onChange={handleOnChangeSelector}
              >
              </TextField>
            </MDBox>
            <MDBox mb={2}>
              <DialogContentText id="alert-dialog-description">
                port
              </DialogContentText>
              <TextField
                fullWidth
                value={inputPort || ""}
                id="outlined-size-small"
                variant="outlined"
                onChange={handleOnChangePort}
              >
              </TextField>
            </MDBox>
            <MDBox mb={2}>
              <DialogContentText id="alert-dialog-description">
                targetPort
              </DialogContentText>
              <TextField
                fullWidth
                value={inputTargetPort || ""}
                id="outlined-size-small"
                variant="outlined"
                onChange={handleOnChangeTargetPort}
              >
              </TextField>
            </MDBox>
            <MDBox mb={2}>
              <DialogContentText id="alert-dialog-description">
                nodePort
              </DialogContentText>
              <TextField
                fullWidth
                disabled={inputType === "ClusterIP" || inputType === "LoadBalancer"}
                value={getNodePortVal()}
                id="outlined-size-small"
                variant="outlined"
                onChange={handleOnChangeNodePort}
              >
              </TextField>
            </MDBox>
          </DialogContent>
        </>
      );
    };
  };

  const getNodePortVal = () => {
    if (inputType === "ClusterIP" || inputType === "LoadBalancer") {
      return "none";
    };
    return inputNodePort;
  };

  const regexCheck = (e) => {
    const regex = /^[a-z|A-Z|0-9|\-]+$/;
    let text = e.target.value;
    if (!regex.test(text)) {
      // alert(`형식에 맞지 않습니다.`);
      setModalState("regex");
      setModalAlert(true);
    }
    text = text.replace(/[^A-Za-z0-9\-]/ig, "");
    return text;
  };

  const handleOnChangeName = (e) => {
    let text = regexCheck(e);
    setInputName(text);
  };
  const handleOnChangePort = (e) => {
    let text = regexCheck(e);
    setInputPort(text);
  };
  const handleOnChangeReplicas = (e) => {
    let text = regexCheck(e);
    setInputReplicas(text);
  };

  const handleOnChangeSelector = (e) => {
    // let text = regexCheck(e);
    setInputSelector(e.target.value);
  };
  const handleOnChangeTargetPort = (e) => {
    let text = regexCheck(e);
    setInputTargetPort(text);
  };
  const handleOnChangeNodePort = (e) => {
    let text = regexCheck(e);
    setInputNodePort(text);
  };

  return (
    <>
      <Dialog
        open={modalAlert}
        onClose={() => { handleClose("alert") }}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{""}</DialogTitle>
        <DialogContent>
          <Grid container display="flex" justifycontent="flex-start" alignItems="center">
            {modalType()}
          </Grid>
        </DialogContent>
        <DialogActions>
          <MDButton onClick={() => { handleClose("alert") }} variant="contained" color="info">
            OK
          </MDButton>
        </DialogActions>
      </Dialog>

      <Dialog
        fullWidth
        open={modalCreate}
        onClose={() => { handleClose("create") }}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        {getDialogContent()}
        <DialogActions>
          <MDButton variant="contained" onClick={handleCreateBtn} color="info">
            배포
          </MDButton>
          <MDButton variant="contained" onClick={() => { handleClose("create") }} color="dark">
            취소
          </MDButton>
        </DialogActions>
      </Dialog>

      <Dialog
        fullWidth
        open={modalDelete}
        onClose={() => { handleClose("delete") }}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{type === "pod" ? "Pod 제거" : "Deployment 제거"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {selectedName}를 {sourceData.droppableId}에서 제거하시겠습니까?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <MDButton variant="contained" onClick={handleDeleteBtn} color="info">
            확인
          </MDButton>
          <MDButton variant="contained" onClick={() => { handleClose("delete") }} color="dark">
            취소
          </MDButton>
        </DialogActions>
      </Dialog>
    </>
  );
}

// Setting default values for the props of BubbleChart
DialogComp.defaultProps = {
  type: "pod",
};

// Typechecking props for the DefaultLineChart
DialogComp.propTypes = {
  type: PropTypes.string,
};

export default DialogComp;