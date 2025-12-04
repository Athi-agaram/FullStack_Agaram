import React, { useState, useEffect } from "react";
import { Box } from "@mui/material";
import { useNavigate } from "react-router-dom"; 
import Sidebar from "./sidebar";
import MasterPage from "../../Pages/MasterPage/MasterPage";
import Dashboard from "../../Pages/DashboardPage/Dashboard";
import TopBar , { topBarHeight, drawerWidthCollapsed} from "./topbar";

export default function HomePage() {
  const navigate = useNavigate();

  // ✅ Initialize user directly from localStorage to avoid empty first render
  const [user, setUser] = useState(() => {
    return JSON.parse(localStorage.getItem("user")) || null;
  });

  const [masterTab, setMasterTab] = useState(null);

  // ✅ Navigate to ecommerce instantly when masterTab changes
  useEffect(() => {
    if (masterTab && masterTab.startsWith("store")) {
      navigate("/ecommerce");
    }
  }, [masterTab, navigate]);

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
      {user && (
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
      )}

      {/* Main Content */}
      <Box
        sx={{
          flex: 1,
          ml: `${drawerWidthCollapsed}px`,
          mt: `${topBarHeight}px`,
          height: `calc(100vh - ${topBarHeight}px)`,
          overflow: "hidden",
          bgcolor: "#f9fafc",
        }}
      >
        {masterTab && !masterTab.startsWith("store") ? (
          <MasterPage selectedTab={masterTab} />
        ) : (
          <Dashboard />
        )}
      </Box>
    </Box>
  );
}
