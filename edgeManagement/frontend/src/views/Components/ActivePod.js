/* eslint-disable react/prop-types */
import { CircularProgress } from "@material-ui/core";
import { PlayArrowRounded } from "@material-ui/icons";
import axios from "axios";
import GridContainer from "components/Grid/GridContainer";
import GridItem from "components/Grid/GridItem";
import React from "react";
import Button from "components/CustomButtons/Button.js";
import SweetAlert from "react-bootstrap-sweetalert";
import { makeStyles } from "@material-ui/styles";
import styles from "assets/jss/material-dashboard-pro-react/views/sweetAlertStyle.js";

const useStyles = makeStyles(styles);

export default function ActivePod(props) {
  const [isPodRun, setIsPodRun] = React.useState(false);
  const [isAlert, setIsAlert] = React.useState(null);

  const classes = useStyles();

  return (
    <>
      <div style={{ ...props.getItemStyle(), padding: "9px 12px" }}>
        {isAlert}
        <GridContainer
          justify="center"
          alignItems="center"
          style={{ width: "100%" }}
        >
          <GridItem xs={8} style={{ lineBreak: "anywhere" }}>
            {props.item.content}
          </GridItem>
          <GridItem xs={4}>
            {isPodRun ? (
              <Button color="warning" size="sm" style={{ padding: "5px" }}>
                <CircularProgress size={18} color="white" /> &nbsp;running
              </Button>
            ) : (
              <Button
                color="warning"
                size="sm"
                onClick={() => {
                  if (props.namespace === "전체") {
                    alert("namespace를 선택해 주세요.");
                    return false;
                  }
                  if (
                    confirm(
                      `${props.node}의 ${props.item.content}을(를) 실행하시겠습니까?`
                    )
                  ) {
                    setIsPodRun((state) => !state);
                    axios(
                      `/rest/1.0/k8s/run/${props.namespace}/${props.item.content}`
                    ).then((res) => {
                      if (res.data === "ok") {
                        setIsAlert(
                          <SweetAlert
                            success
                            style={{
                              display: "block",
                              marginTop: "-100px",
                              color: "black",
                            }}
                            onConfirm={() => setIsAlert(null)}
                            onCancel={() => setIsAlert(null)}
                            confirmBtnCssClass={
                              classes.button + " " + classes.success
                            }
                          >
                            <b>{`"${props.item.content}" 서비스의 실행을 완료했습니다.`}</b>
                          </SweetAlert>
                        );
                        setIsPodRun((state) => !state);
                      }
                    });
                  }
                }}
                style={{ padding: "5px 13px" }}
              >
                <PlayArrowRounded /> start
              </Button>
            )}
          </GridItem>
        </GridContainer>
      </div>
    </>
  );
}
