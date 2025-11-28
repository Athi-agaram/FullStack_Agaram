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
  Tabs,
  Tab,
  Chip,
  Tooltip,
  Badge,
} from "@mui/material";
import { getOrdersApi, updateOrderStatusApi, sendNotificationApi } from "../../api/api";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import NotificationsTab from "./NotificationsTab";

const steps = ["PLACED", "PROCESSING", "SHIPPED", "OUT_FOR_DELIVERY", "DELIVERED"];

// Username-based permission mapping
const USER_PERMISSIONS = {
  // Admin users - can update any step
  "admin": { canUpdateAny: true },
  
  "warehouse": { allowedStep: "PLACED" },
  "distributor": { allowedStep: "PROCESSING" },
  "agent": { allowedStep: "SHIPPED" },
  "courier": { allowedStep: "OUT_FOR_DELIVERY" },
};

// Check if username can update a specific step
const canUserUpdateStep = (username, currentStep) => {
  const userPerm = USER_PERMISSIONS[username?.toLowerCase()];
  
  if (!userPerm) return false;
  if (userPerm.canUpdateAny) return true;
  if (userPerm.allowedStep === currentStep) return true;
  
  return false;
};

// Determine user type based on username for messaging
const getUserType = (username) => {
  const userPerm = USER_PERMISSIONS[username?.toLowerCase()];
  if (!userPerm) return "USER";
  if (userPerm.canUpdateAny) return "ADMIN";
  if (userPerm.allowedStep === "PLACED") return "WAREHOUSE";
  if (userPerm.allowedStep === "PROCESSING") return "DISTRIBUTOR";
  if (userPerm.allowedStep === "SHIPPED") return "AGENT";
  if (userPerm.allowedStep === "OUT_FOR_DELIVERY") return "COURIER";
  return "USER";
};

