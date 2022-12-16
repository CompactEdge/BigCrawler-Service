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
import { useDispatch } from "react-redux";
import { offLoad, onLoad } from "store/indicator";
import HoverBox from "./component/HoverBox";

function CreatePod(props) {
  const [namespaces, setNamespaces] = React.useState([]);
  const [selectNamespace, setSelectNamespace] = React.useState(
    sessionStorage.getItem("selectNamespace_createPod")
      ? sessionStorage.getItem("selectNamespace_createPod")
      : "all"
  );
  const [state, setState] = React.useState({});
  const [masterNode, setMasterNode] = React.useState([]);

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

  const [modalCreate, setModalCreate] = React.useState(false);
  const [modalDelete, setModalDelete] = React.useState(false);

  const [modalState, setModalState] = React.useState("");
  const [modalAlert, setModalAlert] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
  };

  const dispatch = useDispatch();

  React.useEffect(() => {
    console.log("state: ", state);
  }, [state]);

  React.useEffect(() => {
    let stateTmp = {};
    axios("/rest/1.0/repos/tags").then((res1) => {
      let imagesTmp = [];
      res1.data.map((data, idx) => {
        imagesTmp.push({
          id: `${data.name}-${idx}`,
          content: `${data.name}:${data.tags[0]}`,
        });
      });
      stateTmp = { images: imagesTmp };

      setState(stateTmp);
    });
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
    axios(`/rest/1.0/k8s/node`).then((res) => {
      let masterNodeTmp = [];
      let nodesTmp = [];
      if (res.data.length > 0) {
        res.data.map((node) => {
          if (node.node_role === "master") {
            masterNodeTmp.push(node.name);
          } else {
            nodesTmp.push(node.name);
          }
        });
      }
      setMasterNode(masterNodeTmp);

      const selectNsTmp =
        selectNamespace === "all" ? "" : _.cloneDeep(selectNamespace);

      axios(`/rest/1.0/k8s/pod?namespace=${selectNsTmp}`).then((res) => {
        let podsTmp = [];
        if (res.data) {
          res.data.map((podsData, idx) => {
            podsTmp.push({
              id: `${podsData.pod_name}-${idx}`,
              content: podsData.pod_name,
              node_name: podsData.node_name,
            });
          });
          nodesTmp.map((node) => {
            stateTmp[node] = podsTmp.filter((pod) => {
              return pod.node_name === node;
            });
          });
          stateTmp["nodes"] = nodesTmp;
        }
        setState(stateTmp);
      });
    });
  }, []);

  React.useEffect(() => {
    sessionStorage.setItem("selectNamespace_createPod", selectNamespace);
    let stateTmp = {};

    axios("/rest/1.0/repos/tags").then((res1) => {
      let imagesTmp = [];
      res1.data.map((data, idx) => {
        imagesTmp.push({
          id: `${data.name}-${idx}`,
          content: `${data.name}:${data.tags[0]}`,
        });
      });
      stateTmp["images"] = imagesTmp;

      const selectNsTmp =
        selectNamespace === "all" ? "" : _.cloneDeep(selectNamespace);

      axios(`/rest/1.0/k8s/node`).then((res) => {
        let masterNodeTmp = [];
        let nodesTmp = [];
        if (res.data.length > 0) {
          res.data.map((node) => {
            if (node.node_role === "master") {
              masterNodeTmp.push(node.name);
            } else {
              nodesTmp.push(node.name);
            }
          });
        }
        setMasterNode(masterNodeTmp);

        axios(`/rest/1.0/k8s/pod?namespace=${selectNsTmp}`).then((res) => {
          let podsTmp = [];
          if (res.data) {
            res.data.map((podsData, idx) => {
              podsTmp.push({
                id: `${podsData.pod_name}-${idx}`,
                content: podsData.pod_name,
                node_name: podsData.node_name,
              });
            });
            nodesTmp.map((node) => {
              stateTmp[node] = podsTmp.filter((pod) => {
                return pod.node_name === node;
              });
            });
            stateTmp["nodes"] = nodesTmp;
          }
          // console.log("stateTmp: ", stateTmp);
          setState(stateTmp);
        });
      });
    });
  }, [selectNamespace]);

  const onDragEnd = (result) => {
    console.log("result: ", result);
    const { source, destination } = result;
    // console.log("source: ", source);
    // console.log("destination: ", destination);
    setSourceData(source);
    setDestinationData(destination);
    setImageName(state["images"][source.index]?.content);
    setSelectedName(state[source.droppableId][source.index]?.content);

    // dropped outside the list
    if (!destination) {
      if (selectNamespace === "all") {
        // namespace를 선택해주세요.
        setModalState("namespace");
        setModalAlert(true);
        return false;
      }

      if (source.droppableId !== "images") {
        setModalDelete(true);
      }
      return;
    } else {
    }
    if (source.droppableId === destination.droppableId) {
      const reorderResult = reorder(
        state[source.droppableId],
        source.index,
        destination.index
      );

      let result = _.cloneDeep(state);

      result[source.droppableId] = reorderResult;
      setState(result);
    }

    if (source.droppableId !== destination.droppableId) {
      if (destination.droppableId === "images") {
        return;
      }

      // 여기서부터 image 배포
      if (source.droppableId === "images") {
        if (selectNamespace === "all") {
          // default로 설정하기
          setSelectNamespace("default");
          setModalCreate(true);
          return false;
        } else {
          // dialog open, 파라미터 추가`
          setModalCreate(true);
        }
      }
    }
  };

  const handleDeleteBtn = () => {
    setIsLoading(true);
    dispatch(onLoad());
    axios
      .delete(`/rest/1.0/k8s/pod/${selectNamespace}/${state[sourceData.droppableId][sourceData.index]["content"]}`)
      .then((res) => {
        if (res.data === "ok") {
          setIsLoading(false);
          setModalDelete(false);
          // alert("삭제가 완료됐습니다.");
          setModalState("delete");
          setModalAlert(true);
        };

        let stateTmp = {};
        axios("/rest/1.0/repos/tags")
          .then((res) => {
            let imagesTmp = [];
            res.data.map((data, idx) => {
              imagesTmp.push({
                id: `${data.name}-${idx}`,
                content: `${data.name}:${data.tags[0]}`,
              });
            });
            stateTmp["images"] = imagesTmp;

            const selectNsTmp =
              selectNamespace === "all" ? "" : _.cloneDeep(selectNamespace);

            axios(`/rest/1.0/k8s/node`)
              .then((res) => {
                let masterNodeTmp = [];
                let nodesTmp = [];
                if (res.data.length > 0) {
                  res.data.map((node) => {
                    if (node.node_role === "master") {
                      masterNodeTmp.push(node.name);
                    } else {
                      nodesTmp.push(node.name);
                    }
                  });
                }
                setMasterNode(masterNodeTmp);

                axios(`/rest/1.0/k8s/pod?namespace=${selectNsTmp}`)
                  .then((res) => {
                    let podsTmp = [];
                    if (res.data) {
                      res.data.map((podsData, idx) => {
                        podsTmp.push({
                          id: `${podsData.pod_name}-${idx}`,
                          content: podsData.pod_name,
                          node_name: podsData.node_name,
                        });
                      });
                      nodesTmp.map((node) => {
                        stateTmp[node] = podsTmp.filter((pod) => {
                          return pod.node_name === node;
                        });
                      });
                      stateTmp["nodes"] = nodesTmp;
                    }
                    setState(stateTmp);
                    dispatch(offLoad());
                  }
                  );
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
    console.log("inputName: ", inputName);
    if (!inputName) {
      // alert("배포할 이름을 입력해주세요.");
      setModalState("inputName");
      setModalAlert(true);
    } else {
      dispatch(onLoad());

      console.log("namespace:", selectNamespace);
      console.log("node", destinationData.droppableId);
      console.log("image", state[sourceData.droppableId][sourceData.index]["content"]);
      console.log("pod_name", inputName);
      axios
        .post(
          `/rest/1.0/k8s/pod/${selectNamespace}/${destinationData.droppableId}/${state[sourceData.droppableId][sourceData.index]["content"]}/${inputName}`
        )
        .then((res) => {
          if (res.data === "ok") {
            // alert("배포가 완료됐습니다.");
            console.log("배포가 완료됐습니다.");
            setIsLoading(false);
            setModalState("ok");
            setModalAlert(true);
          }

          let stateTmp = {};
          axios("/rest/1.0/repos/tags").then((res1) => {
            let imagesTmp = [];
            res1.data.map((data, idx) => {
              imagesTmp.push({
                id: `${data.name}-${idx}`,
                content: `${data.name}:${data.tags[0]}`,
              });
            });
            stateTmp["images"] = imagesTmp;

            const selectNsTmp =
              selectNamespace === "all"
                ? ""
                : _.cloneDeep(selectNamespace);

            axios(`/rest/1.0/k8s/node`).then((res) => {
              let masterNodeTmp = [];
              let nodesTmp = [];
              if (res.data.length > 0) {
                res.data.map((node) => {
                  if (node.node_role === "master") {
                    masterNodeTmp.push(node.name);
                  } else {
                    nodesTmp.push(node.name);
                  }
                });
              }
              setMasterNode(masterNodeTmp);

              axios(`/rest/1.0/k8s/pod?namespace=${selectNsTmp}`).then(
                (res) => {
                  let podsTmp = [];
                  if (res.data) {
                    res.data.map((podsData, idx) => {
                      podsTmp.push({
                        id: `${podsData.pod_name}-${idx}`,
                        content: podsData.pod_name,
                        node_name: podsData.node_name,
                      });
                    });
                    nodesTmp.map((node) => {
                      stateTmp[node] = podsTmp.filter((pod) => {
                        return pod.node_name === node;
                      });
                    });
                    stateTmp["nodes"] = nodesTmp;
                  }
                  setState(stateTmp);
                  dispatch(offLoad());
                  setModalCreate(false);
                  setInputName();
                }
              );
            });
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
          <MDBox mt={5}>
            <Grid container
              display="flex"
              justifyContent="space-between"
              // alignItems="center"
              spacing={5}
            >
              <Grid item>
                <MDBox mb={1}>
                  <MDTypography variant="h6" fontWeight="medium" textTransform="capitalize">
                    Master Node
                  </MDTypography>
                </MDBox>
                {masterNode.length > 0
                  ? masterNode.map((msNode, idx) => {
                    return (
                      <div
                        key={`${msNode}-${idx}`}
                        style={{
                          borderRadius: 5,
                          border: "1px solid lightgrey",
                          padding: 8,
                          width: "350px",
                        }}
                      >
                        <MDBox
                        >
                          <MDBadge size="xs" color="success" badgeContent={"Node Name"} container sx={{ height: "100%" }} />
                          <MDBox
                            mt={-0.5}
                            ml={0.5}
                            fontSize="20px"
                            fontWeight="100"
                          >
                            {msNode}
                          </MDBox>
                        </MDBox>
                      </div>

                    );
                  })
                  : null}
              </Grid>
              <Grid item>
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
                  renderInput={(params) => <TextField {...params} sx={{ width: "350px" }} />} //label="Namespace"
                />
              </Grid>
            </Grid>
          </MDBox>

          <MDBox mt={5}>
            <MDBox mb={1}>
              <MDTypography variant="h6" fontWeight="medium" textTransform="capitalize">
                Worker Nodes
              </MDTypography>
            </MDBox>
            <Grid container spacing={5}>
              {state["nodes"]
                ? state["nodes"].map((node, idx) => {
                  return (
                    <Droppable droppableId={node} key={`${node}-${idx}`}>
                      {(provided, snapshot) => (
                        <Grid item>
                          <div
                            ref={provided.innerRef}
                          >
                            <div
                              key={`${node}-${idx}`}
                              style={{
                                borderRadius: 5,
                                border: "1px solid lightgrey",
                                padding: 8,
                                width: "350px",
                                height: "380px",
                              }}
                            >
                              <MDBox mb={1}>
                                <MDBadge size="xs" color="success" badgeContent={"Node Name"} container />
                                <MDBox
                                  mt={-0.5}
                                  ml={0.5}
                                  fontSize="20px"
                                  fontWeight="100"
                                >
                                  {node}
                                </MDBox>
                              </MDBox>
                              <MDBadge size="xs" color="info" badgeContent={"Pod List"} container />
                              <div style={{ overflowY: "auto", height: "255px" }}>
                                {state[node]
                                  ? state[node].map((item, index) => (
                                    <Draggable
                                      key={item.id}
                                      draggableId={item.id}
                                      index={index}
                                    >
                                      {(provided, snapshot) => {
                                        // console.log("snapshot:", snapshot)
                                        // console.log("provided:", provided)
                                        return (
                                          <HoverBox
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
                  );
                })
                : null}
            </Grid>
          </MDBox>
        </CustomComplexProjectCard>
        <MDBox mb={4} />
        <CustomComplexProjectCard title={"DOCKER"} image={LogoDocker}>
          <MDBox mt={5}>
            <MDBox mb={1}>
              <MDTypography variant="h6" fontWeight="medium" textTransform="capitalize">
                Docker local repository
              </MDTypography>
            </MDBox>
            <Droppable droppableId="images" direction="horizontal">
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
                      <MDBadge size="xs" color="warning" badgeContent={"Image List"} container />
                    </MDBox>
                    <Grid container
                      spacing={1}
                      display="flex"
                      justifyContent="flex-start"
                      flexWrap="wrap"
                    >
                      {state["images"]
                        ? state["images"].map((item, index) => (
                          <Draggable
                            key={item.id}
                            draggableId={item.id}
                            index={index}
                          >
                            {(provided, snapshot) => (
                              <Grid item>
                                <HoverBox
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
      />
      <Progress isLoading={isLoading} />
    </>
  );
}

export default CreatePod;