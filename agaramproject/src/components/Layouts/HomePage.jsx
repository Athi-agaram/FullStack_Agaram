import React, { useEffect, useState } from "react";
import { Box } from "@mui/material";
import Sidebar from "./sidebar";
import MasterPage from "../../Pages/MasterPage/MasterPage";
import Dashboard from "../../Pages/DashboardPage/Dashboard";
import TopBar , { topBarHeight, drawerWidthCollapsed} from "./topbar";
import EcommercePage from "../../Pages/Ecommerce/EcommercePage";

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
      
      {/* Sidebar - fixed position */}
      <Box sx={{ position: "fixed", left: 0, top: 0, bottom: 0, width: drawerWidthCollapsed, zIndex: 11 }}>
        <Sidebar setMasterTab={setMasterTab} />
      </Box>

      {/* TopBar - fixed, aligned with sidebar */}
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

      {/* Main Content - no gap */}
      <Box
        sx={{
          flex: 1,
          ml: `${drawerWidthCollapsed}px`, // keeps content next to sidebar
          mt: `${topBarHeight}px`,
          height: `calc(100vh - ${topBarHeight}px)`,
          overflowY: "auto",
          bgcolor: "#f9fafc",
          p: 2,
        }}
      >
        {masterTab ? (
          masterTab.startsWith("store")
            ? <EcommercePage selectedStoreTab={masterTab} />
            : <MasterPage selectedTab={masterTab} />
        ) : (
          <Dashboard />
        )}
      </Box>
    </Box>
  );
}