// Generate username-based messages
const usernameBasedMessage = (username, status) => {
  const userType = getUserType(username);
  
  switch (userType) {
    case "WAREHOUSE": return `Warehouse has confirmed and processed the order`;
    case "DISTRIBUTOR": return `Distributor has packed and prepared the order for shipment`;
    case "AGENT": return `Agent has dispatched the product`;
    case "COURIER": return `Courier is out for delivery`;
    case "ADMIN": return `Admin updated status to ${status}`;
    default: return `${username} updated status to ${status}`;
  }
};

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [expandedOrders, setExpandedOrders] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tab, setTab] = useState(0);
  const [unreadCount, setUnreadCount] = useState(0);

  const user = JSON.parse(localStorage.getItem("user"));
  const username = user?.username;
  const userType = getUserType(username);
  const isAdmin = userType === "ADMIN";

  useEffect(() => {
    fetchOrders();
    // Poll for new notifications every 30 seconds
    const interval = setInterval(fetchUnreadCount, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    fetchUnreadCount();
  }, [orders]);

  // -------------------------------------
  // FETCH ORDERS FROM BACKEND
  // -------------------------------------
  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await getOrdersApi(user.id, username);

      if (!res.data || res.data.length === 0) {
        setOrders([]);
        setFilteredOrders([]);
        setLoading(false);
        return;
      }

      const orderList = res.data.map(order => ({
        id: order.order_id,
        user_id: order.user_id,
        username: order.username,
        status: order.status,
        created_at: order.created_at,
        total_amount: Number(order.total_amount || 0),
        notifications: order.notifications || [],
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
  // FETCH UNREAD NOTIFICATION COUNT
  // -------------------------------------
  const fetchUnreadCount = async () => {
    try {
      // This would typically be an API call
      // For now, we'll calculate from orders data
      let count = 0;
      
      orders.forEach(order => {
        if (order.notifications && order.notifications.length > 0) {
          // For regular users, count all notifications
          if (userType === "USER") {
            count += order.notifications.length;
          } else {
            // For middlemen, count only their relevant notifications
            order.notifications.forEach(notif => {
              const notifUserType = getUserType(notif.sender_username);
              if (shouldShowNotification(notifUserType, userType)) {
                count++;
              }
            });
          }
        }
      });
      
      setUnreadCount(count);
    } catch (e) {
      console.error("Error fetching unread count:", e);
    }
  };

  // Helper function to determine if a notification should be shown
  const shouldShowNotification = (senderType, viewerType) => {
    // Admin sees everything
    if (viewerType === "ADMIN") return true;
    
    // Regular users see all notifications for their orders
    if (viewerType === "USER") return true;
    
    // Middlemen only see notifications from their previous step
    const stepOrder = ["WAREHOUSE", "DISTRIBUTOR", "AGENT", "COURIER"];
    const senderIndex = stepOrder.indexOf(senderType);
    const viewerIndex = stepOrder.indexOf(viewerType);
    
    // Show if sender is the previous step
    return senderIndex === viewerIndex - 1;
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
      o.username?.toLowerCase().includes(q.toLowerCase())
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
  // USERNAME-BASED MOVE TO NEXT STATUS
  // -------------------------------------
  const handleNextStatus = async (order) => {
    const idx = getStatusIndex(order.status);

    if (idx >= steps.length - 1) {
      alert("Order is already delivered!");
      return;
    }

    const nextStatus = steps[idx + 1];
    const canUpdate = canUserUpdateStep(username, order.status);

    if (!canUpdate) {
      alert("You don't have permission to update this step");
      return;
    }

    try {
      const res = await updateOrderStatusApi(order.id, nextStatus, order.status, username);

      if (res.data?.success) {
        // Send notification
        const message = usernameBasedMessage(username, nextStatus);
        await sendNotificationApi({
          orderId: order.id,
          username: username,
          message: message,
          status: nextStatus
        });

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

  // Handle tab change and reset unread count when viewing notifications
  const handleTabChange = (e, newValue) => {
    setTab(newValue);
    if (newValue === 1) {
      // Reset unread count when opening notifications tab
      setTimeout(() => setUnreadCount(0), 500);
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
    <Box sx={{ 
      p: 2,
      background: "linear-gradient(135deg, #10002eff 0%, #87c8eeff 100%)",
      minHeight: "100vh"
    }}>


      {/* Tabs with Badge */}
      <Tabs 
        value={tab} 
        onChange={handleTabChange}
        sx={{ 
          mb: 3,
          backgroundColor: "#f2f5fcff",
          borderRadius: 2,
          "& .MuiTab-root": { fontWeight: 600 }
        }}
      >
        <Tab label="Orders" />
        <Tab 
          label={
            <Badge badgeContent={unreadCount} color="error">
              Notifications
            </Badge>
          }
        />
      </Tabs>

      {/* Tab 1: Orders */}
      {tab === 0 && (
        <>
          {/* Search */}
          <TextField
            fullWidth
            placeholder="Search by Order ID or Customer Name..."
            value={searchQuery}
            onChange={handleSearch}
            sx={{ mb: 3, backgroundColor: "#f2f5fcff", borderRadius: 2 }}
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
            const canUpdate = canUserUpdateStep(username, order.status);

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
                    background: "linear-gradient(135deg, #c0dbfcff, #e2eeffff, #c8e1ffff)",
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
                      {order.username && (
                        <span style={{ marginLeft: "10px", fontSize: "0.9em", fontWeight: 500 }}>
                          - Customer: {order.username}
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

                    {/* STEPPER WITH TOOLTIPS */}
                    <Stepper activeStep={statusIdx} alternativeLabel sx={{ mb: 3 }}>
                      {steps.map((label, idx) => {
                        // Get the appropriate message for each step
                        let tooltipMessage = "Not started yet";
                        
                        if (idx <= statusIdx) {
                          // Step has been completed or is current
                          const notification = order.notifications?.find(
                            n => getStatusIndex(n.status) === idx
                          );
                          
                          if (notification) {
                            tooltipMessage = notification.message;
                          } else {
                            // Default messages based on step
                            switch (label) {
                              case "PLACED":
                                tooltipMessage = "Warehouse has confirmed and processed the order";
                                break;
                              case "PROCESSING":
                                tooltipMessage = "Distributor has packed and prepared the order for shipment";
                                break;
                              case "SHIPPED":
                                tooltipMessage = "Agent has dispatched the product";
                                break;
                              case "OUT_FOR_DELIVERY":
                                tooltipMessage = "Courier is out for delivery";
                                break;
                              case "DELIVERED":
                                tooltipMessage = "Product has been delivered";
                                break;
                              default:
                                tooltipMessage = "Status updated";
                            }
                          }
                        }

                        return (
                          <Step key={label}>
                            <Tooltip title={tooltipMessage} arrow placement="top">
                              <StepLabel>{label}</StepLabel>
                            </Tooltip>
                          </Step>
                        );
                      })}
                    </Stepper>

                    {/* USERNAME-BASED UPDATE BUTTON */}
                    {canUpdate && statusIdx < steps.length - 1 && (
                      <Button
                        variant="contained"
                        color="primary"
                        sx={{ mb: 3, fontSize: 15 }}
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
        </>
      )}

      {/* Tab 2: Notifications */}
      {tab === 1 && (
        <NotificationsTab username={username} userType={userType} />
      )}
    </Box>
  );
}