
// import React, { useState, useEffect } from "react";
// import { Box, Paper, Tabs, Tab, Typography } from "@mui/material";
// import EmployeeTab from "./EmployeeTab";
// import ProductSalesTab from "./ProductTab";
// import RevenueTab from "./RevenueTab";

// export default function MasterPage({ selectedTab }) {
//   const user = JSON.parse(localStorage.getItem("user") || "null");

//   const tabMap = { employee: 0, product: 1, revenue: 2 };
//   const tabKeys = ["employee", "product", "revenue"];
//   const [tab, setTab] = useState(selectedTab ? tabMap[selectedTab] : 0);

//   useEffect(() => {
//     if (selectedTab) {
//       setTab(tabMap[selectedTab]);
//     }
//   }, [selectedTab]);

//   if (!user) {
//     return (
//       <Box sx={{ p: 3 }}>
//         <Typography variant="h6">Not logged in</Typography>
//       </Box>
//     );
//   }

//   if (user.role !== "ADMIN" && !user.authorized) {
//     return (
//       <Box sx={{ p: 2 }}>
//         <Typography variant="h4" align="center" mt={25}>
//           You have logged in!<br />
//           Wait until the Administrator provides authorization.
//         </Typography>
//       </Box>
//     );
//   }

//   return (
 
//       <Paper sx={{ mt: -1.5, p: 2,ml:0,border:"none",boxShadow:"none" ,bgcolor:"#f9fafc"}}>
//         <Tabs
//           value={tab}
//           onChange={(e, v) => setTab(v)}
//           textColor="primary"
//           indicatorColor="primary"
//         >
//           <Tab label="Employees" />
//           <Tab label="Product Sales" />
//           <Tab label="Revenue" />
//         </Tabs>

//         {/* Render tab content */}
//         {tab === 0 && <EmployeeTab user={user} />}
//         {tab === 1 && <ProductSalesTab user={user} />}
//         {tab === 2 && <RevenueTab user={user} />}
//       </Paper>

//   );
// }



import React, { useState, useEffect } from "react";
import { Box, Paper, Tabs, Tab, Typography } from "@mui/material";
import EmployeeTab from "./EmployeeTab";
import ProductTab from "./ProductTab";
import RevenueTab from "./RevenueTab";

export default function MasterPage({ selectedTab }) {
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const tabMap = { employee: 0, product: 1, revenue: 2 };
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
      <Box sx={{ p: 2 }}>
        <Typography variant="h4" align="center" mt={25}>
          You have logged in!<br />
          Wait until the Administrator provides authorization.
        </Typography>
      </Box>
    );
  }

  return (
    <Paper
      sx={{
        mt: { xs: 0, sm: -1.5 },
        p: { xs: 1, sm: 2 },
        ml: 0,
        border: "none",
        boxShadow: "none",
        bgcolor: "#f9fafc",
      }}
    >
      <Tabs
        value={tab}
        onChange={(e, v) => setTab(v)}
        textColor="primary"
        indicatorColor="primary"
        variant="scrollable"
        scrollButtons="auto"
      >
        <Tab label="Employees" />
        <Tab label="Product Sales" />
        <Tab label="Revenue" />
      </Tabs>

      <Box sx={{ mt: 2, width: "100%", overflowX: "auto" }}>
        {tab === 0 && <EmployeeTab user={user} />}
        {tab === 1 && <ProductTab user={user} />}
        {tab === 2 && <RevenueTab user={user} />}
      </Box>
    </Paper>
  );
}
