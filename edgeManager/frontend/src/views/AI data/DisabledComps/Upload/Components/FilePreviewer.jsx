/* eslint-disable react/prop-types */
import React, { memo, useEffect, useRef, useState } from "react";
import {
  Grid,
  Dialog,
  DialogContent,
  DialogActions,
  DialogContentText,
  DialogTitle,
  Card,
} from "@mui/material";
import axios from "axios";
import Papa from "papaparse";
import ImportCsvFile from "./csvComponents/ImportCsvFile";
import { defaultCsvData } from "./lib/defaultData";
import { green, orange } from "@mui/material/colors";
import ErrorOutlineIcon from "@mui/material/Icon";
import CheckCircleOutlineOutlined from "@mui/material/Icon";
import FileModelInfo from "../FileModelInfo";
import FileSubmit from "../FileSubmit";
import MDButton from "components/MDButton";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import Progress from "views/Components/Progress/Progress";
import * as config from "config";

let host = config.inferenceUrl;

const FilePreviewer = () => {
  const inputRef = useRef([]);
  const [dffIndex, setDffIndex] = useState([]);
  const [csvData, setCsvData] = useState(defaultCsvData);
  const [modelInfoLoad, setModelInfoLoad] = useState(false);
  const [otherFiles, setOtherFiles] = useState(false);
  const [jsonData, setJsonData] = useState([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [modalState, setModalState] = React.useState("");
  const [modalAlert, setModalAlert] = React.useState(false);
  const [missingKeys, setMissingKeys] = React.useState([]);
  const [csvFiles, setCsvFiles] = useState([]);

  // React.useEffect(() => {
  //   console.log("otherFiles:", otherFiles);
  // }, [otherFiles]);

  // useEffect(() => {
  //   setHideDataLoad(false);
  // }, []);

  // useEffect(() => {
  //   handleOnAddFile(csvFiles);
  // }, [csvFiles]);

  const handleOnAddFile = (_files) => {
    if (_files.length !== 0) {
      Papa.parse(_files[0].slice(0, 1024 * 1024 * 30), {
        encoding: "utf-8",
        complete: (results) => {
          const { data } = results;

          const rows = data.slice(1, data.length);

          const columns = data.slice(0, 1).map((v) =>
            v.map((val, idx) => {
              let data_type = "";

              for (let index = 0; index < rows.length; index++) {
                const value = rows[index];
                const index_value = value[idx] !== undefined ? value[idx] : -1;
                const index_value_isNaN = !isNaN(index_value);

                if (index_value_isNaN) {
                  data_type = "Float";
                } else {
                  data_type = "String";
                  break;
                }
              }

              return {
                index: idx,
                data_set: "field",
                data_type: data_type,
                value: val,
                data_format: "",
                data_func: [],
              };
            })
          );
          const columns2 = data.slice(0, 1).map((v) =>
            v.map((val, idx) => {
              let data_type = "";

              for (let index = 0; index < rows.length; index++) {
                const value = rows[index];
                const index_value = value[idx] !== undefined ? value[idx] : -1;
                const index_value_isNaN = !isNaN(index_value);

                if (index_value_isNaN) {
                  data_type = "Float";
                } else {
                  data_type = "String";
                  break;
                }
              }

              return {
                index: idx,
                data_set: "field",
                data_type: data_type,
                value: val,
                data_format: "",
                data_func: [],
              };
            })
          );

          const table = {
            columns: columns,
            origin_columns: columns2,
            rows: rows,
          };

          setCsvData(table);
          setCsvFiles(_files);
        },
        error: (error) => {
          console.log(error);
          setCsvFiles([]);
        },
      });
    }
  };

  const handleOnRemoveFile = () => {
    setCsvData(defaultCsvData);
    setCsvFiles([]);
    inputRef.current.map((inputs) => {
      inputs.value = "";
    });
  };

  // submit
  const handleSubmit = () => {
    setIsLoading(true);
    filesUpload();
  };

  const filesUpload = () => {
    // files parameter
    if (otherFiles && jsonData) {

      const formData = new FormData();
      otherFiles.map((file) => {
        formData.append("image", file);
      });
      // json string 으로 바꾸기
      // formData.append("meta", new Blob([JSON.stringify(jsonData)], { type: "application/json" }));
      formData.append("meta", JSON.stringify(jsonData));

      console.log("111: ", formData.get("image"));
      console.log("222: ", formData.get("meta"));

      axios
        .post(`${host}/rest/1.0/inference/upload`, formData)
        .then((res) => {
          if (res.status === 200) {
            setIsLoading(false);
            alert("업로드가 완료되었습니다.");
            setModelInfoLoad(false);
            setJsonData([]);
            setCsvFiles([]);
          } else {
            setIsLoading(false);
            alert("업로드에 실패했습니다.");
          }
        })
        .catch((err) => {
          setIsLoading(false);
          console.log("err1: ", err);
          // alert("업로드에 실패했습니다.");
        });
    }
  };

  const handleClose = (type) => {
    if (type === "version") {
      setOpen(false);
    } else if (type === "upload") {
      setModalAlert(false);
    }
  };

  const modalType = () => {
    if (modalState === "upload") {
      return (
        <>
          <CheckCircleOutlineOutlined style={{ color: green[500], fontSize: 30, marginRight: 6, marginBottom: 10 }} />
          <DialogContentText id="alert-dialog-description">
            Upload successfully.
          </DialogContentText>
        </>
      );
    } else if (modalState === "uploadError") {
      return (
        <>
          <ErrorOutlineIcon style={{ color: orange[500], fontSize: 30, marginRight: 6, marginBottom: 10 }} />
          <DialogContentText id="alert-dialog-description">
            Upload failed.
          </DialogContentText>
        </>
      );
    }
  };

  return (
    <>
      <Card>
        <MDBox p={3}>
          <MDTypography variant="h5" fontWeight="medium" mb={4}>UPLOADING</MDTypography>
          <ImportCsvFile
            handleOnAddFile={handleOnAddFile}
            handleOnRemoveFile={handleOnRemoveFile}
            csvFiles={csvFiles}
            setCsvFiles={setCsvFiles}
            inputRef={inputRef}
            dffIndex={dffIndex}
            setDffIndex={setDffIndex}
            setModelInfoLoad={setModelInfoLoad}
            setJsonData={setJsonData}
            setOtherFiles={setOtherFiles}
            setModalState={setModalState}
            setModalAlert={setModalAlert}
            setMissingKeys={setMissingKeys}
          />
        </MDBox>
      </Card>
      {modelInfoLoad ? (
        <MDBox mt={3}>
          <Card>
            <MDBox p={3}>
              <MDTypography variant="h5" fontWeight="medium" mb={4}>FILE MODEL</MDTypography>
              <FileModelInfo
                jsonData={jsonData}
                setJsonData={setJsonData}
                handleSubmit={handleSubmit}
              />
              <Grid item xs={12} sm={12} md={12}>
              </Grid>
              <FileSubmit
                handleSubmit={handleSubmit}
                jsonData={jsonData}
                setJsonData={setJsonData}
              />
            </MDBox>
          </Card>
        </MDBox>
      ) : null}
      <Dialog
        open={modalAlert}
        onClose={() => { handleClose("upload") }}
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
          <MDButton onClick={() => { handleClose("upload") }} variant="contained" color="info">
            OK
          </MDButton>
        </DialogActions>
      </Dialog>
      <Progress isLoading={isLoading} />
    </>
  );
};

export default memo(FilePreviewer);
