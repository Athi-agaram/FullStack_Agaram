// import React from "react";
// import { Box } from "@mui/material";
// import Dashboard from "../components/DashboardPage/Dashboard";
// import Sidebar from "../components/sidebar";
// import MasterPage from "../components/MasterPage/MasterPage";
// import { Routes, Route, Navigate } from "react-router-dom";

// export default function HomePage() {
//   return (
//     <Box sx={{ display: "flex", minHeight: "100vh" }}>
//       <Sidebar />
//       <Box component="main" sx={{ flex: 1, ml: "72px", bgcolor: "#f6f8fb" }}>
//         <Routes>
//           <Route path="/" element={<Dashboard />} />
//           <Route path="/master" element={<MasterPage />} />
//           <Route path="*" element={<Navigate to="/" replace />} />
//         </Routes>
//       </Box>
//     </Box>
//   );
// }


// import React, { useState } from "react";
// import { Box } from "@mui/material";
// import Dashboard from "../components/DashboardPage/Dashboard";
// import Sidebar from "../components/sidebar";
// import MasterPage from "../components/MasterPage/MasterPage";

// export default function HomePage() {
//   // ✅ Default: Dashboard (null means no master tab selected)
//   const [masterTab, setMasterTab] = useState(null);

//   return (
//     <Box sx={{ display: "flex", minHeight: "100vh" }}>
//       <Sidebar setMasterTab={setMasterTab} />
//       <Box
//         component="main"
//         sx={{


import React, { useEffect, useState } from "react";
import { Box } from "@mui/material";
import Sidebar from "../components/sidebar";
import MasterPage from "../components/MasterPage/MasterPage";
import Dashboard from "../components/DashboardPage/Dashboard";
import TopBar, { topBarHeight, drawerWidthCollapsed } from "../components/topbar";

export default function HomePage() {
  const [masterTab, setMasterTab] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  return (
    <Box sx={{ display: "flex", height: "100vh", overflow: "hidden" }}>
      
      {/* Sidebar */}
      <Sidebar setMasterTab={setMasterTab} />

      {/* TopBar FIXED */}
      <Box
        sx={{
          position: "fixed",
          top: 0,
          left: drawerWidthCollapsed,
          right: 0,
          height: topBarHeight,
          zIndex: 10,
          bgcolor: "white",
          boxShadow: 1,
        }}
      >
        <TopBar user={user} setMasterTab={setMasterTab} />
      </Box>

      {/* Main Content */}
      <Box
        sx={{
          flex: 1,
          ml: `${drawerWidthCollapsed}px`,
          mt: `${topBarHeight}px`,
          height: `calc(100vh - ${topBarHeight}px)`,
          overflowY: "auto",
          bgcolor: "#f9fafc",
          p: 2,
        }}
      >
        {masterTab ? <MasterPage selectedTab={masterTab} /> : <Dashboard />}
      </Box>
    </Box>
  );
}
