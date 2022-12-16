import React, { useEffect, useState } from "react";
import {
  Tabs,
  Tab,
  Box,
  Card,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "../../Components/DashboardNavbar";
import MDBox from "components/MDBox";
import breakpoints from "assets/theme/base/breakpoints";
import CustomDataTable from "../../Components/DataTable/CustomDataTable";
import CustomIdCell from "../../Components/DataTable/CustomIdCell";
import axios from "axios";
import { grey } from '@mui/material/colors';
import MDButton from "components/MDButton";
import ModalData from "../../Components/DetailModalComp/DetailModalComp";

// const dataSample = {
//   columns: [
//     { Header: "id", accessor: "id", Cell: ({ value }) => <CustomIdCell id={value} /> },
//     { Header: "namespace", accessor: "namespace", width: "20%" },
//     { Header: "name", accessor: "name", width: "25%" },
//     { Header: "ready_replicas", accessor: "ready_replicas" },
//     { Header: "replicas", accessor: "replicas", width: "7%" },
//     { Header: "updated_replicas", accessor: "updated_replicas" },
//     { Header: "available_replicas", accessor: "available_replicas" },
//     { Header: "age", accessor: "age" },
//     { Header: "containers", accessor: "containers" },
//     { Header: "images", accessor: "images" },
//     { Header: "selector", accessor: "selector" },
//   ],
//   rows: [
//     {
//       id: 0,
//       namespace: "cert-manager",
//       name: "cert-manager",
//       ready_replicas: 1,
//       replicas: 1,
//       updated_replicas: 1,
//       available_replicas: 1,
//       age: "5 days, 23:51:18.727743",
//       containers: "cert-manager",
//       images: "quay.io/jetstack/cert-manager-controller:v1.8.0",
//       selector: "app.kubernetes.io/component=controller,app.kubernetes.io/instance=cert-manager,app.kubernetes.io/name=cert-manager",
//     },
//     {
//       id: 1,
//       namespace: "cert-manager",
//       name: "cert-manager",
//       ready_replicas: 1,
//       replicas: 1,
//       updated_replicas: 1,
//       available_replicas: 1,
//       age: "5 days, 23:51:18.727743",
//       containers: "cert-manager",
//       images: "quay.io/jetstack/cert-manager-controller:v1.8.0",
//       selector: "app.kubernetes.io/component=controller,app.kubernetes.io/instance=cert-manager,app.kubernetes.io/name=cert-manager",
//     },
//   ],
// };

// interface TabPanelProps {
//   children?: React.ReactNode;
//   index: number;
//   value: number;
// }

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <>
          {children}
        </>
      )}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const tableData = {
  deployment: [],
  daemonset: [],
  replicaset: [],
  statefulset: [],
  job: [],
}

