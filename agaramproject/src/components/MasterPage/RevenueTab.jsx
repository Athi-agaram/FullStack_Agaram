// import React, { useEffect, useState, useCallback } from "react";
// import {
//   Box,
//   Table,
//   TableHead,
//   TableRow,
//   TableCell,
//   TableBody,
//   TableContainer,
//   Paper,
//   Typography,
// } from "@mui/material";
// import { getProducts } from "../../api/api";

// export default function RevenueDashboard({ user }) {
//   const [revenueData, setRevenueData] = useState([]);

//   const loadRevenue = useCallback(() => {
//     const teamName = user?.role === "ADMIN" ? "" : user.team_name;

//     getProducts(teamName)
//       .then((res) => {
//         const products = Array.isArray(res.data) ? res.data : [];

//         // Group by team + month
//         const revenueMap = {}; // { team: { month: {...} } }

//         products.forEach((p) => {
//           const team = p.team_name || "Unknown";
//           const month = p.sale_month || "Unknown";
//           const revenue = Number(p.price) * Number(p.quantity);

//           if (!revenueMap[team]) revenueMap[team] = {};
//           if (!revenueMap[team][month]) {
//             revenueMap[team][month] = { totalRevenue: 0, numSales: 0 };
//           }

//           revenueMap[team][month].totalRevenue += revenue;
//           revenueMap[team][month].numSales += 1;
//         });

//         // Flatten into array for table
//         const finalData = [];
//         Object.keys(revenueMap).forEach((team) => {
//           const months = Object.keys(revenueMap[team]);
//           const orderedMonths = [
//             "Jan", "Feb", "Mar", "Apr", "May", "Jun",
//             "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
//           ].filter((m) => months.includes(m));

//           orderedMonths.forEach((month, idx) => {
//             const entry = revenueMap[team][month];
//             const avgRevenue = entry.numSales
//               ? entry.totalRevenue / entry.numSales
//               : 0;

//             // Growth vs previous month
//             let growth = 0;
//             if (idx > 0) {
//               const prevRevenue =
//                 revenueMap[team][orderedMonths[idx - 1]].totalRevenue;
//               growth = prevRevenue
//                 ? ((entry.totalRevenue - prevRevenue) / prevRevenue) * 100
//                 : 0;
//             }

//             finalData.push({
//               id: finalData.length + 1,
//               team,
//               month,
//               totalRevenue: entry.totalRevenue,
//               numSales: entry.numSales,
//               avgRevenue,
//               growth,
//             });
//           });
//         });

//         setRevenueData(finalData);
//       })
//       .catch((err) => {
//         console.error("Error loading revenue data:", err);
//         setRevenueData([]);
//       });
//   }, [user]);

//   useEffect(() => {
//     loadRevenue();
//   }, [loadRevenue]);

//   // Helper for YTD Revenue
//   const getYTDRevenue = (team, currentMonth) => {
//     const monthOrder = [
//       "Jan", "Feb", "Mar", "Apr", "May", "Jun",
//       "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
//     ];
//     const currentIndex = monthOrder.indexOf(currentMonth);
//     return revenueData
//       .filter(
//         (d) =>
//           d.team === team &&
//           monthOrder.indexOf(d.month) <= currentIndex
//       )
//       .reduce((sum, d) => sum + d.totalRevenue, 0);
//   };

//   return (
//     <Box sx={{ p: 1,height: '100%' }}>


//       <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 0}}>
//         <Table size="medium">
//           <TableHead sx={{ backgroundColor: "#ffffffff" }}>
//             <TableRow>
//               <TableCell>ID</TableCell>
//               <TableCell>Team Name</TableCell>
//               <TableCell>Month</TableCell>
//               <TableCell align="right">Total Revenue (₹)</TableCell>
//               <TableCell align="right">Number of Sales</TableCell>
//               <TableCell align="right">Avg Revenue / Sale (₹)</TableCell>
//               <TableCell align="right">Growth vs Prev Month</TableCell>
//               <TableCell align="right">YTD Revenue (₹)</TableCell>
//             </TableRow>
//           </TableHead>

