import React from "react";
import {
  Grid,
  Autocomplete,
  TextField,
} from "@mui/material";
import { blue, orange, indigo } from '@mui/material/colors';
import CustomComplexProjectCard from "views/Components/CustomComplexProjectCard";
import DialogComp from "views/Components/DialogComp/DialogComp";
import Progress from "views/Components/Progress/Progress";
import MDBox from "components/MDBox";
import MDBadge from "components/MDBadge";
import MDTypography from "components/MDTypography";
import LogoDocker from "assets/images/logos/docker_logo.png";
import LogoKubernetes from "assets/images/logos/kubernetes_logo.png";
import axios from "axios";
import _ from "lodash";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
// import { useDispatch } from "react-redux";
// import { offLoad, onLoad } from "store/indicator";
import HoverBox from "./component/HoverBox";

function CreateService(props) {
  const [namespaces, setNamespaces] = React.useState([]);
  const [selectNamespace, setSelectNamespace] = React.useState(
    sessionStorage.getItem("selectNamespace_createService")
      ? sessionStorage.getItem("selectNamespace_createService")
      : "all"
  );
  const [state, setState] = React.useState({});
  const [imageName, setImageName] = React.useState();
  const [selectedName, setSelectedName] = React.useState();
  const [sourceData, setSourceData] = React.useState({
    droppableId: "",
    index: "",
  });
  const [destinationData, setDestinationData] = React.useState({
    droppableId: "",
    index: "",
  });

  // parameter state
  const [inputName, setInputName] = React.useState();
  const [inputType, setInputType] = React.useState("ClusterIP");
  const [inputSelector, setInputSelector] = React.useState();
  const [inputPort, setInputPort] = React.useState();
  const [inputTargetPort, setInputTargetPort] = React.useState();
  const [inputNodePort, setInputNodePort] = React.useState("none");

  const [modalCreate, setModalCreate] = React.useState(false);
  const [modalDelete, setModalDelete] = React.useState(false);

  const [modalState, setModalState] = React.useState("");
  const [modalAlert, setModalAlert] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  const [serviceList, setServiceList] = React.useState([]);
  const [deploymentList, setDeploymentList] = React.useState([]);


  const reorder = (list, startIndex, endIndex) => {
    const result = list;
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
  };

  // const dispatch = useDispatch();

  // React.useEffect(() => {
  //   console.log("state: ", state);
  // }, [state]);

  // log
  React.useEffect(() => {
    console.log("deploymentList: ", deploymentList);
  }, [deploymentList]);
  React.useEffect(() => {
    console.log("selectedName: ", selectedName);
  }, [selectedName]);
  React.useEffect(() => {
    console.log("inputSelector: ", inputSelector);
  }, [inputSelector]);
  React.useEffect(() => {
    console.log("inputNodePort: ", inputNodePort);
  }, [inputNodePort]);

  // React.useEffect(() => {
  //   console.log("selectNamespace: ", selectNamespace);
  // }, [selectNamespace]);

  React.useEffect(() => {
    if (inputType === "ClusterIP") {
      setInputNodePort("none");
    } else {
      setInputNodePort("");
    }
  }, [inputType]);

  React.useEffect(() => {
    const selectNsTmp =
      selectNamespace === "all" ? "" : _.cloneDeep(selectNamespace);

    axios("/rest/1.0/k8s/namespace").then((res) => {
      let listNsTmp = [];
      listNsTmp.push("all");
      if (res.data.length > 0) {
        res.data.map((ns) => {
          listNsTmp.push(ns.name);
        });
      }
      setNamespaces(listNsTmp);
    });
    axios(`/rest/1.0/k8s/service?namespace=${selectNsTmp}`).then((res) => {
      // console.log("servList: ", res.data);
      setServiceList(res.data);
    });
    axios(`/rest/1.0/k8s/deployment?namespace=${selectNsTmp}`).then((res) => {
      setDeploymentList(res.data);
    });
  }, []);

  React.useEffect(() => {
    sessionStorage.setItem("selectNamespace_createService", selectNamespace);

    const selectNsTmp =
      selectNamespace === "all" ? "" : _.cloneDeep(selectNamespace);

    axios(`/rest/1.0/k8s/service?namespace=${selectNsTmp}`).then((res) => {
      // console.log("servList: ", res.data);
      setServiceList(res.data);
    });
    axios(`/rest/1.0/k8s/deployment?namespace=${selectNsTmp}`).then((res) => {
      setDeploymentList(res.data);
    });
  }, [selectNamespace]);

  const onDragEnd = (result) => {
    // console.log("result: ", result);
    const { source, destination, draggableId } = result;
    // console.log("source: ", source);
    // console.log("destination: ", destination);
    // console.log("draggableId: ", draggableId);
    setSourceData(source);
    setDestinationData(destination);
    setSelectedName(draggableId);
    setImageName(draggableId);

    // dropped outside the list
    if (!destination) {
      if (selectNamespace === "all") {
        // namespace를 선택해주세요.
        setModalState("namespace");
        setModalAlert(true);
        return false;
      }

      if (source.droppableId !== "deployment") {
        setModalDelete(true);
      }
      return;
    }
    if (source.droppableId === destination.droppableId) {
      const reorderResult = reorder(
        destination.droppableId === "deployment" ? deploymentList : serviceList,
        source.index,
        destination.index
      );

      let result = _.cloneDeep(state);

      result[source.droppableId] = reorderResult;
      setState(result);
    }

    if (source.droppableId !== destination.droppableId) {
      if (destination.droppableId === "deployment") {
        return;
      }

      // 여기서부터 service 배포
      if (source.droppableId === "deployment") {
        if (selectNamespace === "all") {
          // default로 설정하기
          setSelectNamespace("default");

          // set param
          setInputName();
          setInputType("ClusterIP");
          setInputSelector(`app=${draggableId}`);
          setInputPort();
          setInputTargetPort();
          setInputNodePort("none");

          // create dialog open
          setModalCreate(true);
          return false;
        } else {
          // set param
          setInputName();
          setInputType("ClusterIP");
          setInputSelector(`app=${draggableId}`);
          setInputPort();
          setInputTargetPort();
          setInputNodePort("none");

          // create dialog open
          setModalCreate(true);
        }
      }
    }
  };

  const handleDeleteBtn = () => {
    setIsLoading(true);
    axios
      .delete(`/rest/1.0/k8s/service/${selectNamespace}/${selectedName}`)
      .then((res) => {
        if (res.data === "ok") {
          setIsLoading(false);
          setModalDelete(false);
          // alert("삭제가 완료됐습니다.");
          setModalState("delete");
          setModalAlert(true);
        } else {
          alert("삭제에 실패했습니다.");
        };

        let stateTmp = {};
        axios("/rest/1.0/repos/tags").then((res) => {
          let imagesTmp = [];
          res.data.map((data, idx) => {
            imagesTmp.push({
              id: `${data.name}-${idx}`,
              content: `${data.name}:${data.tags[0]}`,
            });
          });
          stateTmp["images"] = imagesTmp;
          setState(stateTmp);

          const selectNsTmp =
            selectNamespace === "all" ? "" : _.cloneDeep(selectNamespace);

          axios(`/rest/1.0/k8s/service?namespace=${selectNsTmp}`).then((res) => {
            setServiceList(res.data);
            setInputName();
            setInputPort();
          });
          axios(`/rest/1.0/k8s/deployment?namespace=${selectNsTmp}`).then((res) => {
            setDeploymentList(res.data);
          });
        });
      })
      .catch((err) => {
        setIsLoading(false);
        setModalDelete(false);
        console.log("err: ", err);
        // alert("삭제에 실패했습니다.");
        setModalState("deleteError");
        setModalAlert(true);
      });
  };

  const handleCreateBtn = () => {
    setIsLoading(true);
    // console.log("inputName: ", inputName);
    if (!inputName) {
      setIsLoading(false);
      // alert("배포할 이름을 입력해주세요.");
      setModalState("inputName");
      setModalAlert(true);
    } else {
      console.log("-namespace: ", selectNamespace);
      console.log("-service_name: ", inputName);
      console.log("-service_type: ", inputType);
      console.log("-selector: ", inputSelector);
      console.log("-port: ", inputPort);
      console.log("-target_port: ", inputTargetPort);
      console.log("-node_port: ", inputNodePort);
      axios
        .post(`/rest/1.0/k8s/service/${selectNamespace}/${inputName}/${inputType}/${inputSelector}/${inputPort}/${inputTargetPort}/${inputNodePort}`)
        .then((res) => {
          if (res.data === "ok") {
            // alert("배포가 완료됐습니다.");
            console.log("배포가 완료됐습니다.");
            setIsLoading(false);
            setModalState("ok");
            setModalAlert(true);
            setModalCreate(false);
          }
          const selectNsTmp =
            selectNamespace === "all" ? "" : _.cloneDeep(selectNamespace);

          axios(`/rest/1.0/k8s/service?namespace=${selectNsTmp}`).then((res) => {
            setServiceList(res.data);
            setInputName();
            setInputPort();
          });
          axios(`/rest/1.0/k8s/deployment?namespace=${selectNsTmp}`).then((res) => {
            setDeploymentList(res.data);
          });
        })
        .catch((err) => {
          setIsLoading(false);
          setModalCreate(false);
          console.log("err: ", err);
          // alert("배포에 실패했습니다.");
          console.log("배포에 실패했습니다.");
          setModalState("fail");
          setModalAlert(true);
        });
    }
  };

  return (
    <>
      <MDBox mt={9} />
      <DragDropContext onDragEnd={onDragEnd}>
        <CustomComplexProjectCard title={"KUBERNETES"} image={LogoKubernetes}>
          <Grid container display="flex" spacing={4}>
            <Grid item mt={5} xs={12} lg={9}>
              <MDBox mb={1}>
                <MDTypography variant="h6" fontWeight="medium" textTransform="capitalize">
                  All nodes
                </MDTypography>
              </MDBox>
              <Grid container>
                <Droppable droppableId="service">
                  {(provided, snapshot) => (
                    <Grid item xs={12}>
                      <div
                        ref={provided.innerRef}
                      >
                        <div
                          style={{
                            borderRadius: 5,
                            border: "1px solid lightgrey",
                            padding: 8,
                            // width: "350px",
                            height: "380px",
                          }}
                        >
                          <MDBadge size="xs" color="info" badgeContent={"Service List"} container />
                          <div style={{ overflowY: "auto", height: "320px" }}>
                            {serviceList.length > 0
                              ? serviceList.map((item, index) => (
                                <Draggable
                                  key={item.name}
                                  draggableId={item.name}
                                  index={index}
                                >
                                  {(provided, snapshot) => {
                                    // console.log("snapshot:", snapshot)
                                    // console.log("provided:", provided)
                                    return (
                                      <HoverBox
                                        type="service"
                                        provided={provided}
                                        item={item}
                                        index={index}
                                        snapshot={snapshot}
                                        mainColor={blue[800]}
                                        hoverColor={indigo[50]}
                                      />
                                    )
                                  }}
                                </Draggable>
                              ))
                              : null}
                            {provided.placeholder}
                          </div>
                        </div>
                      </div>
                    </Grid>
                  )}
                </Droppable>
              </Grid>
            </Grid>
            <Grid item mt={5} xs={12} lg={3}>
              <Grid container
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                }}
              >
                <Grid item width="100%">
                  <MDBox mb={1}>
                    <MDTypography variant="h6" fontWeight="medium" textTransform="capitalize">
                      Namespace
                    </MDTypography>
                  </MDBox>
                  <Autocomplete
                    size="medium"
                    disableClearable
                    disablePortal
                    value={selectNamespace}
                    options={namespaces}
                    onInputChange={(e) => {
                      if (e) {
                        const nameSpaceTmp = e.target.innerText;
                        setSelectNamespace(nameSpaceTmp);
                      }
                    }}
                    renderInput={(params) => <TextField {...params} sx={{ width: "100%" }} />} //label="Namespace"
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </CustomComplexProjectCard>
        <MDBox mb={4} />
        <CustomComplexProjectCard title={"DOCKER"} image={LogoDocker}>
          <MDBox mt={5}>
            <MDBox mb={1}>
              <MDTypography variant="h6" fontWeight="medium" textTransform="capitalize">
                Docker local repository
              </MDTypography>
            </MDBox>
            <Droppable droppableId="deployment" direction="horizontal">
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                >
                  <div
                    style={{
                      borderRadius: 5,
                      border: "1px solid lightgrey",
                      padding: 8,
                      width: "100%",
                    }}
                  >
                    <MDBox>
                      <MDBadge size="xs" color="warning" badgeContent={"Deployment List"} container />
                    </MDBox>
                    <Grid container
                      spacing={1}
                      display="flex"
                      justifyContent="flex-start"
                      flexWrap="wrap"
                    >
                      {deploymentList.length > 0
                        ? deploymentList.map((item, index) => (
                          <Draggable
                            key={item.name}
                            draggableId={item.name}
                            index={index}
                          >
                            {(provided, snapshot) => (
                              <Grid item>
                                <HoverBox
                                  type="image"
                                  width="350px"
                                  provided={provided}
                                  item={item}
                                  index={index}
                                  snapshot={snapshot}
                                  mainColor={orange[700]}
                                  hoverColor={orange[50]}
                                />
                              </Grid>
                            )}
                          </Draggable>
                        ))
                        : null}
                      {provided.placeholder}
                    </Grid>
                  </div>
                </div>
              )}
            </Droppable>

          </MDBox>
        </CustomComplexProjectCard>
      </DragDropContext>

      <DialogComp
        type={"service"}
        modalCreate={modalCreate}
        setModalCreate={setModalCreate}
        modalDelete={modalDelete}
        setModalDelete={setModalDelete}
        modalState={modalState}
        setModalState={setModalState}
        modalAlert={modalAlert}
        setModalAlert={setModalAlert}
        destinationData={destinationData}
        imageName={imageName}
        selectedName={selectedName}
        sourceData={sourceData}
        handleCreateBtn={handleCreateBtn}
        handleDeleteBtn={handleDeleteBtn}
        inputName={inputName}
        setInputName={setInputName}
        inputType={inputType}
        setInputType={setInputType}
        inputSelector={inputSelector}
        setInputSelector={setInputSelector}
        inputPort={inputPort}
        setInputPort={setInputPort}
        inputTargetPort={inputTargetPort}
        setInputTargetPort={setInputTargetPort}
        inputNodePort={inputNodePort}
        setInputNodePort={setInputNodePort}
      />
      <Progress isLoading={isLoading} />
    </>
  );
}

export default CreateService;