function ControllerMonitoring(props) {
  const [tabsOrientation, setTabsOrientation] = useState("horizontal");
  const [tabValue, setTabValue] = useState(0);
  const [rowData, setRowData] = useState(tableData);
  const [rowData0, setRowData0] = useState([]);
  const [rowData1, setRowData1] = useState([]);
  const [rowData2, setRowData2] = useState([]);
  const [rowData3, setRowData3] = useState([]);
  const [rowData4, setRowData4] = useState([]);
  const [selectedValue, setSelectedValue] = React.useState();
  const [tableDataIdx, setTableDataIdx] = React.useState(null);
  const [modalOpen, setModalOpen] = React.useState(false);
  const [modalData, setModalData] = React.useState({});

  const columnData = {
    deployment: [
      {
        Header: "", accessor: "id",
        Cell: ({ value }) => {
          return (
            <CustomIdCell
              id={value}
              tap="deployment"
              selectedValue={selectedValue}
              setSelectedValue={setSelectedValue}
              setTableDataIdx={setTableDataIdx}
            />
          )
        },
        width: "5%"
      },
      { Header: "namespace", accessor: "namespace" },
      { Header: "name", accessor: "name" },
      { Header: "ready_replicas", accessor: "ready_replicas" },
      { Header: "replicas", accessor: "replicas" },
      { Header: "updated_replicas", accessor: "updated_replicas" },
      { Header: "available_replicas", accessor: "available_replicas" },
      // { Header: "age", accessor: "age" },
      // { Header: "containers", accessor: "containers" },
      // { Header: "images", accessor: "images" },
      // { Header: "selector", accessor: "selector" },
    ],
    daemonset: [
      {
        Header: "", accessor: "id",
        Cell: ({ value }) => {
          return (
            <CustomIdCell
              id={value}
              tap="daemonset"
              selectedValue={selectedValue}
              setSelectedValue={setSelectedValue}
              setTableDataIdx={setTableDataIdx}
            />
          )
        },
        width: "5%"
      },
      { Header: "namespace", accessor: "namespace" },
      { Header: "name", accessor: "name" },
      { Header: "desired_number_scheduled", accessor: "desired_number_scheduled" },
      { Header: "current_number_scheduled", accessor: "current_number_scheduled" },
      { Header: "number_ready", accessor: "number_ready" },
      { Header: "updated_number_scheduled", accessor: "updated_number_scheduled" },
      { Header: "number_available", accessor: "number_available" },
      { Header: "node_selector", accessor: "node_selector" },
      // { Header: "age", accessor: "age" },
      // { Header: "containers", accessor: "containers" },
      // { Header: "images", accessor: "images" },
      // { Header: "selector", accessor: "selector" },
    ],
    replicaset: [
      {
        Header: "", accessor: "id",
        Cell: ({ value }) => {
          return (
            <CustomIdCell
              id={value}
              tap="replicaset"
              selectedValue={selectedValue}
              setSelectedValue={setSelectedValue}
              setTableDataIdx={setTableDataIdx}
            />
          )
        },
        width: "5%"
      },
      { Header: "namespace", accessor: "namespace" },
      { Header: "name", accessor: "name" },
      { Header: "desired-replicas", accessor: "desired-replicas" },
      { Header: "current_replicas", accessor: "current_replicas" },
      { Header: "ready_replicas", accessor: "ready_replicas" },
      // { Header: "age", accessor: "age" },
      // { Header: "containers", accessor: "containers" },
      // { Header: "images", accessor: "images" },
      // { Header: "selector", accessor: "selector" },
    ],
    statefulset: [
      {
        Header: "", accessor: "id",
        Cell: ({ value }) => {
          return (
            <CustomIdCell
              id={value}
              tap="statefulset"
              selectedValue={selectedValue}
              setSelectedValue={setSelectedValue}
              setTableDataIdx={setTableDataIdx}
            />
          )
        },
        width: "5%"
      },
      { Header: "namespace", accessor: "namespace" },
      { Header: "name", accessor: "name" },
      { Header: "ready_replicas", accessor: "ready_replicas" },
      { Header: "replicas", accessor: "replicas" },
      // { Header: "age", accessor: "age" },
      // { Header: "containers", accessor: "containers" },
      // { Header: "images", accessor: "images" },
    ],
    job: [
      {
        Header: "", accessor: "id",
        Cell: ({ value }) => {
          return (
            <CustomIdCell
              id={value}
              tap="job"
              selectedValue={selectedValue}
              setSelectedValue={setSelectedValue}
              setTableDataIdx={setTableDataIdx}
            />
          )
        },
        width: "5%"
      },
      { Header: "namespace", accessor: "namespace" },
      { Header: "name", accessor: "name" },
      { Header: "completions", accessor: "completions" },
      { Header: "age", accessor: "age" },
    ],
  };

  useEffect(() => {
    axios("/rest/1.0/k8s/deployment")
      .then((res) => {
        let dataTmp = [];
        res.data.map((data, idx) => {
          dataTmp.push({ ...data, id: idx });
        });
        tableData.deployment = res.data;
        setRowData0(dataTmp);
      })
      .catch((err) => {
        console.log("err: ", err);
      });
    axios("/rest/1.0/k8s/daemonset")
      .then((res) => {
        let dataTmp = [];
        res.data.map((data, idx) => {
          dataTmp.push({ ...data, id: idx });
        });
        tableData.daemonset = res.data;
        setRowData1(dataTmp);
      })
      .catch((err) => {
        console.log("err: ", err);
      });
    axios("/rest/1.0/k8s/replicaset")
      .then((res) => {
        let dataTmp = [];
        res.data.map((data, idx) => {
          dataTmp.push({ ...data, id: idx });
        });
        tableData.replicaset = res.data;
        setRowData2(dataTmp);
      })
      .catch((err) => {
        console.log("err: ", err);
      });
    axios("/rest/1.0/k8s/statefulset")
      .then((res) => {
        let dataTmp = [];
        res.data.map((data, idx) => {
          dataTmp.push({ ...data, id: idx });
        });
        tableData.statefulset = res.data;
        setRowData3(dataTmp);
      })
      .catch((err) => {
        console.log("err: ", err);
      });
    axios("/rest/1.0/k8s/job")
      .then((res) => {
        let dataTmp = [];
        res.data.map((data, idx) => {
          dataTmp.push({ ...data, id: idx });
        });
        tableData.job = res.data;
        setRowData4(dataTmp);
      })
      .catch((err) => {
        console.log("err: ", err);
      });
    setRowData(tableData);
  }, []);

  useEffect(() => {
    function handleTabsOrientation() {
      return window.innerWidth < breakpoints.values.sm
        ? setTabsOrientation("vertical")
        : setTabsOrientation("horizontal");
    }
    window.addEventListener("resize", handleTabsOrientation);
    handleTabsOrientation();
    return () => window.removeEventListener("resize", handleTabsOrientation);
  }, [tabsOrientation]);

  
  useEffect(() => {
    console.log("selectedValue: ", selectedValue);
    if (selectedValue) {
      const [tableTab, rowIdx] = tableDataIdx.split("-");
      if (tableTab === "deployment") {
        setModalData(rowData.deployment[rowIdx]);
      } else if (tableTab === "daemonset") {
        setModalData(rowData.daemonset[rowIdx]);
      } else if (tableTab === "replicaset") {
        setModalData(rowData.replicaset[rowIdx]);
      } else if (tableTab === "statefulset") {
        setModalData(rowData.statefulset[rowIdx]);
      } else if (tableTab === "job") {
        setModalData(rowData.job[rowIdx]);
      };
      setModalOpen(true);
    }
  }, [selectedValue]);

  // useEffect(() => {
  //   console.log("tableDataIdx: ", tableDataIdx);
  // }, [tableDataIdx]);

  // useEffect(() => {
  //   console.log("modalData:", modalData);
  // }, [modalData]);

  useEffect(() => {
    console.log("rowData: ", rowData);
  }, [rowData]);

  const handleSetTabValue = (event, newValue) => {
    setTabValue(newValue);
    setSelectedValue();
  };
  const handleClose = (e) => {
    setModalOpen(false);
    setSelectedValue();
    setModalData({});
  };

  return (
    <>
      
      <MDBox mt={5}>
        <Box mb={2}>
          <Tabs
            value={tabValue}
            orientation={tabsOrientation}
            onChange={handleSetTabValue}
            aria-label="basic tabs example"
            sx={{ backgroundColor: grey[300] }}
          >
            <Tab label="Deployment" {...a11yProps(0)} />
            <Tab label="DaemonSet" {...a11yProps(1)} />
            <Tab label="ReplicaSet" {...a11yProps(2)} />
            <Tab label="StatfulSet" {...a11yProps(3)} />
            <Tab label="Job" {...a11yProps(4)} />
          </Tabs>
        </Box>
        <Card>
          <Box sx={{ width: "100%" }}>
            <TabPanel value={tabValue} index={0}>
              <CustomDataTable table={{ columns: columnData.deployment, rows: rowData0 }} />
            </TabPanel>
            <TabPanel value={tabValue} index={1}>
              <CustomDataTable table={{ columns: columnData.daemonset, rows: rowData1 }} />
            </TabPanel>
            <TabPanel value={tabValue} index={2}>
              <CustomDataTable table={{ columns: columnData.replicaset, rows: rowData2 }} />
            </TabPanel>
            <TabPanel value={tabValue} index={3}>
              <CustomDataTable table={{ columns: columnData.statefulset, rows: rowData3 }} />
            </TabPanel>
            <TabPanel value={tabValue} index={4}>
              <CustomDataTable table={{ columns: columnData.job, rows: rowData4 }} />
            </TabPanel>
          </Box>
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

export default ControllerMonitoring;