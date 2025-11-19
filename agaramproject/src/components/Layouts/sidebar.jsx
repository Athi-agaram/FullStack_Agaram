import React, { useState, useEffect } from "react";
import { Drawer, List, ListItemButton, Box, Typography } from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import StorageIcon from "@mui/icons-material/Storage";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";

export default function Sidebar({ masterTab, setMasterTab }) {
  const [hovered, setHovered] = useState(null);
  const [activeKey, setActiveKey] = useState(() => {
    const savedKey = localStorage.getItem("activeKey");
    return savedKey || "dashboard"; // default dashboard
  });

  useEffect(() => {
    if (!masterTab) {
      setActiveKey("dashboard");
      localStorage.setItem("activeKey", "dashboard");
    } else {
      setActiveKey(masterTab);
      localStorage.setItem("activeKey", masterTab);
    }
  }, [masterTab]);

  const handleClick = (mainKey, subKey) => {
  let newKey = subKey || mainKey;

  // Default sub-tab if mainKey has subTabs and no subKey is passed
  const mainItem = items.find((i) => i.key === mainKey);
  if (mainItem?.subTabs && !subKey) {
    newKey = mainItem.subTabs[0].key; // first sub-tab
  }

  setActiveKey(newKey);
  setMasterTab(mainKey === "dashboard" ? null : newKey);
  localStorage.setItem("activeKey", newKey);
};


  const items = [
    { key: "dashboard", icon: <DashboardIcon /> },
    {
      key: "master",
      icon: <StorageIcon />,
      subTabs: [
        { key: "employee", label: "Employees" },
        { key: "product", label: "Product Sales" },
        { key: "revenue", label: "Revenue" },
      ],
    },
    {
  key: "store",
  icon: <ShoppingCartIcon />,
  subTabs: [
    { key: "store-categories", label: "Categories" },
    { key: "store-products", label: "Products" },
    { key: "store-cart", label: "Cart" },
    { key: "store-orders", label: "Orders" }
  ]
}

  ];

  return (
    <Drawer
      variant="permanent"
      anchor="left"
      PaperProps={{
        sx: { width: 72, bgcolor: "#0d47a1", color: "white", overflow: "visible" },
      }}
    >
      <List sx={{ mt: 2 }}>
        {items.map((it) => {
          const isActive =
            activeKey === it.key ||
            (it.subTabs && it.subTabs.some((t) => t.key === activeKey));

          return (
            <Box
              key={it.key}
              onMouseEnter={() => setHovered(it.key)}
              onMouseLeave={() => setHovered(null)}
              sx={{ position: "relative" }}
            >
              {/* Icon box with 3D flip */}
              <Box
                sx={{
                  width: 56,
                  height: 56,
                  margin: "0 auto 8px",
                  perspective: 600,
                  borderRadius: "12px",
                  overflow: "hidden",
                }}
              >
                <Box
                  sx={{
                    width: "100%",
                    height: "100%",
                    position: "relative",
                    transformStyle: "preserve-3d",
                    transition: "transform 0.6s",
                    transform: hovered === it.key ? "rotateY(180deg)" : "rotateY(0deg)",
                    cursor: "pointer",
                  }}
                  onClick={() => handleClick(it.key, null)}
                >
                  {/* Front: icon with active background */}
                  <Box
                    sx={{
                      position: "absolute",
                      width: "100%",
                      height: "100%",
                      backfaceVisibility: "hidden",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 28,
                      color: "white",
                      borderRadius: "12px",
                      bgcolor: isActive ? "rgba(255,255,255,0.3)" : "transparent",
                      boxShadow: isActive ? "0 0 8px rgba(255,255,255,0.4)" : "none",
                    }}
                  >
                    {it.icon}
                  </Box>

                  {/* Back: label */}
                  <Box
                    sx={{
                      position: "absolute",
                      width: "100%",
                      height: "100%",
                      backfaceVisibility: "hidden",
                      transform: "rotateY(180deg)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 11.5,
                      fontWeight: "bold",
                      color: "white",
                      borderRadius: "12px",
                    }}
                  >
                    {it.key[0].toUpperCase() + it.key.slice(1)}
                  </Box>
                </Box>
              </Box>

              {/* Sub-tabs */}
              {it.subTabs && hovered === it.key && (
                <Box
                  sx={{
                    position: "absolute",
                    top: 0,
                    left: 72,
                    bgcolor: "#f1f1f1",
                    borderRadius: "10px",
                    boxShadow: 4,
                    minWidth: 160,
                    zIndex: 10,
                    overflow: "hidden",
                  }}
                >
                  {it.subTabs.map((tab) => (
                    <ListItemButton
                      key={tab.key}
                      onClick={() => handleClick(it.key, tab.key)}
                      sx={{
                        py: 1,
                        bgcolor: activeKey === tab.key ? "#d9e2ff" : "white",
                        "&:hover": { bgcolor: "#d0d8ff" },
                        borderBottom: "1px solid #eee",
                        "&:last-child": { borderBottom: "none" },
                        transition: "background-color 0.25s",
                      }}
                    >
                      <Typography variant="body2" sx={{ color: "#000" }}>
                        {tab.label}
                      </Typography>
                    </ListItemButton>
                  ))}
                </Box>
              )}
            </Box>
          );
        })}
      </List>
    </Drawer>
  );
}
