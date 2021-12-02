import { FormControl, makeStyles, MenuItem, Select } from "@material-ui/core";
import styles from "assets/jss/material-dashboard-pro-react/views/extendedFormsStyle.js";
import axios from "axios";
import Card from "components/Card/Card";
import CardBody from "components/Card/CardBody";
import CardHeader from "components/Card/CardHeader";
import GridContainer from "components/Grid/GridContainer";
import GridItem from "components/Grid/GridItem";
import _ from "lodash";
import React from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { useDispatch } from "react-redux";
import { offLoad, onLoad } from "store/indicator";

const useStyles = makeStyles(styles);

const getContainerListStyle = (isDraggingOver) => ({
  borderRadius: 5,
  background: isDraggingOver ? "lightyellow" : "white",
  border: "1px solid lightgrey",
  padding: 8,
  margin: "10px",
  width: "calc(100% - 15px)",
});

const getContainerItemStyle = (isDragging, draggableStyle) => ({
  // some basic styles to make the items look a bit nicer
  borderRadius: 5,
  color: "#FFF",
  fontWeight: 700,
  userSelect: "none",
  padding: 16,
  margin: `8px 8px 8px 0`,
  width: 235,
  background: isDragging ? "darkorange" : "#ff9800",
  textAlign: "center",
  ...draggableStyle,
});

const getListStyle = (isDraggingOver) => ({
  borderRadius: 5,
  background: isDraggingOver ? "yellowgreen" : "white",
  border: "1px solid lightgrey",
  padding: 8,
  width: 236,
  height: 315,
  display: "inline-block",
  verticalAlign: "text-top",
  margin: "10px",
});

const getItemStyle = (isDragging, draggableStyle) => ({
  // some basic styles to make the items look a bit nicer
  userSelect: "none",
  borderRadius: 5,
  color: "#FFF",
  fontWeight: 700,
  padding: 16,
  margin: `0 0 8px 0`,
  textAlign: "center",
  background: isDragging ? "lightgreen" : "#4caf50",
  ...draggableStyle,
});

