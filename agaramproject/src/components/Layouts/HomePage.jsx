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
    <Box sx={{ display: "flex", height: "100%", overflow: "hidden" }}>

      {/* Sidebar */}
      <Box
        sx={{
          position: "fixed",
          left: 0,
          top: 0,
          bottom: 0,
          width: drawerWidthCollapsed,
          zIndex: 11,
        }}
      >
        <Sidebar setMasterTab={setMasterTab} />
      </Box>

      {/* TopBar */}
      <Box
        sx={{
          position: "fixed",
          top: 0,
          left: drawerWidthCollapsed,
          right: 0,
          height: topBarHeight,
          zIndex: 10,
          bgcolor: "white",
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
          overflow: "hidden",   // ⬅ FIX (prevent double scroll)
          bgcolor: "#f9fafc",
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
