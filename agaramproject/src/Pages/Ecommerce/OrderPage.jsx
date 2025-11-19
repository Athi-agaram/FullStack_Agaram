import React, { useEffect, useState, useRef } from "react";
import {
  Box,
  Paper,
  Typography,
  Divider,
  Grid,
  TextField,
  IconButton,
  Collapse,
} from "@mui/material";
import { getOrdersApi } from "../../api/api";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [expandedOrders, setExpandedOrders] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    fetchOrders();
    return () => {
      isMounted.current = false;
    };
  }, []);

  const fetchOrders = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user?.id) return;
    try {
      const res = await getOrdersApi(user.id);
      if (isMounted.current) {
        setOrders(res.data || res);
        setFilteredOrders(res.data || res);
      }
    } catch (err) {
      console.error("Error fetching orders:", err);
    }
  };

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(amount);

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    const filtered = orders.filter((order) =>
      order.id.toString().includes(query.trim())
    );
    setFilteredOrders(filtered);
  };

  const toggleExpand = (orderId) => {
    setExpandedOrders((prev) => ({ ...prev, [orderId]: !prev[orderId] }));
  };

  return (
    <Box sx={{ p: 2 }}>


      {/* Search */}
      <TextField
        fullWidth
        placeholder="Search by Order ID..."
        value={searchQuery}
        onChange={handleSearch}
        sx={{ mb: 3 }}
      />

      {filteredOrders.length === 0 && (
        <Paper sx={{ p: 4, textAlign: "center", fontStyle: "italic" }}>
          No orders found
        </Paper>
      )}

      {filteredOrders.map((order) => {
        const orderTotal = order.items
          ? order.items.reduce((sum, item) => sum + item.price * item.qty, 0)
          : 0;
        const isExpanded = expandedOrders[order.id] || false;

        return (
          <Paper
            key={order.id}
            sx={{
              mb: 4,
              borderRadius: 2,
              boxShadow: 3,
              border: "1px solid #e0e0e0",
              overflow: "hidden",
            }}
          >
            {/* Header */}
            <Box
              sx={{
                bgcolor: "#013466ff",
                color: "#fff",
                p: 2,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                cursor: "pointer",
              }}
              onClick={() => toggleExpand(order.id)}
            >
              <Box>
                <Typography fontWeight={600}>Order #{order.id}</Typography>
                <Typography variant="caption">
                  {new Date(order.created_at || order.createdAt).toLocaleString()}
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Typography fontWeight={600}>{formatCurrency(order.total_amount || orderTotal)}</Typography>
                <IconButton size="small" sx={{ color: "#fff" }}>
                  {isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                </IconButton>
              </Box>
            </Box>

            {/* Collapsible Items */}
            <Collapse in={isExpanded} timeout="auto" unmountOnExit>
              <Box sx={{ p: 2 }}>
                {order.items && order.items.length > 0 ? (
                  <Box>
                    {order.items.map((item, idx) => (
                      <Grid
                        container
                        key={item.id}
                        sx={{
                          py: 1,
                          px: 1,
                          bgcolor: idx % 2 === 0 ? "#f9f9f9" : "#fff",
                          borderRadius: 1,
                          mb: 1,
                          alignItems: "center",
                        }}
                      >
<Box
  key={item.id}
  sx={{
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    py: 1,
    px: 2,
    borderRadius: 1,
    mb: 1,
  }}
>
  {/* Left side: product name */}
  <Box sx={{ maxWidth: "100%", overflowWrap: "break-word" }}>
    <Typography fontWeight={600}>{item.name || "Unknown Product"}</Typography>
  </Box>

  {/* Right side: quantity + price */}
  <Box sx={{ textAlign: "right", minWidth: "120px", whiteSpace: "nowrap" }}>
    <Typography fontWeight={600}>
      Qty: {item.qty} | {formatCurrency(item.price * item.qty)}
    </Typography>
  </Box>
</Box>


                      </Grid>
                    ))}

                    <Divider sx={{ my: 2 }} />

                    <Box sx={{ display: "flex", justifyContent: "flex-end", pr: 1 }}>
                      <Typography fontWeight={600} variant="subtitle1">
                        Order Total: {formatCurrency(orderTotal)}
                      </Typography>
                    </Box>
                  </Box>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    No items in this order.
                  </Typography>
                )}
              </Box>
            </Collapse>
          </Paper>
        );
      })}
    </Box>
  );
}