//           <TableBody>
//             {revenueData.length > 0 ? (
//               revenueData.map((r) => (
//                 <TableRow key={r.id}>
//                   <TableCell>{r.id}</TableCell>
//                   <TableCell>{r.team}</TableCell>
//                   <TableCell>{r.month}</TableCell>
//                   <TableCell align="right">
//                     {r.totalRevenue.toLocaleString()}
//                   </TableCell>
//                   <TableCell align="right">{r.numSales}</TableCell>
//                   <TableCell align="right">
//                     {r.avgRevenue.toFixed(2)}
//                   </TableCell>
//                   <TableCell
//                     align="right"
//                     sx={{
//                       color:
//                         r.growth > 0
//                           ? "green"
//                           : r.growth < 0
//                           ? "red"
//                           : "text.primary",
//                     }}
//                   >
//                     {r.growth.toFixed(2)}%
//                   </TableCell>
//                   <TableCell align="right">
//                     {getYTDRevenue(r.team, r.month).toLocaleString()}
//                   </TableCell>
//                 </TableRow>
//               ))
//             ) : (
//               <TableRow>
//                 <TableCell colSpan={8} align="center">
//                   No revenue data available
//                 </TableCell>
//               </TableRow>
//             )}
//           </TableBody>
//         </Table>
//       </TableContainer>
//     </Box>
//   );
// }

// import React, { useEffect, useState, useCallback } from "react";
// import { Box, Paper, Typography } from "@mui/material";
// import { DataGrid } from "@mui/x-data-grid";
// import { getProducts } from "../../api/api";

// export default function RevenueDashboard({ user }) {
//   const [rows, setRows] = useState([]);

//   const loadRevenue = useCallback(() => {
//     const teamName = user?.role === "ADMIN" ? "" : user.team_name;

//     getProducts(teamName)
//       .then((res) => {
//         const products = Array.isArray(res.data) ? res.data : [];
//         const revenueMap = {};

//         products.forEach((p) => {
//           const team = p.team_name || "Unknown";
//           const month = p.sale_month || "Unknown";
//           const revenue = Number(p.price) * Number(p.quantity);

//           if (!revenueMap[team]) revenueMap[team] = {};
//           if (!revenueMap[team][month]) {
//             revenueMap[team][month] = { totalRevenue: 0, numSales: 0 };
//           }

//           revenueMap[team][month].totalRevenue += revenue;
//           revenueMap[team][month].numSales += 1;
//         });

//         const finalData = [];
//         const monthsOrder = [
//           "Jan", "Feb", "Mar", "Apr", "May", "Jun",
//           "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
//         ];

//         Object.keys(revenueMap).forEach((team) => {
//           const months = Object.keys(revenueMap[team]).sort(
//             (a, b) => monthsOrder.indexOf(a) - monthsOrder.indexOf(b)
//           );

//           months.forEach((month, idx) => {
//             const entry = revenueMap[team][month];
//             const avgRevenue =
//               entry.numSales > 0
//                 ? entry.totalRevenue / entry.numSales
//                 : 0;

//             let growth = 0;
//             if (idx > 0) {
//               const prevMonth = months[idx - 1];
//               const prevRevenue = revenueMap[team][prevMonth].totalRevenue;
//               growth = prevRevenue
//                 ? ((entry.totalRevenue - prevRevenue) / prevRevenue) * 100
//                 : 0;
//             }

//             // YTD revenue
//             const ytd = months
//               .slice(0, idx + 1)
//               .reduce(
//                 (sum, m) => sum + revenueMap[team][m].totalRevenue,
//                 0
//               );

//             finalData.push({
//               id: finalData.length + 1,
//               team,
//               month,
//               totalRevenue: entry.totalRevenue,
//               numSales: entry.numSales,
//               avgRevenue,
//               growth,
//               ytd,
//             });
//           });
//         });

//         setRows(finalData);
//       })
//       .catch((err) => {
//         console.error("Error loading revenue data:", err);
//         setRows([]);
//       });
//   }, [user]);

//   useEffect(() => {
//     loadRevenue();
//   }, [loadRevenue]);

