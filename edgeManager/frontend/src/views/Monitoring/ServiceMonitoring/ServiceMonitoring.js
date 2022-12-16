import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
// import TabPanel from '@mui/lab/TabPanel';
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "../../Components/DashboardNavbar";
import MDBox from "components/MDBox";
import CustomDataTable from "../../Components/DataTable/CustomDataTable";
import CustomIdCell from "../../Components/DataTable/CustomIdCell";
import axios from "axios";
import MDButton from "components/MDButton";
import ModalData from "../../Components/DetailModalComp/DetailModalComp";

function ServiceMonitoring(props) {
  const [rowData, setRowData] = useState({});
  const [rowData0, setRowData0] = useState([]);
  const [selectedValue, setSelectedValue] = React.useState();
  const [modalOpen, setModalOpen] = React.useState(false);
  const [modalData, setModalData] = React.useState({});
  const [nameSpace, setNameSpace] = React.useState(["all"]);
  const [nameSpaceVal, setNameSpaceVal] = useState("all");

  const columnData = [
    {
      Header: "", accessor: "id",
      Cell: ({ value }) => {
        return (
          <CustomIdCell
            id={value}
            selectedValue={selectedValue}
            setSelectedValue={setSelectedValue}
          />
        )
      },
      width: "5%"
    },
    { Header: "namespace", accessor: "namespace" },
    { Header: "name", accessor: "name" },
    { Header: "type", accessor: "type" },
    { Header: "cluster_ip", accessor: "cluster_ip" },
    { Header: "external_ip", accessor: "external_ip" },
    { Header: "ports", accessor: "ports" },
    { Header: "age", accessor: "age" },
    { Header: "selector", accessor: "selector" },
  ];

  useEffect(() => {
    axios("/rest/1.0/k8s/service")
      .then((res) => {
        let dataTmp = [];
        let nameSpaceTmp = ["all"];
        if (res.data.length > 0) {
          res.data.map((data, idx) => {
            dataTmp.push({ ...data, id: idx });
            if (!nameSpaceTmp.includes(data.namespace)) {
              nameSpaceTmp.push(data.namespace);
            };
          });
          setRowData(res.data);
          setRowData0(dataTmp);
          setNameSpace(nameSpaceTmp);
        };
      })
      .catch((err) => {
        console.log("err: ", err);
      });
  }, []);

  useEffect(() => {
    console.log("selectedValue: ", selectedValue);
    if (selectedValue) {
      setModalData(rowData[selectedValue]);
      setModalOpen(true);
    }
  }, [selectedValue]);

  // useEffect(() => {
  //   console.log("tableDataIdx: ", tableDataIdx);
  // }, [tableDataIdx]);

  // useEffect(() => {
  //   console.log("modalData:", modalData);
  // }, [modalData]);

  // useEffect(() => {
  //   console.log("rowData: ", rowData);
  // }, [rowData]);

  useEffect(() => {
    let url;
    if (nameSpaceVal === "all") {
      url = `/rest/1.0/k8s/service`
    } else {
      url = `/rest/1.0/k8s/service?namespace=${nameSpaceVal}`
    }
    axios(url)
      .then((res) => {
        let dataTmp = [];
        if (res.data.length > 0) {
          res.data.map((data, idx) => {
            dataTmp.push({ ...data, id: idx });
          });
          setRowData(res.data);
          setRowData0(dataTmp)
        }
      })
      .catch((err) => {
        console.log("err: ", err);
      });
    // setRowData(tableData);
  }, [nameSpaceVal]);

  const handleClose = (e) => {
    setModalOpen(false);
    setSelectedValue();
    setModalData({});
  };

  return (
    <>
      
      <MDBox mt={5}>
        <Card>
          <CustomDataTable
            table={{ columns: columnData, rows: rowData0 }}
            nameSpace={nameSpace}
            nameSpaceVal={nameSpaceVal}
            setNameSpaceVal={setNameSpaceVal}
          />
        </Card>
      </MDBox>
      <Dialog
        fullWidth
        open={modalOpen}
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
      >
        <DialogTitle
          id="customized-dialog-title"
          onClose={handleClose}
        >
          {`${modalData.name}`}
        </DialogTitle>
        <DialogContent dividers>
          <ModalData modalData={modalData} />
        </DialogContent>
        <DialogActions>
          <MDButton variant="gradient" color="info" onClick={handleClose}>
            close
          </MDButton>
        </DialogActions>
      </Dialog>
    </ >
  );
}

export default ServiceMonitoring;