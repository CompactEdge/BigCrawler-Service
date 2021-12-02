import { FormControl, makeStyles, MenuItem, Select } from "@material-ui/core";
import axios from "axios";
import ActivePod from "../Components/ActivePod.js";
import Card from "components/Card/Card";
import CardBody from "components/Card/CardBody";
import GridContainer from "components/Grid/GridContainer";
import GridItem from "components/Grid/GridItem";
import React from "react";
import _ from "lodash";
import CardHeader from "components/Card/CardHeader.js";
import styles from "assets/jss/material-dashboard-pro-react/views/extendedFormsStyle.js";

const useStyles = makeStyles(styles);

const getListStyle = () => ({
  borderRadius: 5,
  background: "white",
  border: "1px solid lightgrey",
  padding: 8,
  width: 270,
  height: 315,
  display: "inline-block",
  verticalAlign: "text-top",
  margin: "10px",
});

const getItemStyle = () => ({
  // some basic styles to make the items look a bit nicer
  userSelect: "none",
  borderRadius: 5,
  color: "#FFF",
  fontWeight: 700,
  padding: 16,
  margin: `0 0 8px 0`,
  textAlign: "center",
  background: "#4caf50",
});
export default function RunAppService() {
  const [namespaces, setNamespaces] = React.useState([]);
  const [selectNamespace, setSelectNamespace] = React.useState(
    sessionStorage.getItem("selectNamespace")
      ? sessionStorage.getItem("selectNamespace")
      : "전체"
  );
  const [state, setState] = React.useState({});
  const [masterNode, setMasterNode] = React.useState([]);

  React.useEffect(() => {
    let stateTmp = {};
    axios("/rest/1.0/k8s/namespace").then((res) => {
      let listNsTmp = [];
      res.data.map((ns) => {
        listNsTmp.push(ns.name);
      });
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
              runnable: podsData.container_port ? true : false,
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
              runnable: podsData.container_port ? true : false,
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
  }, [selectNamespace]);

  const classes = useStyles();

  return (
    <div>
      <Card>
        <CardHeader>
          <img src={"/logo_k8s_txt.png"} />
        </CardHeader>
        <CardBody>
          <GridContainer direction="row" justifycontent="space-between">
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
                    <div key={`${node}_${idx}`} style={getListStyle()}>
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
                          ? state[node].map((item, index) =>
                              item.runnable ? (
                                <ActivePod
                                  key={`${node}_${idx}_${item.content}_${index}`}
                                  node={node}
                                  item={item}
                                  getItemStyle={getItemStyle}
                                  runnable={item.runnable}
                                  namespace={selectNamespace}
                                />
                              ) : (
                                <div
                                  key={`${node}_${idx}_${item.content}_${index}`}
                                  style={getItemStyle()}
                                >
                                  {item.content}
                                </div>
                              )
                            )
                          : null}
                      </div>
                    </div>
                  );
                })
              : null}
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