//   const columns = [
//     { field: "id", headerName: "ID", width: 70 },
//     { field: "team", headerName: "Team Name", width: 150 },
//     { field: "month", headerName: "Month", width: 120 },
//     {
//       field: "totalRevenue",
//       headerName: "Total Revenue (₹)",
//       width: 170,
//       type: "number",
//       valueFormatter: (params) =>
//         params?.value?.toLocaleString("en-IN") || "0",
//     },
//     {
//       field: "numSales",
//       headerName: "No. of Sales",
//       width: 130,
//       type: "number",
//     },
//     {
//       field: "avgRevenue",
//       headerName: "Avg Revenue / Sale (₹)",
//       width: 180,
//       type: "number",
//       valueFormatter: (params) =>
//         params?.value?.toFixed(2)?.toLocaleString("en-IN") || "0.00",
//     },
//     {
//       field: "growth",
//       headerName: "Growth (%)",
//       width: 130,
//       type: "number",
//       renderCell: (params) => (
//         <span
//           style={{
//             color:
//               params.value > 0
//                 ? "green"
//                 : params.value < 0
//                 ? "red"
//                 : "inherit",
//           }}
//         >
//           {params.value.toFixed(2)}%
//         </span>
//       ),
//     },
//     {
//       field: "ytd",
//       headerName: "YTD Revenue (₹)",
//       width: 170,
//       type: "number",
//       valueFormatter: (params) =>
//         params?.value?.toLocaleString("en-IN") || "0",
//     },
//   ];

//   return (
//     <Box
//       sx={{
//         p: 1,
//         width: "100%",
//         height: "calc(100vh - 100px)",
//         overflow: "hidden",
//         boxSizing: "border-box",
//         display: "flex",
//         flexDirection: "column",
//         alignItems: "center",
//         boxShadow:0
//       }}
//     >
//       <Paper
//         sx={{
//           width: "100%",
//           maxWidth: 1200, // ✅ prevents horizontal overflow
//           height: "100%",
//           borderRadius: 2,
//           boxShadow: 0,
//           overflow: "hidden",
//           display: "flex",
//           flexDirection: "column",
//         }}
//       >
//         <Box sx={{ flex: 1 }}>
//           <DataGrid
//             rows={rows}
//             columns={columns}
//             pageSize={8}
//             rowsPerPageOptions={[5, 8, 10, 20]}
//             disableRowSelectionOnClick
//             autoHeight={false}
//             sx={{
//               border: 0,
//               width: "100%",
//               ".MuiDataGrid-columnHeaders": {
//                 backgroundColor: "#ffffffff",
//                 fontWeight: "bold",
//               },
//             }}
//           />
//         </Box>
//       </Paper>
//     </Box>
//   );
// }


// import React, { useEffect, useState, useCallback } from "react";
// import {
//   Box,
//   Paper,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   TablePagination,
//   TableSortLabel,
// } from "@mui/material";
// import { getProducts } from "../../api/api";

// export default function RevenueDashboard({ user }) {
//   const [revenueData, setRevenueData] = useState([]);
//   const [order, setOrder] = useState("asc");
//   const [orderBy, setOrderBy] = useState("team");
//   const [page, setPage] = useState(0);
//   const [rowsPerPage, setRowsPerPage] = useState(5);

//   // ✅ Fetch Data from Backend
//   const loadRevenue = useCallback(() => {
//     const teamName = user?.role === "ADMIN" ? "" : user.team_name;

//     getProducts(teamName)
//       .then((res) => {
//         const products = Array.isArray(res.data) ? res.data : [];

//         const revenueMap = {}; // { team: { month: {...} } }

//         products.forEach((p) => {
//           const team = p.team_name || "Unknown";
//           const month = p.sale_month || "Unknown";
//           const revenue = Number(p.price) * Number(p.quantity);

//           if (!revenueMap[team]) revenueMap[team] = {};
//           if (!revenueMap[team][month]) {
//             revenueMap[team][month] = { totalRevenue: 0, numSales: 0 };
//           }

//           revenueMap[team][month].totalRevenue += revenue;
//           revenueMap[team][month].numSales += 1;
//         });

//         const monthOrder = [
//           "Jan", "Feb", "Mar", "Apr", "May", "Jun",
//           "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
//         ];

//         const finalData = [];
//         Object.keys(revenueMap).forEach((team) => {
//           const months = Object.keys(revenueMap[team]);
//           const orderedMonths = monthOrder.filter((m) => months.includes(m));

//           orderedMonths.forEach((month, idx) => {
//             const entry = revenueMap[team][month];
//             const avgRevenue = entry.numSales
//               ? entry.totalRevenue / entry.numSales
//               : 0;

