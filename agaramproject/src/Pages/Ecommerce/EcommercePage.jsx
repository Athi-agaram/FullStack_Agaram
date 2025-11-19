import React, { useEffect, useState } from "react";
import { Paper, Tabs, Tab,Box } from "@mui/material";

import CategoriesPage from "./CategoriesPage";
import ProductGrid from "./components/ProductGrid";
import CartPage from "./CartPage";
import OrdersPage from "./OrderPage";

export default function EcommercePage({ selectedStoreTab }) {
  const tabMap = {
    "store-categories": 0,
    "store-products": 1,
    "store-cart": 2,
    "store-orders": 3
  };

  const tabKeys = [
    "store-categories",
    "store-products",
    "store-cart",
    "store-orders"
  ];

  const [tab, setTab] = useState(
    selectedStoreTab ? tabMap[selectedStoreTab] : 0
  );

  useEffect(() => {
    if (selectedStoreTab) {
      setTab(tabMap[selectedStoreTab]);
    }
  }, [selectedStoreTab]);

  return (
    <Paper
      sx={{
        mt: -1.5,
        p: 0,
        ml: 0,
        border: "none",
        boxShadow: "none",
        bgcolor: "#f9fafce1",
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* ------ Tabs UI (sticky) ------ */}
      <Tabs
        value={tab}
        onChange={(e, v) => setTab(v)}
        textColor="primary"
        indicatorColor="primary"
        sx={{
          position: "sticky",
          top: 0,
          zIndex: 10,
          bgcolor: "#f9fafce1", // same as Paper bg
          borderBottom: "1px solid rgba(0,0,0,0.1)", // optional shadow/border
        }}
      >
        <Tab label="Categories" />
        <Tab label="Products" />
        <Tab label="Cart" />
        <Tab label="Orders" />
      </Tabs>

      {/* ------ Tab Content ------ */}
      <Box sx={{ flex: 1, overflowY: "auto", p: 2 }}>
        {tab === 0 && <CategoriesPage />}
        {tab === 1 && <ProductGrid initialProducts={[]} />}
        {tab === 2 && <CartPage setTab={setTab} />}       
        {tab === 3 && <OrdersPage />}
      </Box>
    </Paper>
  );
}
