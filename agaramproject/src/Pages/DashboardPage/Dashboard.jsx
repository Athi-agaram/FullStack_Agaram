// import React, { useEffect, useState, useCallback } from "react";
// import {
//   Box,
//   Grid,
//   Card,
//   CardContent,
//   Typography,
// } from "@mui/material";
// import {
//   PieChart,
//   Pie,
//   Cell,
//   ResponsiveContainer,
//   Tooltip as ReTooltip,
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Legend,
//   BarChart,
//   Bar,
// } from "recharts";
// import { getProducts, getAllUsers } from "../../api/api";

// const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7f50", "#8dd1e1"];

// export default function Dashboard() {
//   const user = JSON.parse(localStorage.getItem("user") || "null");

//   // --- Hooks ---
//   const [summary, setSummary] = useState({
//     totalRevenue: 0,
//     totalSales: 0,
//     totalEmployees: 0,
//     totalTeams: 0,
//     topTeam: "N/A",
//   });
//   const [monthlyRevenue, setMonthlyRevenue] = useState([]);
//   const [progressData, setProgressData] = useState([]);
//   const [roleData, setRoleData] = useState([]);

//   // --- Dashboard loader ---
//   const loadDashboard = useCallback(async () => {
//     try {
//       const [productRes, userRes] = await Promise.all([
//         getProducts(""),
//         getAllUsers(),
//       ]);

//       const products = productRes.data || [];
//       const users = userRes.data || [];

//       // --- Summary Cards ---
//       const totalRevenue = products.reduce(
//         (sum, p) => sum + Number(p.price) * Number(p.quantity),
//         0
//       );

//       // Correct total quantity
//       const totalQuantity = products.reduce(
//         (sum, p) => sum + Number(p.quantity),
//         0
//       );

//       const totalSales = totalQuantity; // total units sold
//       const totalEmployees = users.length;
//       const totalTeams = new Set(users.map((u) => u.team_name)).size;

//       // --- Top Team ---
//       const teamRevenueMap = {};
//       products.forEach((p) => {
//         const team = p.team_name || "Unknown";
//         const rev = Number(p.price) * Number(p.quantity);
//         teamRevenueMap[team] = (teamRevenueMap[team] || 0) + rev;
//       });
//       const topTeam =
//         Object.keys(teamRevenueMap).length > 0
//           ? Object.entries(teamRevenueMap).sort((a, b) => b[1] - a[1])[0][0]
//           : "N/A";

//       setSummary({
//         totalRevenue,
//         totalSales,
//         totalEmployees,
//         totalTeams,
//         topTeam,
//       });

//       // --- Monthly Revenue ---
//       const months = [
//         "Jan", "Feb", "Mar", "Apr", "May", "Jun",
//         "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
//       ];
//       const monthlyMap = {};
//       products.forEach((p) => {
//         const m = p.sale_month || "Unknown";
//         monthlyMap[m] = (monthlyMap[m] || 0) + Number(p.price) * Number(p.quantity);
//       });
//       const monthlyData = months.map((m) => ({
//         month: m,
//         revenue: monthlyMap[m] || 0,
//       }));
//       setMonthlyRevenue(monthlyData);

//       // --- Progress Pie ---
//       const progressMap = {};
//       products.forEach((p) => {
//         const key = p.progress || "Unknown";
//         progressMap[key] = (progressMap[key] || 0) + 1;
//       });
//       const progressArr = Object.keys(progressMap).map((key) => ({
//         name: key,
//         value: progressMap[key],
//       }));
//       setProgressData(progressArr);

//       // --- Employee Roles ---
//       const roleMap = {};
//       users.forEach((u) => {
//         const role = u.role || "Unknown";
//         roleMap[role] = (roleMap[role] || 0) + 1;
//       });
//       const roleArr = Object.keys(roleMap).map((role) => ({
//         role,
//         count: roleMap[role],
//       }));
//       setRoleData(roleArr);
//     } catch (err) {
//       console.error("Dashboard load error:", err);
//     }
//   }, []);

//   useEffect(() => {
//     loadDashboard();
//   }, [loadDashboard]);

//   // --- Conditional rendering ---
//   if (!user) {
//     return (
//       <Box sx={{ p: 3, height:"100px" }}>
//         <Typography variant="h6">Not logged in</Typography>
//       </Box>
//     );
//   }

//   if (user.role !== "ADMIN" && !user.authorized) {
//     return (
//       <Box sx={{ p: 3 }}>
//         <Typography variant="h4" align="center" mt={25}>
//           You have logged in!<br />
//           Wait until the Administrator provides authorization.
//         </Typography>
//       </Box>
//     );
//   }