//             // Growth calculation
//             let growth = 0;
//             if (idx > 0) {
//               const prevRevenue =
//                 revenueMap[team][orderedMonths[idx - 1]].totalRevenue;
//               growth = prevRevenue
//                 ? ((entry.totalRevenue - prevRevenue) / prevRevenue) * 100
//                 : 0;
//             }

//             finalData.push({
//               id: finalData.length + 1,
//               team,
//               month,
//               totalRevenue: entry.totalRevenue,
//               numSales: entry.numSales,
//               avgRevenue,
//               growth,
//             });
//           });
//         });

//         setRevenueData(finalData);
//       })
//       .catch((err) => {
//         console.error("Error loading revenue data:", err);
//         setRevenueData([]);
//       });
//   }, [user]);

//   useEffect(() => {
//     loadRevenue();
//   }, [loadRevenue]);

//   // ✅ YTD Revenue Helper
//   const getYTDRevenue = (team, currentMonth) => {
//     const monthOrder = [
//       "Jan", "Feb", "Mar", "Apr", "May", "Jun",
//       "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
//     ];
//     const currentIndex = monthOrder.indexOf(currentMonth);
//     return revenueData
//       .filter(
//         (d) =>
//           d.team === team && monthOrder.indexOf(d.month) <= currentIndex
//       )
//       .reduce((sum, d) => sum + d.totalRevenue, 0);
//   };

//   // ✅ Sorting Logic
//   const handleSort = (property) => {
//     const isAsc = orderBy === property && order === "asc";
//     setOrder(isAsc ? "desc" : "asc");
//     setOrderBy(property);
//   };

//   const sortedData = [...revenueData].sort((a, b) => {
//     if (orderBy === "totalRevenue" || orderBy === "numSales" || orderBy === "avgRevenue" || orderBy === "growth") {
//       return order === "asc" ? a[orderBy] - b[orderBy] : b[orderBy] - a[orderBy];
//     } else {
//       return order === "asc"
//         ? a[orderBy].localeCompare(b[orderBy])
//         : b[orderBy].localeCompare(a[orderBy]);
//     }
//   });

//   // ✅ Pagination Handlers
//   const handleChangePage = (event, newPage) => setPage(newPage);
//   const handleChangeRowsPerPage = (event) => {
//     setRowsPerPage(parseInt(event.target.value, 10));
//     setPage(0);
//   };

//   return (
//     <Box sx={{ p: 1, maxWidth: "100%", overflowX: "auto" }}>
//       <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 0 }}>
//         <Table size="medium">
//           <TableHead>
//             <TableRow>
//               {[
//                 { id: "id", label: "ID" },
//                 { id: "team", label: "Team Name"  },
//                 { id: "month", label: "Month" },
//                 { id: "totalRevenue", label: "Total Revenue (₹)" },
//                 { id: "numSales", label: "Number of Sales" },
//                 { id: "avgRevenue", label: "Avg Revenue / Sale (₹)" },
//                 { id: "growth", label: "Growth (%)" },
//                 { id: "ytd", label: "YTD Revenue (₹)" },
//               ].map((headCell) => (
//                 <TableCell
//                   key={headCell.id}
//                   sortDirection={orderBy === headCell.id ? order : false}
//                   align={["totalRevenue", "numSales", "avgRevenue", "growth", "ytd"].includes(headCell.id) ? "right" : "left"}
//                 >
//                   {headCell.id !== "ytd" ? (
//                     <TableSortLabel
//                       active={orderBy === headCell.id}
//                       direction={orderBy === headCell.id ? order : "asc"}
//                       onClick={() => handleSort(headCell.id)}
//                     >
//                       {headCell.label}
//                     </TableSortLabel>
//                   ) : (
//                     headCell.label
//                   )}
//                 </TableCell>
//               ))}
//             </TableRow>
//           </TableHead>

