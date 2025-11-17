// import React from "react";
// import { Box, Paper, Typography } from "@mui/material";
// import { Routes, Route, Navigate, useLocation } from "react-router-dom";
// import EmployeeTab from "./EmployeeTab";
// import ProductSalesTab from "./ProductTab";
// import RevenueTab from "./RevenueTab";


// export default function MasterPage() {
//   const user = JSON.parse(localStorage.getItem("user") || "null");

//   if (!user) {
//     return (
//       <Box sx={{ p: 3 }}>
//         <Typography variant="h6">Not logged in</Typography>
//       </Box>
//     );
//   }

//   if (user.role !== "ADMIN" && !user.authorized) {
//     return (
//       <Box sx={{ p: 3 }}>
//         <Typography variant="h4" align="center" mt={25}>
//           You have logged in!<br /> Wait until the Administrator provides authorization.
//         </Typography>
//       </Box>
//     );
//   }

//   return (
//     <Box sx={{ p: 1 }}>
//       <Paper sx={{ mt: 1, p: 2 }}>
//         <Routes>
//           {/* Default route redirects to employee tab */}
//           <Route path="/" element={<Navigate to="employee" replace />} />

//           {/* Sub-tabs */}
//           <Route path="employee" element={<EmployeeTab user={user} />} />
//           <Route path="product" element={<ProductSalesTab user={user} />} />
//           <Route path="revenue" element={<RevenueTab user={user} />} />
//         </Routes>
//       </Paper>
//     </Box>
//   );
// }


import React, { useState, useEffect } from "react";
import { Box, Paper, Tabs, Tab, Typography } from "@mui/material";
import EmployeeTab from "./EmployeeTab";
import ProductSalesTab from "./ProductTab";
import RevenueTab from "./RevenueTab";

export default function MasterPage({ selectedTab }) {
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const tabMap = { employee: 0, product: 1, revenue: 2 };
  const tabKeys = ["employee", "product", "revenue"];
  const [tab, setTab] = useState(selectedTab ? tabMap[selectedTab] : 0);

  useEffect(() => {
    if (selectedTab) {
      setTab(tabMap[selectedTab]);
    }
  }, [selectedTab]);

  if (!user) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h6">Not logged in</Typography>
      </Box>
    );
  }

  if (user.role !== "ADMIN" && !user.authorized) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" align="center" mt={25}>
          You have logged in!<br />
          Wait until the Administrator provides authorization.
        </Typography>
      </Box>
    );
  }

  return (
 
      <Paper sx={{ mt: -1.5, p: 0,ml:0,border:"none",boxShadow:"none" ,bgcolor:"#f9fafc"}}>
        <Tabs
          value={tab}
          onChange={(e, v) => setTab(v)}
          textColor="primary"
          indicatorColor="primary"
        >
          <Tab label="Employees" />
          <Tab label="Product Sales" />
          <Tab label="Revenue" />
        </Tabs>

        {/* Render tab content */}
        {tab === 0 && <EmployeeTab user={user} />}
        {tab === 1 && <ProductSalesTab user={user} />}
        {tab === 2 && <RevenueTab user={user} />}
      </Paper>

  );
}