export default function DeployContainer() {
  const [namespaces, setNamespaces] = React.useState([]);
  const [selectNamespace, setSelectNamespace] = React.useState(
    sessionStorage.getItem("selectNamespace")
      ? sessionStorage.getItem("selectNamespace")
      : "전체"
  );
  const [state, setState] = React.useState({});
  const [masterNode, setMasterNode] = React.useState([]);

  const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
  };

  const onDragEnd = (result) => {
    const { source, destination } = result;
    // dropped outside the list
    if (!destination) {
      if (selectNamespace === "전체") {
        alert("namespace를 선택해주세요");
        return false;
      }
      if (
        source.droppableId !== "images" &&
        confirm(
          `${state[source.droppableId][source.index]["content"]}을(를) ${
            source.droppableId
          }에서 제거하시겠습니까?`
        )
      ) {
        dispatch(onLoad());
        axios
          .delete(
            `/rest/1.0/k8s/pod/${selectNamespace}/${
              state[source.droppableId][source.index]["content"]
            }`
          )
          .then((res) => {
            alert(res.data);
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
                selectNamespace === "전체" ? "" : _.cloneDeep(selectNamespace);

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
                    if (res.data.length) {
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
          });
      }
      return;
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

      if (source.droppableId === "images") {
        if (selectNamespace === "전체") {
          alert("namespace를 선택해주세요");
          return false;
        }
        if (
          confirm(
            `${state[source.droppableId][source.index]["content"]}을(를) ${
              destination.droppableId
            }에 추가하시겠습니까?`
          )
        ) {
          const newPodName = prompt("pod 이름을 입력해주세요.");
          if (newPodName === "") {
            alert("pod 이름을 입력해주세요.");
            return false;
          }

          dispatch(onLoad());
          axios
            .post(
              `/rest/1.0/k8s/pod/${selectNamespace}/${
                destination.droppableId
              }/${
                state[source.droppableId][source.index]["content"]
              }/${newPodName}`
            )
            .then((res) => {
              alert(res.data);
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
                  selectNamespace === "전체"
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
                      if (res.data.length) {
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
            });
        }
      }
    }
  };

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
        selectNamespace === "전체" ? "" : _.cloneDeep(selectNamespace);

      axios(`/rest/1.0/k8s/pod?namespace=${selectNsTmp}`).then((res) => {
        let podsTmp = [];
        if (res.data.length) {
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
    sessionStorage.setItem("selectNamespace", selectNamespace);
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
        selectNamespace === "전체" ? "" : _.cloneDeep(selectNamespace);

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
          if (res.data.length) {
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
    });
  }, [selectNamespace]);

  const classes = useStyles();
  const dispatch = useDispatch();
  return (
    <div>
      <DragDropContext onDragEnd={onDragEnd}>
        <Card>
          <CardHeader>
            <img src={"/logo_k8s_txt.png"} />
          </CardHeader>
          <CardBody>
            <GridContainer direction="row" justify="space-between">
              <GridItem sm={6} md={10}>
                <div>
                  <div>
                    <legend>Master Node</legend>
                  </div>
                  <div
                    style={{
                      ...getListStyle(),
                      height: "100%",
                    }}
                  >
                    {masterNode.length > 0
                      ? masterNode.map((msNode) => {
                          return (
                            <div key={`masterNode_${msNode}`}>
                              Node Name: {msNode}
                            </div>
                          );
                        })
                      : null}
                  </div>
                </div>
              </GridItem>
              <GridItem sm={6} md={2}>
                <div>
                  <div>
                    <legend>Namespace</legend>
                  </div>
                  <FormControl fullWidth className={classes.selectFormControl}>
                    <Select
                      MenuProps={{
                        className: classes.selectMenu,
                      }}
                      classes={{
                        select: classes.select,
                      }}
                      value={selectNamespace || ""}
                      onChange={(event) => {
                        setSelectNamespace(event.target.value);
                      }}
                      fullWidth
                    >
                      <MenuItem
                        disabled
                        classes={{
                          root: classes.selectMenuItem,
                        }}
                      >
                        Namespace
                      </MenuItem>
                      <MenuItem
                        classes={{
                          root: classes.selectMenuItem,
                          selected: classes.selectMenuItemSelected,
                        }}
                        value={"전체"}
                      >
                        전체
                      </MenuItem>
                      {namespaces.map((ns, idx) => {
                        return (
                          <MenuItem
                            classes={{
                              root: classes.selectMenuItem,
                              selected: classes.selectMenuItemSelected,
                            }}
                            key={`${ns}_${idx}`}
                            value={ns}
                          >
                            {ns}
                          </MenuItem>
                        );
                      })}
                    </Select>
                  </FormControl>
                </div>
              </GridItem>
            </GridContainer>

            <div style={{ marginTop: "50px" }}>
              <div>
                <legend>Worker Nodes</legend>
              </div>
              {state["nodes"]
                ? state["nodes"].map((node, idx) => {
                    return (
                      <Droppable droppableId={node} key={`${node}-${idx}`}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            style={getListStyle(snapshot.isDraggingOver)}
                          >
                            <div
                              style={{
                                marginBottom: "10px",
                              }}
                            >
                              Node Name: {node}
                              <br />
                              Pod List:
                            </div>
                            <div style={{ overflowY: "auto", height: "244px" }}>
                              {state[node]
                                ? state[node].map((item, index) => (
                                    <Draggable
                                      key={item.id}
                                      draggableId={item.id}
                                      index={index}
                                    >
                                      {(provided, snapshot) => (
                                        <div
                                          ref={provided.innerRef}
                                          {...provided.draggableProps}
                                          {...provided.dragHandleProps}
                                          style={getItemStyle(
                                            snapshot.isDragging,
                                            provided.draggableProps.style
                                          )}
                                        >
                                          {item.content}
                                        </div>
                                      )}
                                    </Draggable>
                                  ))
                                : null}
                              {provided.placeholder}
                            </div>
                          </div>
                        )}
                      </Droppable>
                    );
                  })
                : null}
            </div>
          </CardBody>
        </Card>
        <Card>
          <CardHeader>
            <img src={"/logo_docker.png"} />
          </CardHeader>
          <CardBody>
            <div>
              <div>
                <legend>Docker local repository</legend>
              </div>
              <Droppable droppableId="images" direction="horizontal">
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    style={{
                      ...getContainerListStyle(snapshot.isDraggingOver),
                    }}
                  >
                    <div>Image List:</div>
                    <div style={{ display: "inline-flex", flexWrap: "wrap" }}>
                      {state["images"]
                        ? state["images"].map((item, index) => (
                            <Draggable
                              key={item.id}
                              draggableId={item.id}
                              index={index}
                            >
                              {(provided, snapshot) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  style={getContainerItemStyle(
                                    snapshot.isDragging,
                                    provided.draggableProps.style
                                  )}
                                >
                                  {item.content}
                                </div>
                              )}
                            </Draggable>
                          ))
                        : null}
                      {provided.placeholder}
                    </div>
                  </div>
                )}
              </Droppable>
            </div>
          </CardBody>
        </Card>
      </DragDropContext>
    </div>
  );
}
