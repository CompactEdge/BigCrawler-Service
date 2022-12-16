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
// import TabPanel from '@mui/lab/TabPanel';
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "../../Components/DashboardNavbar";
import MDBox from "components/MDBox";
import breakpoints from "assets/theme/base/breakpoints";
import CustomDataTable from "../../Components/DataTable/CustomDataTable";
import CustomIdCell from "../../Components/DataTable/CustomIdCell";
import axios from "axios";
import { grey } from "@mui/material/colors";
import MDButton from "components/MDButton";
import ModalData from "../../Components/DetailModalComp/DetailModalComp";

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
  persistentVolume: [],
  persistentVolumeClaim: [],
  storageClass: [],
}

function StorageMonitoring(props) {
  const [tabsOrientation, setTabsOrientation] = useState("horizontal");
  const [tabValue, setTabValue] = useState(0);
  const [rowData, setRowData] = useState(tableData);
  const [rowData0, setRowData0] = useState([]);
  const [rowData1, setRowData1] = useState([]);
  const [rowData2, setRowData2] = useState([]);
  const [selectedValue, setSelectedValue] = React.useState();
  const [tableDataIdx, setTableDataIdx] = React.useState(null);
  const [modalOpen, setModalOpen] = React.useState(false);
  const [modalData, setModalData] = React.useState({});
  const [nameSpace, setNameSpace] = React.useState(["all"]);
  const [nameSpaceVal, setNameSpaceVal] = useState("all");

  const columnData = {
    persistentVolume: [
      {
        Header: "", accessor: "id",
        Cell: ({ value }) => {
          return (
            <CustomIdCell
              id={value}
              tap="persistentVolume"
              selectedValue={selectedValue}
              setSelectedValue={setSelectedValue}
              setTableDataIdx={setTableDataIdx}
            />
          )
        },
        width: "5%"
      },
      { Header: "name", accessor: "name" },
      { Header: "capacity", accessor: "capacity" },
      { Header: "access_modes", accessor: "access_modes" },
      { Header: "persistent_volume_reclaim_policy", accessor: "persistent_volume_reclaim_policy" },
      { Header: "status", accessor: "status" },
      { Header: "claim", accessor: "claim" },
      { Header: "storage_class_name", accessor: "storage_class_name" },
      { Header: "reason", accessor: "reason" },
      { Header: "age", accessor: "age" },
      { Header: "volume_mode", accessor: "volume_mode" },
    ],
    persistentVolumeClaim: [
      {
        Header: "", accessor: "id",
        Cell: ({ value }) => {
          return (
            <CustomIdCell
              id={value}
              tap="persistentVolumeClaim"
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
      { Header: "status", accessor: "status" },
      { Header: "volume_name", accessor: "volume_name" },
      { Header: "capacity", accessor: "capacity" },
      { Header: "access_modes", accessor: "access_modes" },
      { Header: "storage_class_name", accessor: "storage_class_name" },
      { Header: "age", accessor: "age" },
      { Header: "volume_mode", accessor: "volume_mode" },
    ],
    storageClass: [
      {
        Header: "", accessor: "id",
        Cell: ({ value }) => {
          return (
            <CustomIdCell
              id={value}
              tap="storageClass"
              selectedValue={selectedValue}
              setSelectedValue={setSelectedValue}
              setTableDataIdx={setTableDataIdx}
            />
          )
        },
        width: "5%"
      },
      { Header: "name", accessor: "name" },
      { Header: "provisioner", accessor: "provisioner" },
      { Header: "reclaim_policy", accessor: "reclaim_policy" },
      { Header: "volume_binding_mode", accessor: "volume_binding_mode" },
      { Header: "allow_volume_expansion", accessor: "allow_volume_expansion" },
      { Header: "age", accessor: "age" },
    ],
  };

  useEffect(() => {
    axios("/rest/1.0/k8s/persistent_volume")
      .then((res) => {
        let dataTmp = [];
        if (res.data.length > 0) {
          res.data.map((data, idx) => {
            dataTmp.push({ ...data, id: idx });
          });
          tableData.persistentVolume = res.data;
          setRowData0(dataTmp);
        };
      })
      .catch((err) => {
        console.log("err: ", err);
      });
    axios("/rest/1.0/k8s/persistent_volume_claim")
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
          tableData.persistentVolumeClaim = res.data;
          setRowData1(dataTmp);
          console.log("nameSpaceTmp: ", nameSpaceTmp);
          setNameSpace(nameSpaceTmp);
        }
      })
      .catch((err) => {
        console.log("err: ", err);
      });
    axios("/rest/1.0/k8s/storageclass")
      .then((res) => {
        let dataTmp = [];
        if (res.data.length > 0) {
          res.data.map((data, idx) => {
            dataTmp.push({ ...data, id: idx });
          });
          tableData.storageClass = res.data;
          setRowData2(dataTmp);
        }
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
      if (tableTab === "persistentVolume") {
        setModalData(rowData.persistentVolume[rowIdx]);
      } else if (tableTab === "persistentVolumeClaim") {
        setModalData(rowData.persistentVolumeClaim[rowIdx]);
      } else if (tableTab === "storageClass") {
        setModalData(rowData.storageClass[rowIdx]);
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

  useEffect(() => {
    console.log("nameSpaceVal: ", nameSpaceVal);
    let url;
    if (nameSpaceVal === "all") {
      url = `/rest/1.0/k8s/persistent_volume_claim`
    } else {
      url = `/rest/1.0/k8s/persistent_volume_claim?namespace=${nameSpaceVal}`
    }
    axios(url)
    .then((res) => {
      let dataTmp = [];
      if (res.data.length > 0) {
        res.data.map((data, idx) => {
          dataTmp.push({ ...data, id: idx });
        });
        tableData.persistentVolumeClaim = res.data;
        setRowData1(dataTmp);
      }
    })
    .catch((err) => {
      console.log("err: ", err);
    });
    // setRowData(tableData);
  }, [nameSpaceVal]);

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
            <Tab label="PersistentVolume" {...a11yProps(0)} />
            <Tab label="PersistentVolumeClaim" {...a11yProps(1)} />
            <Tab label="StorageClass" {...a11yProps(2)} />
          </Tabs>
        </Box>
        <Card>
          <Box sx={{ width: "100%" }}>
            <TabPanel value={tabValue} index={0}>
              <CustomDataTable table={{ columns: columnData.persistentVolume, rows: rowData0 }} />
            </TabPanel>
            <TabPanel value={tabValue} index={1}>
              <CustomDataTable
                table={{ columns: columnData.persistentVolumeClaim, rows: rowData1 }}
                nameSpace={nameSpace}
                nameSpaceVal={nameSpaceVal}
                setNameSpaceVal={setNameSpaceVal}
              />
            </TabPanel>
            <TabPanel value={tabValue} index={2}>
              <CustomDataTable table={{ columns: columnData.storageClass, rows: rowData2 }} />
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

export default StorageMonitoring;