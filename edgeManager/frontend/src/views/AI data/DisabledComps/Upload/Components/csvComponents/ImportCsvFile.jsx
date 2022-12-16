import React, { useLayoutEffect, useState } from "react";
import {
  Checkbox,
  List,
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
  Grid,
  Typography,
} from "@mui/material";
import { grey } from "@mui/material/colors";
import { useDropzone } from "react-dropzone";
import styled from "styled-components";
import Papa from "papaparse";
import oc from "open-color";
import Loader from "../csvInfo/Loader";
import ListForm from "./ListForm";
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";

// style
const FixedSizeList = styled.div`
  max-height: 300px;
  overflow-y: auto;
  margin-bottom: 1rem;
`;

const DropFileContainer = styled.div`
  border: 2px dashed ${grey["500"]};
  width: 100%;
  display: flex;
  align-items: center;
  margin-bottom: 0.5rem;
  justify-content: center;
  padding: 20px 0;

  & > * {
    margin: 0;
    font-weight: bold;
    color: ${oc.gray[6]};
    pointer-events: none;
    user-select: none;
  }
`;
const AvatarStyle = {
  margin: 0,
  display: "flex",
};
const headerStyle = {
  borderBottom: `1px solid ${oc.gray[4]}`,
  cursor: "default",
  userSelect: "none",
  marginBottom: "0.3rem",
  background: oc.gray[2],
};

const deleteIcon = {
  color: oc.gray[5],
};
const SelectState = styled.span`
  margin-right: 10px;
  font-size: 16px;
  font-weight: 600;
  color: ${oc.gray[6]};
`;

