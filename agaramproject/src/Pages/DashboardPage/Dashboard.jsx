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
    <Box sx={{ p: 5.5, backgroundColor: "#f9fafc" }}>
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