//   return (
//     <Box sx={{ p: 4, backgroundColor: "#f9fafc", maxHeight: "70px"}}>
//       <Grid container spacing={1} sx={{ mb:5, display: "flex", justifyContent:"space-evenly", alignItems: "stretch",ml:-3 }}>
//         <Grid item xs={12} sm={6} md={2}>
//           <Card sx={{ borderLeft: "5px solid #1976d2", height: "100%", width: "190px", ml:"2px" }}>
//             <CardContent>
//               <Typography variant="subtitle2" color="text.secondary">Total Revenue</Typography>
//               <Typography variant="h5" sx={{ fontWeight: 600 }}>₹{summary.totalRevenue.toLocaleString()}</Typography>
//             </CardContent>
//           </Card>
//         </Grid>
//         <Grid item xs={12} sm={6} md={2}>
//           <Card sx={{ borderLeft: "5px solid #c62828", height: "100%", width:"190" }}>
//             <CardContent>
//               <Typography variant="subtitle2" color="text.secondary">Top Performing Team</Typography>
//               <Typography variant="h6" sx={{ fontWeight: 600 }}>{summary.topTeam}</Typography>
//             </CardContent>
//           </Card>
//         </Grid>
//         <Grid item xs={12} sm={6} md={2}>
//           <Card sx={{ borderLeft: "5px solid #0288d1", height: "100%", width:"190" }}>
//             <CardContent>
//               <Typography variant="subtitle2" color="text.secondary">Average Revenue</Typography>
//               <Typography variant="h5" sx={{ fontWeight: 600 }}>
//                  ₹{summary.totalSales > 0
//                   ? new Intl.NumberFormat("en-IN").format(
//                            (summary.totalRevenue / summary.totalSales).toFixed(2)): 0}
//               </Typography>
//             </CardContent>
//           </Card>
//         </Grid>
//         <Grid item xs={12} sm={6} md={2}>
//           <Card sx={{ borderLeft: "5px solid #ed6c02", height: "100%", ml:2, width:"190" }}>
//             <CardContent>
//               <Typography variant="subtitle2" color="text.secondary">Total Employees</Typography>
//               <Typography variant="h5" sx={{ fontWeight: 600 }}>{summary.totalEmployees}</Typography>
//             </CardContent>
//           </Card>
//         </Grid>
//         {/* Total Sales */}
//         <Grid item xs={12} sm={6} md={2}>
//           <Card sx={{ borderLeft: "5px solid #2e7d32", height: "100%", width:"190", ml:"-7" }}>
//             <CardContent>
//               <Typography variant="subtitle2" color="text.secondary">Total Sales</Typography>
//               <Typography variant="h5" sx={{ fontWeight: 600 }}>{summary.totalSales}</Typography>
//             </CardContent>
//           </Card>
//         </Grid>
//         {/* Teams */}
//         <Grid item xs={12} sm={6} md={2}>
//           <Card sx={{ borderLeft: "5px solid #6a1b9a", height: "100%", width:"190" }}>
//             <CardContent>
//               <Typography variant="subtitle2" color="text.secondary">Teams</Typography>
//               <Typography variant="h5" sx={{ fontWeight: 600 }}>{summary.totalTeams}</Typography>
//             </CardContent>
//           </Card>
//         </Grid>
//       </Grid>

//       {/* Charts */}
//       <Grid container spacing={4}>
//         {/* Line Chart */}
//         <Grid item xs={12} md={8}>
//           <Card sx={{ p: 2, height: 300, width: "400px" }}>
//             <Typography variant="subtitle1" sx={{ mb: 2 }}><b>Monthly Revenue Trend</b></Typography>
//             <ResponsiveContainer width="100%" height="90%">
//               <LineChart data={monthlyRevenue}>
//                 <CartesianGrid strokeDasharray="3 3" />
//                 <XAxis dataKey="month" />
//                 <YAxis />
//                 <ReTooltip />
//                 <Legend />
//                 <Line type="monotone" dataKey="revenue" stroke="#1976d2" strokeWidth={3} dot={{ r: 4 }} />
//               </LineChart>
//             </ResponsiveContainer>
//           </Card>
//         </Grid>

//         {/* Pie Chart */}
//         <Grid item xs={12} md={4}>
//           <Card sx={{ p: 2, height: 300, width: "300px", ml:2 }}>
//             <Typography variant="subtitle1" sx={{ mb: 2 }}><b>Product Progress Status</b></Typography>
//             <ResponsiveContainer width="100%" height="90%">
//               <PieChart>
//                 <Pie data={progressData} cx="50%" cy="50%" labelLine={false} outerRadius={100} fill="#8884d8" dataKey="value" label>
//                   {progressData.map((entry, index) => (
//                     <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//                   ))}
//                 </Pie>
//                 <ReTooltip />
//               </PieChart>
//             </ResponsiveContainer>
//           </Card>
//         </Grid>