export default function ImportCsvFile({
  handleOnAddFile,
  handleOnRemoveFile,
  csvFiles,
  setCsvFiles,
  inputRef,
  dffIndex,
  setDffIndex,
  setModelInfoLoad,
  setJsonData,
  setOtherFiles,
  setModalState,
  setModalAlert,
  setMissingKeys,
}) {
  const [check, setCheck] = useState([]);
  const [load, setLoad] = useState(false);
  const [firstFileColumn, setFirstFileColumn] = useState([]);
  const [jsonErr, setJsonErr] = useState(false);

  // React.useEffect(() => {
  //   console.log("check:", check);
  // }, [check]);

  // React.useEffect(() => {
  //   console.log("inputRef:", inputRef.current);
  // }, [inputRef]);

  // React.useEffect(() => {
  //   console.log("jsonErr:", jsonErr);
  // }, [jsonErr]);

  React.useEffect(() => {
    const names = [];
    if (!jsonErr) {
      csvFiles.map((file, idx) => {
        names[idx] = file.name;
      });
      if (names.includes("manifest.json")) {
        setModelInfoLoad(true);
      } else {
        setModelInfoLoad(false);
      }
    }
  }, [csvFiles]);

  // 1번째 파일 column
  // encoding
  const encoding = "utf-8";
  // 파일 크기 표시
  const byte = (bytes, decimals = 2) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
  };

  // 파일 업로드 하는 로직 모든 inputs.files는 같은 파일 목록을 가짐
  const onDrop = (acceptedFiles) => {
    setJsonErr(false);
    setLoad(true);
    setCheck([]);
    const dataTransfer = new DataTransfer();
    const otherFiles = [];
    const allFiles = [];
    acceptedFiles.map((file) => {
      if (file.name !== ".DS_Store") {
        allFiles.push(file);
        dataTransfer.items.add(file);
        // manifest
        if (file.name === "manifest.json") {
          let reader = new FileReader();
          reader.onload = function (event) {
            try {
              const jsonObj = JSON.parse(event.target.result);
              // console.log("jsonObj: ", jsonObj);
              // 필수 key 체크
              let keys = Object.keys(jsonObj);
              if (!keys.includes("fileName")) {
                alert(`Missing required key: fileName`);
                setMissingKeys("fileName");
              } else {
                setJsonData({ ...jsonObj });
              }
            } catch (SyntaxError) {
              console.log(SyntaxError);
              alert("손상된 파일입니다.")
              setCsvFiles([]);
              setJsonErr(true);
            }
          };
          reader.readAsText(file);
        } else {
          // other files
          otherFiles.push(file);
        }
      }
    });
    inputRef.current.map((inputs) => {
      inputs.files = dataTransfer.files;
    });
    setOtherFiles(otherFiles);
    handleOnAddFile(allFiles);
  };

  // checkbox toggle
  const handleToggle = (value) => {
    const currentIndex = check.indexOf(value);
    const newChecked = [...check];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }
    setCheck(newChecked);
  };
  // remove files from icon
  const deleteList = (val) => {
    if (val.name === "manifest.json") {
      // setModelInfoLoad(false);
    }
    const dataTransfer = new DataTransfer();
    setLoad(true);
    if (csvFiles.length !== 1) {
      const files = csvFiles.filter((file) => file.name !== val.name);
      setCsvFiles(files);
      setCheck(check.filter((file) => file.name !== val.name));
      files.map((file) => dataTransfer.items.add(file));
      inputRef.current.map((inputs) => {
        inputs.files = dataTransfer.files;
      });
    } else {
      handleOnRemoveFile();
    }
  };
  //remove checked files
  const removeCheckFiles = () => {
    if (csvFiles.length !== 0) {
      setLoad(true);
      const dataTransfer = new DataTransfer();
      let dff = csvFiles.filter((x) => !check.includes(x));
      // 리스트에 남은 데이터
      if (!dff.includes("manifest.json")) {
        // setModelInfoLoad(false);
      }
      setCsvFiles(dff);
      setCheck([]);
      if (dff.length === 0) handleOnRemoveFile();
      dff.map((files) => dataTransfer.items.add(files));
      inputRef.current.map((inputs) => {
        inputs.files = dataTransfer.files;
      });
    }
  };
  //select all files
  const handleSelectAll = () => {
    if (csvFiles.length !== check.length) {
      setCheck(csvFiles);
    } else {
      setCheck([]);
    }
  };

  // reload files
  const resetFiles = () => {
    setJsonData({});
    setModelInfoLoad(false);
    inputRef.current.map((inputs) => {
      inputs.value = "";
    });
  };

  // 함수 실행 후 렌더링 (useEffect는 렌더후 실행)
  useLayoutEffect(() => {
    setLoad(false);
  }, [csvFiles]);

  useLayoutEffect(() => {
    if (csvFiles.length !== 0) {
      csvHeader();
    }
  }, [csvFiles]);

  useLayoutEffect(() => {
    if (dffIndex.length !== 0) setDffIndex([]);
    if (firstFileColumn.length !== 0) {
      csvFiles.map((file, index) => {
        if (index !== 0)
          Papa.parse(file.slice(0, 1024), {
            encoding,
            complete: (result) => {
              const temp = result.data.slice(0, 1)[0];
              const intersection = firstFileColumn.filter(
                (el) => !temp.includes(el)
              );
              if (intersection.length !== 0) {
                //목록 살리기
                setDffIndex((prev) => [...prev, file]);
                //지우기
                // setFiles((prev) => prev.filter((x) => x !== file));
              }
            },
          });
      });
    }
  }, [firstFileColumn]);

  const csvHeader = () => {
    Papa.parse(csvFiles[0].slice(0, 1024 * 1024 * 30), {
      encoding,
      complete: (result) => {
        const fstCol = result.data.slice(0, 1)[0];
        // if (fstCol.filter((f) => !firstFileColumn.includes(f)).length !== 0)
        setFirstFileColumn(fstCol);
      },
    });
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    noClick: true,
  });

  const selectList = () => {
    if (csvFiles.length !== 0 && !jsonErr) {
      return (
        <MDBox mt={1} width="100%">
          <Grid item xs={12}>
            <List dense={true}>
              <ListItem style={headerStyle} onClick={() => handleSelectAll()}>
                <ListItemIcon style={AvatarStyle}>
                  <Checkbox
                    indeterminate={
                      check.length !== 0 && check.length !== csvFiles.length
                        ? true
                        : false
                    }
                    checked={
                      csvFiles.length === check.length && csvFiles.length !== 0
                    }
                    onChange={() => handleSelectAll()}
                    name="checkedB"
                    color="secondary"
                  />
                </ListItemIcon>
                <ListItemText
                  primary={
                    csvFiles.length === check.length && csvFiles.length !== 0
                      ? "Deselect All"
                      : "Select All"
                  }
                />
                <ListItemSecondaryAction>
                  <SelectState>selected {check.length}</SelectState>
                </ListItemSecondaryAction>
              </ListItem>
              <FixedSizeList>
                {csvFiles.map((val, index) => {
                  const labelId = `checkbox-list-label-${val}`;
                  return (
                    <ListForm
                      key={index}
                      deleteList={deleteList}
                      check={check}
                      val={val}
                      index={index}
                      handleToggle={handleToggle}
                      AvatarStyle={AvatarStyle}
                      load={load}
                      deleteIcon={deleteIcon}
                      labelId={labelId}
                      byte={byte}
                    />
                  );
                })}
              </FixedSizeList>
            </List>
          </Grid >
          <Grid item xs={12}>
            <Grid
              container
              display="flex"
              alignItems="center"
              justifyContent="flex-end"
            >
              <MDButton
                varient="gradient"
                color="info"
                onClick={() => removeCheckFiles()}
                disabled={check.length === 0}
              >
                delete
              </MDButton>
            </Grid>
          </Grid >
        </MDBox>
      );
    } else {
      return (<></>);
    }
  };

  return (
    <>
      <Loader open={load} />
      <Grid container>
        <Grid item xs={12}>
          <DropFileContainer {...getRootProps()}>
            <input {...getInputProps()} />
            {isDragActive ? (
              <Typography variant="subtitle2" mb={4}>Drag here!</Typography>
            ) : (
              <Typography variant="subtitle2" mb={4}>Drag a file or folder here.</Typography>
            )}
          </DropFileContainer>
        </Grid >
      </Grid>
      <Grid
        container
        display="flex"
        alignItems="center"
        justifyContent="flex-end"
        spacing={1}
      >
        <Grid item>
          <MDButton
            variant="gradient"
            color="info"
            onClick={() => inputRef.current[0].click()}
          >
            <input
              type="file"
              multiple="multiple"
              id="file"
              ref={(el) => (inputRef.current[0] = el)}
              style={{
                display: "none",
              }}
              onClick={resetFiles}
              onChange={(e) => {
                const acceptedFiles = Object.values(e.target.files);
                onDrop(acceptedFiles);
              }}
            />
            file
          </MDButton>
        </Grid >
        <Grid item>
          <MDButton
            variant="gradient"
            color="info"
            onClick={() => inputRef.current[1].click()}
          >
            <input
              type="file"
              multiple="multiple"
              webkitdirectory="true"
              id="file"
              ref={(el) => (inputRef.current[1] = el)}
              style={{
                display: "none",
              }}
              onClick={resetFiles}
              onChange={(e) => {
                const acceptedFiles = Object.values(e.target.files);
                onDrop(acceptedFiles);
              }}
            />
            folder
          </MDButton>
        </Grid >
        {selectList()}
      </Grid>
    </>
  );
}
