import React, { useEffect, useState, useRef } from "react";
import { Box, Paper, Typography, Divider, TextField, IconButton, Collapse, Stepper, Step, StepLabel, Button } from "@mui/material";
import { getOrdersApi, updateOrderStatusApi } from "../../api/api"; // Ensure the correct path is used
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";

const steps = ["Placed", "Processing", "Shipped", "Delivered"];

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [expandedOrders, setExpandedOrders] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true); // Added loading state
  const [error, setError] = useState(null); // Added error state

  const user = JSON.parse(localStorage.getItem("user"));
  const isAdmin = user?.role === "ADMIN";
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    fetchOrders();
    return () => {
      isMounted.current = false;
    };
  }, []);

  // Fetch orders from API
  const fetchOrders = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user?.id) return;

    try {
      setLoading(true); // Set loading to true while fetching
      const res = await getOrdersApi(user.id);  // Just pass userId without role
      if (res.data && res.data.length > 0) {
        setOrders(res.data);
        setFilteredOrders(res.data);
      } else {
        console.log("No orders found");
        setOrders([]);
        setFilteredOrders([]);
      }
      setLoading(false); // Set loading to false after fetching
    } catch (err) {
      console.error("Error fetching orders:", err);
      setError('Error fetching orders'); // Set error if there's an issue
      setLoading(false);
    }
  };

  // Handle search by order ID
  const handleSearch = (e) => {
    const q = e.target.value;
    setSearchQuery(q);

    const filtered = orders.filter((o) => o.id.toString().includes(q.trim()));
    setFilteredOrders(filtered);
  };

  // Toggle order details expansion
  const toggleExpand = (orderId) => {
    setExpandedOrders((prev) => ({ ...prev, [orderId]: !prev[orderId] }));
  };

  // Format currency (INR)
  const formatCurrency = (amt) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(amt);

  // Get the current status index from the steps array
  const getStatusIndex = (status) => {
    if (!status) return 0;
    const i = steps.findIndex((s) => s.toLowerCase() === status.toLowerCase());
    return i === -1 ? 0 : i;
  };

  // Handle status update
  const handleNextStatus = async (order) => {
    const idx = getStatusIndex(order.status);
    if (idx >= steps.length - 1) return;

    const nextStatus = steps[idx + 1];

    try {
      const res = await updateOrderStatusApi(order.id, nextStatus);
      if (res.data?.success) {
        const updated = orders.map((o) => (o.id === order.id ? { ...o, status: nextStatus } : o));
        setOrders(updated);
        setFilteredOrders(updated);
      }
    } catch (err) {
      console.error("Status update failed:", err);
    }
  };

  // Loading or error display
  if (loading) return <div>Loading orders...</div>;
  if (error) return <div>{error}</div>;

  return (
    <Box sx={{ p: 2 }}>
      {/* Search */}
      <TextField fullWidth placeholder="Search by Order ID..." value={searchQuery} onChange={handleSearch} sx={{ mb: 3 }} />
      {filteredOrders.length === 0 && (
        <Paper sx={{ p: 4, textAlign: "center", fontStyle: "italic" }}>No orders found</Paper>
      )}
      {filteredOrders.map((order) => {
        const orderTotal = order.items?.reduce((sum, it) => sum + it.price * it.qty, 0) || order.total_amount;
        const isExpanded = expandedOrders[order.id] || false;
        const statusIdx = getStatusIndex(order.status);

        return (
          <Paper key={order.id} sx={{ mb: 4, borderRadius: 2, boxShadow: 3, border: "1px solid #e0e0e0", overflow: "hidden" }}>
            <Box sx={{ bgcolor: "#013466ff", color: "#fff", p: 2, display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer" }} onClick={() => toggleExpand(order.id)}>
              <Box>
                <Typography fontWeight={600}>Order #{order.id}</Typography>
                <Typography variant="caption">{new Date(order.created_at || order.createdAt).toLocaleString()}</Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Typography fontWeight={600}>{formatCurrency(orderTotal)}</Typography>
                <IconButton size="small" sx={{ color: "#fff" }}>
                  {isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                </IconButton>
              </Box>
            </Box>

            <Collapse in={isExpanded} timeout="auto" unmountOnExit>
              <Box sx={{ p: 2 }}>
                <Typography fontWeight={600} sx={{ mb: 1 }}>
                  Status: {order.status || "Placed"}
                </Typography>
                <Stepper activeStep={statusIdx} alternativeLabel sx={{ mb: 3 }}>
                  {steps.map((label) => (
                    <Step key={label}><StepLabel>{label}</StepLabel></Step>
                  ))}
                </Stepper>

                {isAdmin && statusIdx < steps.length - 1 && (
                  <Button variant="contained" sx={{ mb: 3 }} onClick={() => handleNextStatus(order)}>
                    Move to Next Step ({steps[statusIdx + 1]})
                  </Button>
                )}

                {order.items?.length > 0 ? (
                  <>
                    {order.items.map((item, idx) => (
                      <Box key={item.id} sx={{ py: 1, px: 2, bgcolor: idx % 2 === 0 ? "#f9f9f9" : "#fff", borderRadius: 1, mb: 1, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <Typography fontWeight={600}>{item.name}</Typography>
                        <Typography fontWeight={600}>Qty: {item.qty} | {formatCurrency(item.price * item.qty)}</Typography>
                      </Box>
                    ))}
                    <Divider sx={{ my: 2 }} />
                    <Box sx={{ textAlign: "right" }}>
                      <Typography fontWeight={600} variant="subtitle1">Order Total: {formatCurrency(orderTotal)}</Typography>
                    </Box>
                  </>
                ) : (
                  <Typography>No items found.</Typography>
                )}
              </Box>
            </Collapse>
          </Paper>
        );
      })}
    </Box>
  );
}
