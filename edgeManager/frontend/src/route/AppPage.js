import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Admin from "route/Admin";
import Frame from "route/Frame";

function AppPage(props) {

  React.useEffect(() => {
    console.log("check")
  }, []);
  return (
    <Routes>
      <Route path="/views" element={<Admin />} />
      <Route path="/frame" element={<Frame />} />
      {/* <Route path="/" element={<Navigate to="/views/monitoring/edgeMonitoring" />} /> */}
    </Routes>
  );
}

export default AppPage;