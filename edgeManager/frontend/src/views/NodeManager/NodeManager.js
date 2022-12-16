/**
=========================================================
* Material Dashboard 2 PRO React - v2.1.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-pro-react
* Copyright 2022 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

import React, { useState } from "react";

// @mui material components
import Grid from "@mui/material/Grid";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Card from "@mui/material/Card";

// Material Dashboard 2 PRO React components
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import MDTypography from "components/MDTypography";

// Material Dashboard 2 PRO React examples
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

// NewProduct page components
import ProductInfo from "./ProductInfo";
import Step1 from "./components/Step1";

function NodeManager() {
  const [activeStep, setActiveStep] = useState(0);
  const [rootData, setRootData] = useState(
    [
      {
        step: "서버 확인",
        content: [
          {
            title: "1. 노드 확인",
            content:
            {
              ip: "none",
              username: "none",
              password: "none",
              port: "none"
            },
          },
          {
            title: "2. 디렉토리 생성",
            content:
            {
              dirname: "none",
              path: "none"
            }
          }
        ]
      },
      {
        step: "OS 업데이트",
        content: [
          {
            title: "1. 업데이트 확인",
            content:
            {
              ip: "none",
              username: "none",
              password: "none",
              port: "none"
            },
          },
          {
            title: "2. 업데이트 생성",
            content:
            {
              dirname: "none",
              path: "none"
            }
          }
        ]
      },
      {
        step: "OS 설정",
        content: [
          {
            title: "1. 설정 확인",
            content:
            {
              ip: "none",
              username: "none",
              password: "none",
              port: "none"
            },
          },
          {
            title: "2. 설정 생성",
            content:
            {
              dirname: "none",
              path: "none"
            }
          }
        ]
      },
      {
        step: "기본 패키지  설치",
        content: [
          {
            title: "1. 패키지 확인",
            content:
            {
              ip: "none",
              username: "none",
              password: "none",
              port: "none"
            },
          },
          {
            title: "2. 패키지 생성",
            content:
            {
              dirname: "none",
              path: "none"
            }
          }
        ]
      },
      {
        step: "DOKER 설치",
        content: [
          {
            title: "1. DOKER 확인",
            content:
            {
              ip: "none",
              username: "none",
              password: "none",
              port: "none"
            },
          },
          {
            title: "2. DOKER 생성",
            content:
            {
              dirname: "none",
              path: "none"
            }
          }
        ]
      },
      {
        step: "KBS 설치",
        content: [
          {
            title: "1. KBS 확인",
            content:
            {
              ip: "none",
              username: "none",
              password: "none",
              port: "none"
            },
          },
          {
            title: "2. KBS 생성",
            content:
            {
              dirname: "none",
              path: "none"
            }
          }
        ]
      },
      {
        step: "WORKER 노드 추가",
        content: [
          {
            title: "1. WORKER 확인",
            content:
            {
              ip: "none",
              username: "none",
              password: "none",
              port: "none"
            },
          },
          {
            title: "2. WORKER 생성",
            content:
            {
              dirname: "none",
              path: "none"
            }
          }
        ]
      },
    ]
  );

  function getSteps() {
    let result = [];
    rootData.map(data => {
      result.push(data.step);
    });
    return result;
  };
  // function getSteps() {
  //   return ["서버 확인", "OS 업데이트", "OS 설정", "기본 패키지 설치", "Docker 설치", "K8S 설치", "Worker 노드 추가"];
  // }

  const steps = getSteps();
  const isLastStep = activeStep === steps.length - 1;

  const handleNext = () => setActiveStep(activeStep + 1);
  const handleBack = () => setActiveStep(activeStep - 1);

  React.useEffect(() => {
    console.log("activeStep: ", activeStep);
    console.log("text: ", rootData[activeStep].content);
  }, [activeStep]);

  return (
    <>
      <MDBox mt={8} mb={9}>
        <Grid container justifyContent="center">
          <Grid item xs={12} lg={12}>
            <Card>
              <MDBox mt={-3} mb={3} mx={2}>
                <Stepper activeStep={activeStep} alternativeLabel>
                  {steps.map((label) => (
                    <Step key={label}>
                      <StepLabel>{label}</StepLabel>
                    </Step>
                  ))}
                </Stepper>
              </MDBox>
              <MDBox p={2}>
                <MDBox mt={3}>
                  <Step1 data={rootData} stepIndex={activeStep}/>
                  <MDBox width="100%" display="flex" justifyContent="space-between">
                    {activeStep === 0 ? (
                      <MDBox />
                    ) : (
                      <MDButton variant="gradient" color="light" onClick={handleBack}>
                        back
                      </MDButton>
                    )}
                    <MDButton
                      variant="gradient"
                      color="dark"
                      onClick={!isLastStep ? handleNext : ()=>{ alert("finish")}}
                    >
                      {isLastStep ? "finish" : "next"}
                    </MDButton>
                  </MDBox>
                </MDBox>
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
    </>
  );
}

export default NodeManager;
