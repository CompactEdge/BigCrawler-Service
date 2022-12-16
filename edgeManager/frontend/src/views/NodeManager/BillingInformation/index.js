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


// Material Dashboard 2 PRO React components
import MDBox from "components/MDBox";
import Bill from "../Bill";

// Billing page components

function BillingInformation() {
  return (
    <MDBox component="ul" display="flex" flexDirection="column" p={0} m={0}>
      <Bill
        preView1="1. 노드 확인"
        preView2="미리보기1"
        preView3="미리보기2"
        preView4="미리보기3"
      />
      <Bill
        preView1="2. 디렉토리 생성"
        preView2="미리보기1"
        preView3="미리보기2"
        preView4="미리보기3"
      />
    </MDBox>
  );
}

export default BillingInformation;