//         {/* Bar Chart */}
//         <Grid item xs={12}>
//           <Card sx={{ p: 2, ml:3, width: "100%", height: 300 }}>
//             <Typography variant="subtitle1" sx={{ mb: 2 }}><b>Employee Role Distribution</b></Typography>
//             <ResponsiveContainer width="100%" height={270} ml={0}>
//               <BarChart data={roleData}>
//                 <CartesianGrid strokeDasharray="3 3" />
//                 <XAxis dataKey="role" />
//                 <YAxis />
//                 <ReTooltip />
//                 <Legend />
//                 <Bar dataKey="count" fill="#82ca9d" barSize={40} />
//               </BarChart>
//             </ResponsiveContainer>
//           </Card>
//         </Grid>
//       </Grid>
//     </Box>
//   );
// }






import React, { useEffect, useState, useCallback, useMemo } from "react";
import { Box, Grid, Card, CardContent, Typography, CircularProgress } from "@mui/material";
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip as ReTooltip,
  LineChart, Line, XAxis, YAxis, CartesianGrid, Legend,
  BarChart, Bar
} from "recharts";
import { getProducts, getAllUsers } from "../../api/api";

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7f50", "#8dd1e1"];
const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

export default function Dashboard() {
  const user = JSON.parse(localStorage.getItem("user") || "null");

  // --- States ---
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [roleData, setRoleData] = useState([]);       // For Admin
  const [customerData, setCustomerData] = useState([]); // For Manager/Employee

  // Fetch data
  const loadDashboard = useCallback(async () => {
    setLoading(true);
    try {
      const [productRes, userRes] = await Promise.all([
        getProducts(""),
        getAllUsers(),
      ]);
      setProducts(productRes.data || []);
      setUsers(userRes.data || []);
    } catch(err){ 
      console.error(err); 
    } finally { 
      setLoading(false); 
    }
  }, []);

  useEffect(()=>{ loadDashboard(); },[loadDashboard]);

  // Filtered team data
  const teamProducts = useMemo(() => {
    if(!products.length) return [];
    return user.role==="ADMIN" ? products : products.filter(p => p.team_name === user.team_name);
  }, [products, user.role, user.team_name]);

  const teamUsers = useMemo(() => {
    if(!users.length) return [];
    return user.role==="ADMIN" ? users : users.filter(u => u.team_name === user.team_name);
  }, [users, user.role, user.team_name]);

  // --- Summary ---
  const summary = useMemo(() => {
    if(!products.length) return {};

    const companyRevenue = products.reduce((sum,p) => sum + Number(p.price) * Number(p.quantity), 0);
    const companySales = products.reduce((sum,p) => sum + Number(p.quantity), 0);
    const companyAvg = companySales ? companyRevenue / companySales : 0;


    const teamRevenue = teamProducts.reduce((sum,p) => sum + Number(p.price) * Number(p.quantity), 0);
    const teamSales = teamProducts.reduce((sum,p) => sum + Number(p.quantity), 0);
    const teamAvg = teamSales ? teamRevenue / teamSales : 0;

    const topTeam = user.role === "ADMIN" ? (() => {
      const map = {}; 
      products.forEach(p => map[p.team_name] = (map[p.team_name] || 0) + Number(p.price) * Number(p.quantity));
      return Object.entries(map).sort((a,b) => b[1] - a[1])[0]?.[0] || "N/A";
    })() : null;

    const topCustomer = (() => {
      const map = {}; 
      teamProducts.forEach(p => map[p.customer] = (map[p.customer] || 0) + 1);
      return Object.entries(map).sort((a,b) => b[1] - a[1])[0]?.[0] || "N/A";
    })();

    const topProduct = user.role === "MANAGER" ? (() => {
      const map = {}; 
      teamProducts.forEach(p => map[p.name] = (map[p.name] || 0) + Number(p.quantity));
      return Object.entries(map).sort((a,b) => b[1] - a[1])[0]?.[0] || "N/A";
    })() : null;

    const totalPeople = user.role === "EMPLOYEE" ? teamUsers.length : null;

    // growth rate
    const monthlyMap = {};
    teamProducts.forEach(p => {
      monthlyMap[p.sale_month] = (monthlyMap[p.sale_month] || 0) + Number(p.price) * Number(p.quantity);
    });
    const monthIndex = new Date().getMonth();
    const prevRevenue = monthlyMap[MONTHS[monthIndex-1]] || 0;
    const currRevenue = monthlyMap[MONTHS[monthIndex]] || 0;
    const growthRate = prevRevenue ? ((currRevenue - prevRevenue) / prevRevenue) * 100 : 0;

    return { companyRevenue, companyAvg, teamRevenue, teamAvg, topTeam, topCustomer, topProduct, totalPeople, teamSales, growthRate };
  }, [products, teamProducts, teamUsers, user.role]);

  // --- Charts ---
  const monthlyRevenue = useMemo(() => {
    const monthlyMap = {};
    teamProducts.forEach(p => {
      monthlyMap[p.sale_month] = (monthlyMap[p.sale_month] || 0) + Number(p.price) * Number(p.quantity);
    });
    return MONTHS.map(m => ({ month: m, revenue: monthlyMap[m] || 0 }));
  }, [teamProducts]);

  const progressData = useMemo(() => {
    const map = {};
    teamProducts.forEach(p => map[p.progress] = (map[p.progress] || 0) + 1);
    return Object.keys(map).map(k => ({ name: k, value: map[k] }));
  }, [teamProducts]);

  // --- Bar chart data ---
  useEffect(() => {
    const map = {};
    if (user.role === "ADMIN") {
      // Employee role distribution
      users.forEach(u => map[u.role] = (map[u.role] || 0) + 1);
      setRoleData(Object.keys(map).map(role => ({ role, count: map[role] })));
    } else {
      // Customer distribution for team
      teamProducts.forEach(p => map[p.customer] = (map[p.customer] || 0) + 1);
      setCustomerData(Object.keys(map).map(cust => ({ customer: cust, value: map[cust] })));
    }
  }, [users, teamProducts, user.role]);

  // --- Loading or error ---
  if (!user) return <Box p={3}><Typography variant="h6">Not logged in</Typography></Box>;
  if (user.role !== "ADMIN" && !user.authorized) return <Box p={3}><Typography variant="h4" align="center" mt={25}>Wait for admin authorization</Typography></Box>;

  return (
    <Box sx={{ p: 3, backgroundColor: "#f9fafc" }}>
      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" height={300}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {/* Summary Cards */}
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={6} md={3}>
  <Card sx={{ borderLeft: "5px solid #1976d2" ,height:"127px",alignContent:"center"}}>
    <CardContent>
      <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 'bold' }}>
        Total Revenue
      </Typography>

      {/* Always show company revenue */}
      <Typography variant="h6" sx={{ fontWeight: 'bold',color:"#092d52ff" }}>
         Company: ₹{summary.companyRevenue?.toLocaleString()}
      </Typography>

      {/* Show team revenue only for non-admin users */}
      {user.role !== "ADMIN" && (
        <Typography variant="h6" sx={{ color: "#092d52ff", fontWeight: '600px' }}>
          Team: ₹{summary.teamRevenue?.toLocaleString()}
        </Typography>
      )}
    </CardContent>
  </Card>
