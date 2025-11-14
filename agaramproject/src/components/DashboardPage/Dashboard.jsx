import React, { useEffect, useState, useCallback } from "react";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
} from "@mui/material";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip as ReTooltip,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  BarChart,
  Bar,
} from "recharts";
import { getProducts, getAllUsers } from "../../api/api";

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7f50", "#8dd1e1"];

export default function Dashboard() {
  const user = JSON.parse(localStorage.getItem("user") || "null");

  // --- Hooks ---
  const [summary, setSummary] = useState({
    totalRevenue: 0,
    totalSales: 0,
    totalEmployees: 0,
    totalTeams: 0,
    topTeam: "N/A",
  });
  const [monthlyRevenue, setMonthlyRevenue] = useState([]);
  const [progressData, setProgressData] = useState([]);
  const [roleData, setRoleData] = useState([]);

  // --- Dashboard loader ---
  const loadDashboard = useCallback(async () => {
    try {
      const [productRes, userRes] = await Promise.all([
        getProducts(""),
        getAllUsers(),
      ]);

      const products = productRes.data || [];
      const users = userRes.data || [];

      // --- Summary Cards ---
      const totalRevenue = products.reduce(
        (sum, p) => sum + Number(p.price) * Number(p.quantity),
        0
      );

      // Correct total quantity
      const totalQuantity = products.reduce(
        (sum, p) => sum + Number(p.quantity),
        0
      );

      const totalSales = totalQuantity; // total units sold
      const totalEmployees = users.length;
      const totalTeams = new Set(users.map((u) => u.team_name)).size;

      // --- Top Team ---
      const teamRevenueMap = {};
      products.forEach((p) => {
        const team = p.team_name || "Unknown";
        const rev = Number(p.price) * Number(p.quantity);
        teamRevenueMap[team] = (teamRevenueMap[team] || 0) + rev;
      });
      const topTeam =
        Object.keys(teamRevenueMap).length > 0
          ? Object.entries(teamRevenueMap).sort((a, b) => b[1] - a[1])[0][0]
          : "N/A";

      setSummary({
        totalRevenue,
        totalSales,
        totalEmployees,
        totalTeams,
        topTeam,
      });

      // --- Monthly Revenue ---
      const months = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
      ];
      const monthlyMap = {};
      products.forEach((p) => {
        const m = p.sale_month || "Unknown";
        monthlyMap[m] = (monthlyMap[m] || 0) + Number(p.price) * Number(p.quantity);
      });
      const monthlyData = months.map((m) => ({
        month: m,
        revenue: monthlyMap[m] || 0,
      }));
      setMonthlyRevenue(monthlyData);

      // --- Progress Pie ---
      const progressMap = {};
      products.forEach((p) => {
        const key = p.progress || "Unknown";
        progressMap[key] = (progressMap[key] || 0) + 1;
      });
      const progressArr = Object.keys(progressMap).map((key) => ({
        name: key,
        value: progressMap[key],
      }));
      setProgressData(progressArr);

      // --- Employee Roles ---
      const roleMap = {};
      users.forEach((u) => {
        const role = u.role || "Unknown";
        roleMap[role] = (roleMap[role] || 0) + 1;
      });
      const roleArr = Object.keys(roleMap).map((role) => ({
        role,
        count: roleMap[role],
      }));
      setRoleData(roleArr);
    } catch (err) {
      console.error("Dashboard load error:", err);
    }
  }, []);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  // --- Conditional rendering ---
  if (!user) {
    return (
      <Box sx={{ p: 3, height:"100px" }}>
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

  // --- Dashboard JSX ---
  return (
    <Box sx={{ p: 4, backgroundColor: "#f9fafc", maxHeight: "70px"}}>
      {/* Summary Cards */}
      <Grid container spacing={1} sx={{ mb:5, display: "flex", justifyContent:"space-evenly", alignItems: "stretch",ml:-3 }}>
        {/* Total Revenue */}
        <Grid item xs={12} sm={6} md={2}>
          <Card sx={{ borderLeft: "5px solid #1976d2", height: "100%", width: "190px", ml:"2px" }}>
            <CardContent>
              <Typography variant="subtitle2" color="text.secondary">Total Revenue</Typography>
              <Typography variant="h5" sx={{ fontWeight: 600 }}>₹{summary.totalRevenue.toLocaleString()}</Typography>
            </CardContent>
          </Card>
        </Grid>
        {/* Top Team */}
        <Grid item xs={12} sm={6} md={2}>
          <Card sx={{ borderLeft: "5px solid #c62828", height: "100%", width:"190" }}>
            <CardContent>
              <Typography variant="subtitle2" color="text.secondary">Top Performing Team</Typography>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>{summary.topTeam}</Typography>
            </CardContent>
          </Card>
        </Grid>
        {/* Avg Revenue / Sale */}
        <Grid item xs={12} sm={6} md={2}>
          <Card sx={{ borderLeft: "5px solid #0288d1", height: "100%", width:"190" }}>
            <CardContent>
              <Typography variant="subtitle2" color="text.secondary">Average Revenue</Typography>
              <Typography variant="h5" sx={{ fontWeight: 600 }}>
                 ₹{summary.totalSales > 0
                  ? new Intl.NumberFormat("en-IN").format(
                           (summary.totalRevenue / summary.totalSales).toFixed(2)): 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        {/* Total Employees */}
        <Grid item xs={12} sm={6} md={2}>
          <Card sx={{ borderLeft: "5px solid #ed6c02", height: "100%", ml:2, width:"190" }}>
            <CardContent>
              <Typography variant="subtitle2" color="text.secondary">Total Employees</Typography>
              <Typography variant="h5" sx={{ fontWeight: 600 }}>{summary.totalEmployees}</Typography>
            </CardContent>
          </Card>
        </Grid>
        {/* Total Sales */}
        <Grid item xs={12} sm={6} md={2}>
          <Card sx={{ borderLeft: "5px solid #2e7d32", height: "100%", width:"190", ml:"-7" }}>
            <CardContent>
              <Typography variant="subtitle2" color="text.secondary">Total Sales</Typography>
              <Typography variant="h5" sx={{ fontWeight: 600 }}>{summary.totalSales}</Typography>
            </CardContent>
          </Card>
        </Grid>
        {/* Teams */}
        <Grid item xs={12} sm={6} md={2}>
          <Card sx={{ borderLeft: "5px solid #6a1b9a", height: "100%", width:"190" }}>
            <CardContent>
              <Typography variant="subtitle2" color="text.secondary">Teams</Typography>
              <Typography variant="h5" sx={{ fontWeight: 600 }}>{summary.totalTeams}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Charts */}
      <Grid container spacing={4}>
        {/* Line Chart */}
        <Grid item xs={12} md={8}>
          <Card sx={{ p: 2, height: 300, width: "400px" }}>
            <Typography variant="subtitle1" sx={{ mb: 2 }}><b>Monthly Revenue Trend</b></Typography>
            <ResponsiveContainer width="100%" height="90%">
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

        {/* Pie Chart */}
        <Grid item xs={12} md={4}>
          <Card sx={{ p: 2, height: 300, width: "300px", ml:2 }}>
            <Typography variant="subtitle1" sx={{ mb: 2 }}><b>Product Progress Status</b></Typography>
            <ResponsiveContainer width="100%" height="90%">
              <PieChart>
                <Pie data={progressData} cx="50%" cy="50%" labelLine={false} outerRadius={100} fill="#8884d8" dataKey="value" label>
                  {progressData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <ReTooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Grid>

        {/* Bar Chart */}
        <Grid item xs={12}>
          <Card sx={{ p: 2, ml:3, width: "100%", height: 300 }}>
            <Typography variant="subtitle1" sx={{ mb: 2 }}><b>Employee Role Distribution</b></Typography>
            <ResponsiveContainer width="100%" height={270} ml={0}>
              <BarChart data={roleData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="role" />
                <YAxis />
                <ReTooltip />
                <Legend />
                <Bar dataKey="count" fill="#82ca9d" barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