//           <TableBody>
//             {sortedData.length > 0 ? (
//               sortedData
//                 .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
//                 .map((r) => (
//                   <TableRow key={r.id}>
//                     <TableCell>{r.id}</TableCell>
//                     <TableCell>{r.team}</TableCell>
//                     <TableCell>{r.month}</TableCell>
//                     <TableCell align="right">{r.totalRevenue.toLocaleString()}</TableCell>
//                     <TableCell align="right">{r.numSales}</TableCell>
//                     <TableCell align="right">{r.avgRevenue.toFixed(2)}</TableCell>
//                     <TableCell
//                       align="right"
//                       sx={{
//                         color: r.growth > 0 ? "green" : r.growth < 0 ? "red" : "text.primary",
//                       }}
//                     >
//                       {r.growth.toFixed(2)}%
//                     </TableCell>
//                     <TableCell align="right">
//                       {getYTDRevenue(r.team, r.month).toLocaleString()}
//                     </TableCell>
//                   </TableRow>
//                 ))
//             ) : (
//               <TableRow>
//                 <TableCell colSpan={8} align="center">
//                   No revenue data available
//                 </TableCell>
//               </TableRow>
//             )}
//           </TableBody>
//         </Table>
//         <TablePagination
//           rowsPerPageOptions={[5,20]}
//           component="div"
//           count={sortedData.length}
//           rowsPerPage={rowsPerPage}
//           page={page}
//           onPageChange={handleChangePage}
//           onRowsPerPageChange={handleChangeRowsPerPage}
//         />
//       </TableContainer>
//     </Box>
//   );
// }


















































// import React, { useEffect, useState, useCallback } from "react";
// import {
//   Box,
//   Table,
//   TableHead,
//   TableRow,
//   TableCell,
//   TableBody,
//   TableContainer,
//   Paper,
//   TableSortLabel,
//   TablePagination,
// } from "@mui/material";
// import { getProducts } from "../../api/api";

// export default function RevenueDashboard({ user }) {
//   const [revenueData, setRevenueData] = useState([]);
//   const [order, setOrder] = useState("asc");
//   const [orderBy, setOrderBy] = useState("month");
//   const [page, setPage] = useState(0);
//   const [rowsPerPage, setRowsPerPage] = useState(7);
  

//   const loadRevenue = useCallback(() => {
//     const teamName = user?.role === "ADMIN" ? "" : user.team_name;

//     getProducts(teamName)
//       .then((res) => {
//         const products = Array.isArray(res.data) ? res.data : [];
//         const revenueMap = {};

//         products.forEach((p) => {
//           const team = p.team_name || "Unknown";
//           const month = p.sale_month || "Unknown";
//           const revenue = Number(p.price) * Number(p.quantity);

//           if (!revenueMap[team]) revenueMap[team] = {};
//           if (!revenueMap[team][month]) {
//             revenueMap[team][month] = { totalRevenue: 0, numSales: 0 };
//           }

//           revenueMap[team][month].totalRevenue += revenue;
//           revenueMap[team][month].numSales += 1;
//         });

//         const finalData = [];
//         Object.keys(revenueMap).forEach((team) => {
//           const months = Object.keys(revenueMap[team]);
//           const orderedMonths = [
//             "Jan", "Feb", "Mar", "Apr", "May", "Jun",
//             "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
//           ].filter((m) => months.includes(m));

//           orderedMonths.forEach((month, idx) => {
//             const entry = revenueMap[team][month];
//             const avgRevenue =
//               entry.numSales > 0 ? entry.totalRevenue / entry.numSales : 0;

//             let growth = 0;
//             if (idx > 0) {
//               const prevRevenue =
//                 revenueMap[team][orderedMonths[idx - 1]].totalRevenue;
//               growth = prevRevenue
//                 ? ((entry.totalRevenue - prevRevenue) / prevRevenue) * 100
//                 : 0;
//             }

//             finalData.push({
//               id: finalData.length + 1,
//               team,
//               month,
//               totalRevenue: entry.totalRevenue,
//               numSales: entry.numSales,
//               avgRevenue,
//               growth,
//             });
//           });
//         });

//         setRevenueData(finalData);
//       })
//       .catch((err) => {
//         console.error("Error loading revenue data:", err);
//         setRevenueData([]);
//       });
//   }, [user]);

//   useEffect(() => {
//     loadRevenue();
//   }, [loadRevenue]);

//   // Compute YTD revenue
//   const getYTDRevenue = (team, currentMonth) => {
//     const monthOrder = [
//       "Jan", "Feb", "Mar", "Apr", "May", "Jun",
//       "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
//     ];
//     const currentIndex = monthOrder.indexOf(currentMonth);
//     return revenueData
//       .filter(
//         (d) =>
//           d.team === team && monthOrder.indexOf(d.month) <= currentIndex
//       )
//       .reduce((sum, d) => sum + d.totalRevenue, 0);
//   };