</Grid>

 <Grid item xs={12} sm={6} md={3}>
  <Card sx={{ borderLeft: "5px solid #0288d1" ,height:"127px",alignContent:"center",width:"215px"}}>
    <CardContent>
      <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 'bold' }}>
        Average Revenue
      </Typography>

      {/* Always show company avg */}
      <Typography variant="h6" sx={{ fontWeight: 'bold' ,color:"#092d52ff"}}>
  Company: ₹{summary.companyAvg.toLocaleString("en-IN", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
      </Typography>

      {/* Show team avg only for non-admin */}
      {user.role !== "ADMIN" && (
        <Typography variant="h6" sx={{ color: "#092d52ff", fontWeight: '600px' }}>
    Team: ₹{summary.teamAvg.toLocaleString("en-IN", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
        </Typography>
      )}
    </CardContent>
  </Card>
</Grid>

            {user.role === "ADMIN" && (
              <Grid item xs={12} sm={6} md={2}>
                <Card sx={{ borderLeft: "5px solid #c62828" ,height:"127px",alignContent:"center",width:"150px"}}>
                  <CardContent>
                    <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 'bold' }}>Top Team</Typography>
                    <Typography variant="h6" sx={{fontWeight: 'bold'}}>{summary.topTeam}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            )}
            {user.role === "ADMIN" && (
            <Grid item xs={12} sm={6} md={2}>
                <Card sx={{ borderLeft: "5px solid #6a1b9a", height: "127px", alignContent: "center" }}>
                 <CardContent>
    <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 'bold' }}>Total Employees</Typography>
    <Typography variant="h6" sx={{fontWeight: 'bold'}}>{users.length}</Typography> {/* Total number of users */}
  </CardContent>
</Card>
</Grid>
)}
            {(user.role === "MANAGER" || user.role === "EMPLOYEE") && (
              <Grid item xs={12} sm={6} md={2}>
                <Card sx={{ borderLeft: "5px solid #c62828" ,height:"127px",alignContent:"center",width:"150px"}}>
                  <CardContent>
                    <Typography variant="subtitle2" color="text.secondary"sx={{ fontWeight: 'bold' }}>Top Customer</Typography>
                    <Typography variant="h6" sx={{fontWeight: 'bold',color:"#092d52ff"}}>{summary.topCustomer}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            )}

            <Grid item xs={12} sm={6} md={2}>
              <Card sx={{ borderLeft: "5px solid #2e7d32" ,height:"127px",alignContent:"center",width:"150px"}}>
                <CardContent>
                  <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 'bold' }}>Total Sales</Typography>
                  <Typography variant="h6" sx={{fontWeight: 'bold',color:"#092d52ff"}}>{summary.teamSales}</Typography>
                </CardContent>
              </Card>
            </Grid>

            {user.role === "MANAGER" && (
              <Grid item xs={12} sm={6} md={2}>
                <Card sx={{ borderLeft: "5px solid #6a1b9a",height:"127px",alignContent:"center" }}>
                  <CardContent>
                    <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 'bold' }}>Top Product</Typography>
                    <Typography variant="h6" sx={{fontWeight: 'bold',color:"#092d52ff"}}>{summary.topProduct}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            )}

            {user.role === "EMPLOYEE" && (
              <Grid item xs={12} sm={6} md={2}>
                <Card sx={{ borderLeft: "5px solid #6a1b9a",height:"127px",alignContent:"center" }}>
                  <CardContent>
                    <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 'bold' }}>Team Members</Typography>
                    <Typography variant="h6" sx={{fontWeight: 'bold',color:"#092d52ff"}}>{summary.totalPeople}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            )}

            <Grid item xs={12} sm={6} md={2}>
              <Card sx={{ borderLeft: "5px solid #ed6c02" ,height:"127px",alignContent:"center",width:"150px"}}>
                <CardContent>
                  <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 'bold' }}>Growth Rate</Typography>
                  <Typography variant="h6" sx={{ color: summary.growthRate > 0 ? "green" : summary.growthRate < 0 ? "red" : "black",fontWeight: 'bold' }}>
                    {summary.growthRate?.toFixed(2)}%
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Charts */}
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Card sx={{ p: 2, height: 300 ,width:"400px"}}>
                <Typography variant="subtitle1" sx={{ mb: 1 }}><b>Monthly Revenue Trend</b></Typography>
                <ResponsiveContainer width="100%" height="85%">
                  <LineChart data={monthlyRevenue}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <ReTooltip />
                    <Legend />
                    <Line type="monotone" dataKey="revenue" stroke="#1976d2" strokeWidth={3} dot={{ r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </Card>
            </Grid>

            <Grid item xs={12} md={3}>
              <Card sx={{ p: 2, height: 300 ,width:"250px"}}>
                <Typography variant="subtitle1" sx={{ mb: 1 }}><b>Product Progress</b></Typography>
                <ResponsiveContainer width="100%" height="85%">
                  <PieChart>
                    <Pie data={progressData} dataKey="value" cx="50%" cy="50%" outerRadius={80} label>
                      {progressData.map((entry, index) => <Cell key={index} fill={COLORS[index % COLORS.length]} />)}
                    </Pie>
                    <ReTooltip />
                  </PieChart>
                </ResponsiveContainer>
              </Card>
            </Grid>

            <Grid item xs={12}>
              <Card sx={{ p: 2,  height: 300,width:"370px" }}>
                <Typography variant="subtitle1" sx={{ mb: 2 }}>
                  <b>{user.role === "ADMIN" ? "Employee Role Distribution" : "Customer Distribution"}</b>
                </Typography>
                <ResponsiveContainer width="100%" height={270}>
                  <BarChart data={user.role === "ADMIN" ? roleData : customerData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey={user.role === "ADMIN" ? "role" : "customer"} />
                    <YAxis />
                    <ReTooltip />
                    <Legend />
                    <Bar
                      dataKey={user.role === "ADMIN" ? "count" : "value"}
                      fill={user.role === "ADMIN" ? "#82ca9d" : "#ff7f50"}
                      barSize={40}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            </Grid>
          </Grid>
        </>
      )}
    </Box>
  );
}




