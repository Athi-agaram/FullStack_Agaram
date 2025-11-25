import React, { useEffect, useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Divider,
  TextField,
  IconButton,
  Collapse,
  Stepper,
  Step,
  StepLabel,
  Button,
  CircularProgress,
} from "@mui/material";
import { getOrdersApi, updateOrderStatusApi } from "../../api/api";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";

const steps = ["PLACED", "PROCESSING", "SHIPPED", "DELIVERED"];

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [expandedOrders, setExpandedOrders] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const user = JSON.parse(localStorage.getItem("user"));
  const isAdmin = user?.role === "ADMIN";

  useEffect(() => {
    fetchOrders();
  }, []);

  // -------------------------------------
  // FETCH ORDERS FROM BACKEND
  // -------------------------------------
  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await getOrdersApi(user.id, isAdmin ? "ADMIN" : null);

      if (!res.data || res.data.length === 0) {
        setOrders([]);
        setFilteredOrders([]);
        setLoading(false);
        return;
      }

      // The backend now returns properly structured orders with items array
      const orderList = res.data.map(order => ({
        id: order.order_id,
        user_id: order.user_id,
        username: order.username,
        status: order.status,
        created_at: order.created_at,
        total_amount: Number(order.total_amount || 0),
        items: (order.items || []).map(item => ({
          id: item.product_id,
          name: item.product_name,
          image: item.product_image,
          price: Number(item.price),
          qty: Number(item.qty),
        }))
      }));

      setOrders(orderList);
      setFilteredOrders(orderList);
      setLoading(false);
    } catch (e) {
      console.error("Error fetching orders:", e);
      setError("Failed to fetch orders");
      setLoading(false);
    }
  };

  // -------------------------------------
  // SEARCH
  // -------------------------------------
  const handleSearch = (e) => {
    const q = e.target.value;
    setSearchQuery(q);

    if (!q.trim()) {
      setFilteredOrders(orders);
      return;
    }

    const filtered = orders.filter((o) =>
      o.id.toString().includes(q.trim()) ||
      (isAdmin && o.username?.toLowerCase().includes(q.toLowerCase()))
    );

    setFilteredOrders(filtered);
  };

  const toggleExpand = (orderId) => {
    setExpandedOrders((prev) => ({
      ...prev,
      [orderId]: !prev[orderId],
    }));
  };

  const formatCurrency = (amt) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amt);

  const getStatusIndex = (status) => {
    if (!status) return 0;
    const upperStatus = status.toUpperCase();
    const i = steps.indexOf(upperStatus);
    return i === -1 ? 0 : i;
  };

  // -------------------------------------
  // ADMIN → MOVE TO NEXT STATUS
  // -------------------------------------
  const handleNextStatus = async (order) => {
    const idx = getStatusIndex(order.status);

    if (idx >= steps.length - 1) {
      alert("Order is already delivered!");
      return;
    }

    const nextStatus = steps[idx + 1];

    try {
      const res = await updateOrderStatusApi(order.id, nextStatus);

      if (res.data?.success) {
        // Update local state
        const updated = orders.map((o) =>
          o.id === order.id ? { ...o, status: nextStatus } : o
        );
        setOrders(updated);
        setFilteredOrders(updated);
        alert(`Order #${order.id} moved to ${nextStatus}`);
      } else {
        alert("Failed to update order status");
      }
    } catch (e) {
      console.error("Failed to update status", e);
      alert("Failed to update order status: " + e.message);
    }
  };

  // -------------------------------------
  // UI RENDER
  // -------------------------------------
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" py={10}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Paper sx={{ p: 4, textAlign: "center", color: "error.main" }}>
        {error}
      </Paper>
    );
  }

  return (
    <Box sx={{ p: 2  ,background: "linear-gradient(135deg, #10002eff 0%, #87c8eeff 100%)",
 }}>
      {/* Search */}
      <TextField
        fullWidth
        placeholder={isAdmin ? "Search by Order ID or Username..." : "Search by Order ID..."}
        value={searchQuery}
        onChange={handleSearch}
        sx={{ mb: 3,backgroundColor:"#f2f5fcff",borderRadius:2 }}
      />

      {filteredOrders.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: "center", fontStyle: "italic" }}>
          No orders found
        </Paper>
      ) : null}

      {/* ORDER CARDS */}
      {filteredOrders.map((order) => {
        const total = order.items.reduce(
          (sum, it) => sum + it.price * it.qty,
          0
        );

        const isExpanded = expandedOrders[order.id] || false;
        const statusIdx = getStatusIndex(order.status);

        return (
          <Paper
            key={order.id}
            sx={{
              mb: 4,
              borderRadius: 5,
              boxShadow: 3,
              border: "1px solid #e0e0e0",
              overflow: "hidden",
            }}
          >
            {/* HEADER */}
            <Box
              sx={{
                background:"linear-gradient(135deg, #a9cefcff, #cfe2fdff, #b8cce4ff)",
                color: "#040024ff",
                p: 2,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                cursor: "pointer",
              }}
              onClick={() => toggleExpand(order.id)}
            >
              <Box>
                <Typography fontWeight={600}>
                  Order #{order.id}
                  {isAdmin && order.username && (
                    <span style={{ marginLeft: "10px", fontSize: "0.9em" }}>
                      - {order.username}
                    </span>
                  )}
                </Typography>
                <Typography variant="caption">
                  {new Date(order.created_at).toLocaleString()}
                </Typography>
              </Box>

              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Typography fontWeight={600}>
                  {formatCurrency(total)}
                </Typography>
                <IconButton size="small" sx={{ color: "#040024ff" }}>
                  {isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                </IconButton>
              </Box>
            </Box>

            {/* ORDER DETAILS */}
            <Collapse in={isExpanded} timeout="auto" unmountOnExit>
              <Box sx={{ p: 2 }}>
                <Typography fontWeight={600} sx={{ mb: 1 }}>
                  Status: {order.status}
                </Typography>

                {/* STEPPER */}
                <Stepper activeStep={statusIdx} alternativeLabel sx={{ mb: 3 }}>
                  {steps.map((label) => (
                    <Step key={label}>
                      <StepLabel>{label}</StepLabel>
                    </Step>
                  ))}
                </Stepper>

                {/* ADMIN BUTTON */}
                {isAdmin && statusIdx < steps.length - 1 && (
                  <Button
                    variant="contained"
                    color="primary"
                    sx={{ mb: 3 }}
                    onClick={() => handleNextStatus(order)}
                  >
                    Move to {steps[statusIdx + 1]}
                  </Button>
                )}

                {/* ITEMS */}
                {order.items.length === 0 ? (
                  <Typography sx={{ py: 2, fontStyle: "italic" }}>
                    No items in this order
                  </Typography>
                ) : (
                  order.items.map((item, idx) => (
                    <Box
                      key={idx}
                      sx={{
                        py: 2,
                        px: 2,
                        bgcolor: idx % 2 === 0 ? "#f9f9f9" : "#fff",
                        borderRadius: 1,
                        mb: 1,
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        {item.image && (
                          <img
                            src={item.image}
                            alt={item.name}
                            style={{
                              width: 50,
                              height: 50,
                              objectFit: "contain",
                              borderRadius: 4,
                            }}
                          />
                        )}
                        <Typography fontWeight={600}>{item.name}</Typography>
                      </Box>
                      <Typography fontWeight={600}>
                        Qty: {item.qty} | {formatCurrency(item.price * item.qty)}
                      </Typography>
                    </Box>
                  ))
                )}

                <Divider sx={{ my: 2 }} />

                {/* TOTAL */}
                <Box sx={{ textAlign: "right" }}>
                  <Typography fontWeight={600} variant="subtitle1">
                    Order Total: {formatCurrency(total)}
                  </Typography>
                </Box>
              </Box>
            </Collapse>
          </Paper>
        );
      })}
    </Box>
  );
}