//   // Sorting handler
//   const handleSort = (property) => {
//     const isAsc = orderBy === property && order === "asc";
//     setOrder(isAsc ? "desc" : "asc");
//     setOrderBy(property);
//   };

//   const sortedData = [...revenueData].sort((a, b) => {
//     if (a[orderBy] < b[orderBy]) return order === "asc" ? -1 : 1;
//     if (a[orderBy] > b[orderBy]) return order === "asc" ? 1 : -1;
//     return 0;
//   });

//   // Pagination handlers
//   const handleChangePage = (_, newPage) => setPage(newPage);
//   const handleChangeRowsPerPage = (event) => {
//     setRowsPerPage(parseInt(event.target.value, 10));
//     setPage(0);
//   };

//   return (
//     <Box sx={{ width: "100%", flex: 1, overflow: "hidden" }}>
//       <TableContainer
//         component={Paper}
//         sx={{
//           borderRadius: 1,
//           boxShadow: 0,
//           // maxHeight: 500,
//           // overflowX:"hidden",
//           // overflowY: "hidden",
//           whiteSpace: "wrap",
//         }}
//       >
//         <Table >
//           <TableHead sx={{ backgroundColor: "#f5f5f5",height:"28px" }}>
//             <TableRow>
//               {[
//                 { id: "id", label: "ID", width: 50 },
//                 { id: "team", label: "Team Name", width: 80 },
//                 { id: "month", label: "Month", width: 50 },
//                 { id: "totalRevenue", label: "Total Revenue", width: 50 },
//                 { id: "numSales", label: "Sales", width: 50 },
//                 { id: "avgRevenue", label: "Avg Revenue", width: 80 },
//                 { id: "growth", label: "Growth (%)", width: 70 },
//                 { id: "ytd", label: "YTD Revenue", width: 90 },
//               ].map((headCell) => (
//                 <TableCell
//                   key={headCell.id}
//                   sx={{
//                     width: headCell.width,
//                     maxWidth: 900,
//                     fontWeight: "600",
//                     bgcolor:"#e4e4e4ff"
//                   }}
//                   align={
//                     [
//                       "totalRevenue",
//                       "numSales",
//                       "avgRevenue",
//                       "growth",
//                       "ytd",
//                     ].includes(headCell.id)
//                       ? "right"
//                       : "left"
//                   }
//                   sortDirection={orderBy === headCell.id ? order : false}
//                 >
//                   {headCell.id !== "ytd" ? (
//                     <TableSortLabel
//                       active={orderBy === headCell.id}
//                       direction={orderBy === headCell.id ? order : "asc"}
//                       onClick={() => handleSort(headCell.id)}
//                     >
//                       {headCell.label}
//                     </TableSortLabel>
//                   ) : (
//                     headCell.label
//                   )}
//                 </TableCell>
//               ))}
//             </TableRow>
//           </TableHead>

//           <TableBody>
//             {sortedData.length > 0 ? (
//               sortedData
//                 .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
//                 .map((r, i) => (
//                   <TableRow key={r.id} hover>
//                     <TableCell sx={{ width: 70 }}>{page * rowsPerPage +i + 1}</TableCell>
//                     <TableCell sx={{ width: 100 }}>{r.team}</TableCell>
//                     <TableCell sx={{ width: 60 }}>{r.month}</TableCell>
//                     <TableCell align="right" sx={{ width: 70 }}>
//                       ₹{r.totalRevenue.toLocaleString()}
//                     </TableCell>
//                     <TableCell align="right" sx={{ width: 90 }}>
//                       {r.numSales}
//                     </TableCell>
//                     <TableCell align="right" sx={{ width: 100 }}>
//                       ₹{r.avgRevenue.toFixed(2)}
//                     </TableCell>
//                     <TableCell
//                       align="right"
//                       sx={{
//                         width: 90,
//                         color:
//                           r.growth > 0
//                             ? "green"
//                             : r.growth < 0
//                             ? "red"
//                             : "text.primary",
//                       }}
//                     >
//                       {r.growth.toFixed(2)}%
//                     </TableCell>
//                     <TableCell align="right" sx={{ width: 90 }}>
//                       ₹{getYTDRevenue(r.team, r.month).toLocaleString()}
//                     </TableCell>
//                   </TableRow>
//                 ))
//             ) : (
//               <TableRow>
//                 <TableCell colSpan={8} align="center">
//                   No revenue data available
//                 </TableCell>
//               </TableRow>
//             )}
//           </TableBody>
//         </Table>

//         {/* ✅ Pagination */}
//         <TablePagination
//           rowsPerPageOptions={[7, 14, 21, 50]}
//           component="div"
//           count={sortedData.length}
//           rowsPerPage={rowsPerPage}
//           page={page}
//           onPageChange={handleChangePage}
//           onRowsPerPageChange={handleChangeRowsPerPage}
//           sx={{mt:1}}
//         />
//       </TableContainer>
//     </Box>
//   );
// }





import React, { useEffect, useState } from "react";
import {
  Box,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  Paper,
  TableSortLabel,
  TablePagination
} from "@mui/material";
import { getRevenueDashboard } from "../../api/api";

export default function RevenueDashboard({ user }) {
  const [data, setData] = useState([]);
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("month");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(7);

  useEffect(() => {
    getRevenueDashboard()
      .then(res => {
        let filteredData = res.data;
        if (user?.role !== "ADMIN") {
          filteredData = filteredData.filter(d => d.team === user.team_name);
        }
        setData(filteredData);
      })
      .catch(err => console.error("Error loading revenue dashboard:", err));
  }, [user]);

  const handleSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const sortedData = [...data].sort((a, b) => {
    const aVal = a[orderBy];
    const bVal = b[orderBy];

    if (typeof aVal === "string") {
      return order === "asc" ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
    }
    return order === "asc" ? aVal - bVal : bVal - aVal;
  });

  return (
    <Box sx={{ width: "100%", flex: 1, overflow: "hidden" }}>
      <TableContainer component={Paper} sx={{ borderRadius: 1, boxShadow: 0 }}>
        <Table>
          <TableHead sx={{ backgroundColor: "#f5f5f5", height: "28px" }}>
            <TableRow>
              {[
                { id: "id", label: "ID" },
                { id: "team", label: "Team Name" },
                { id: "month", label: "Month" },
                { id: "total_revenue", label: "Total Revenue" },
                { id: "num_sales", label: "Sales" },
                { id: "avg_revenue", label: "Avg Revenue" },
                { id: "growth", label: "Growth (%)" },
                { id: "ytd_revenue", label: "YTD Revenue" }
              ].map(h => (
                <TableCell
                  key={h.id}
                  sx={{ fontWeight: 600 }}
                  align={["total_revenue","num_sales","avg_revenue","growth","ytd_revenue"].includes(h.id) ? "right" : "left"}
                >
                  {h.id !== "ytd_revenue" ? (
                    <TableSortLabel
                      active={orderBy === h.id}
                      direction={orderBy === h.id ? order : "asc"}
                      onClick={() => handleSort(h.id)}
                    >
                      {h.label}
                    </TableSortLabel>
                  ) : (
                    h.label
                  )}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {sortedData.length > 0 ? (
              sortedData
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map(r => (
                  <TableRow key={r.id} hover>
                    <TableCell>{r.id}</TableCell>
                    <TableCell>{r.team}</TableCell>
                    <TableCell>{r.month}</TableCell>
                    <TableCell align="right">₹{r.total_revenue.toLocaleString()}</TableCell>
                    <TableCell align="right">{r.num_sales}</TableCell>
                    <TableCell align="right">₹{r.avg_revenue.toFixed(2)}</TableCell>
                    <TableCell
                      align="right"
                      sx={{ color: r.growth > 0 ? "green" : r.growth < 0 ? "red" : "text.primary" }}
                    >
                      {r.growth.toFixed(2)}%
                    </TableCell>
                    <TableCell align="right">₹{r.ytd_revenue.toLocaleString()}</TableCell>
                  </TableRow>
                ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  No revenue data available
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        <TablePagination
          rowsPerPageOptions={[7, 14, 21, 50]}
          component="div"
          count={sortedData.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(_, newPage) => setPage(newPage)}
          onRowsPerPageChange={e => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }}
        />
      </TableContainer>
    </Box>
  );
}
