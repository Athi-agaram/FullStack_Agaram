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
  Tooltip,
  Badge,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { 
  getOrdersApi, 
  updateOrderStatusApi, 
  sendNotificationApi,
} from "../../api/api";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import NotificationsTab from "./NotificationsTab";
import AssignmentReturnIcon from "@mui/icons-material/AssignmentReturn";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import ReturnExchangeDialog from "./ReturnExchange";

const steps = ["PLACED", "PROCESSING", "SHIPPED", "OUT_FOR_DELIVERY", "DELIVERED"];

const USER_PERMISSIONS = {
  "admin": { canUpdateAny: true },
  "administrator": { canUpdateAny: true },
  "warehouse": { allowedStep: "PLACED" },
  "distributor": { allowedStep: "PROCESSING" },
  "agent": { allowedStep: "SHIPPED" },
  "courier": { allowedStep: "OUT_FOR_DELIVERY" },
};

const canUserUpdateStep = (username, currentStep) => {
  if (!username || !currentStep) return false;
  const lowerUsername = username.trim().toLowerCase();
  const upperCurrentStep = currentStep.trim().toUpperCase();
  const userPerm = USER_PERMISSIONS[lowerUsername];
  if (!userPerm) return false;
  if (userPerm.canUpdateAny) return true;
  return userPerm.allowedStep === upperCurrentStep;
};

const getUserType = (username) => {
  if (!username) return "USER";
  const lowerUsername = username.trim().toLowerCase();
  const userPerm = USER_PERMISSIONS[lowerUsername];
  if (!userPerm) return "USER";
  if (userPerm.canUpdateAny) return "ADMIN";
  if (userPerm.allowedStep === "PLACED") return "WAREHOUSE";
  if (userPerm.allowedStep === "PROCESSING") return "DISTRIBUTOR";
  if (userPerm.allowedStep === "SHIPPED") return "AGENT";
  if (userPerm.allowedStep === "OUT_FOR_DELIVERY") return "COURIER";
  return "USER";
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
  const [updating, setUpdating] = useState({});

  const [messageDialog, setMessageDialog] = useState({
    open: false,
    orderId: null,
    nextStatus: null,
    currentStatus: null,
    message: "",
  });

  const [returnExchangeDialog, setReturnExchangeDialog] = useState({
    open: false,
    type: null,
  });

  const getUserFromStorage = () => {
    try {
      const userStr = localStorage.getItem("user");
      if (!userStr) return null;
      return JSON.parse(userStr);
    } catch (e) {
      console.error("Error parsing user from localStorage:", e);
      return null;
    }
  };

  const user = getUserFromStorage();
  const username = user?.username?.trim() || "";
  const userType = getUserType(username);

  useEffect(() => {
    if (!user || !user.id) {
      setError("User not logged in. Please login first.");
      setLoading(false);
      return;
    }
    
    fetchOrders();
    const interval = setInterval(fetchUnreadCount, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (orders.length > 0) {
      fetchUnreadCount();
    }
  }, [orders]);

  const fetchOrders = async () => {
    if (!user || !user.id) {
      setError("User not logged in");
      setLoading(false);
      return;
    }

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
        status: order.status?.trim().toUpperCase() || 'PLACED',
        total_amount: Number(order.total_amount || 0),
        created_at: order.created_at,
        notifications: order.notifications || [],
        items: (order.items || []).map(item => ({
          id: item.product_id,
          order_item_id: item.order_item_id || item.id,
          name: item.product_name,
          image: item.product_image,
          price: Number(item.price || 0),
          qty: Number(item.qty || 0),
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

  const fetchUnreadCount = async () => {
    try {
      let count = 0;

      orders.forEach(order => {
        const notifs = order.notifications || [];
        if (notifs.length === 0) return;

        const latest = notifs[notifs.length - 1];
        if (!latest) return;

        const latestStatus = (latest.status || "").toUpperCase();

        if (userType === "USER") {
          if (order.username === username) count++;
          return;
        }

        if (userType === "ADMIN") {
          count++;
          return;
        }

        if (userType === "WAREHOUSE") {
          if (latestStatus === "PLACED" || latestStatus === "PROCESSING") {
            count++;
          }
          return;
        }

        if (userType === "DISTRIBUTOR") {
          if (latestStatus === "PROCESSING") {
            count++;
          }
          return;
        }

        if (userType === "AGENT") {
          if (latestStatus === "SHIPPED") {
            count++;
          }
          return;
        }

        if (userType === "COURIER") {
          if (latestStatus === "OUT_FOR_DELIVERY") {
            count++;
          }
          return;
        }
      });

      setUnreadCount(count);
    } catch (e) {
      console.error("Error fetching unread count:", e);
    }
  };

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

    if (updating[order.id]) {
      console.log("Update already in progress for order:", order.id);
      return;
    }

    const isAgentShipping = (userType === "AGENT" && nextStatus === "SHIPPED") || 
                           (username?.toLowerCase() === "agent" && nextStatus === "SHIPPED");

    if (isAgentShipping) {
      setMessageDialog({
        open: true,
        orderId: order.id,
        nextStatus: nextStatus,
        currentStatus: order.status,
        message: "",
      });
      return;
    }

    await updateOrderStatus(order.id, nextStatus, order.status, null);
  };

  const updateOrderStatus = async (orderId, nextStatus, currentStatus, customMessage) => {
    if (updating[orderId]) {
      console.log("Update already in progress for order:", orderId);
      return;
    }

    setUpdating(prev => ({ ...prev, [orderId]: true }));
    
    try {
      const res = await updateOrderStatusApi(orderId, nextStatus, currentStatus, username);

      if (res.data?.success) {
        if (customMessage && customMessage.trim()) {
          await sendNotificationApi({
            orderId: orderId,
            username: username,
            message: customMessage.trim(),
            status: nextStatus
          });
        }

        await fetchOrders();
        alert(`Order #${orderId} moved to ${nextStatus}`);
      } else {
        alert("Failed to update order status");
      }
    } catch (e) {
      console.error("Failed to update status", e);
      alert("Failed to update order status: " + (e.message || e));
    } finally {
      setUpdating(prev => ({ ...prev, [orderId]: false }));
    }
  };

  const handleMessageDialogClose = () => {
    setMessageDialog({
      open: false,
      orderId: null,
      nextStatus: null,
      currentStatus: null,
      message: "",
    });
  };

  const handleMessageSubmit = async () => {
    if (!messageDialog.message.trim()) {
      alert("Please enter a message for the customer");
      return;
    }

    await updateOrderStatus(
      messageDialog.orderId, 
      messageDialog.nextStatus, 
      messageDialog.currentStatus,
      messageDialog.message
    );
    
    handleMessageDialogClose();
  };

  const handleTabChange = (e, newValue) => {
    setTab(newValue);
    if (newValue === 1) {
      setTimeout(() => setUnreadCount(0), 500);
    }
  };

  const handleOpenReturnExchange = (type) => {
    setReturnExchangeDialog({
      open: true,
      type: type,
    });
  };

  const handleCloseReturnExchange = () => {
    setReturnExchangeDialog({
      open: false,
      type: null,
    });
  };

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
        <Typography variant="h6" color="error">{error}</Typography>
        {error.includes("not logged in") && (
          <Button 
            variant="contained" 
            sx={{ mt: 2 }}
            onClick={() => window.location.href = "/login"}
          >
            Go to Login
          </Button>
        )}
      </Paper>
    );
  }

  return (
    <Box sx={{ 
      p: 2,
      background: "linear-gradient(135deg, #10002eff 0%, #87c8eeff 100%)",
      minHeight: "100vh"
    }}>
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

      {/* Agent Message Dialog */}
      <Dialog 
        open={messageDialog.open} 
        onClose={handleMessageDialogClose}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Enter Shipment Message for Customer
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2, mt: 2 }}>
            Please provide information about the shipment location, expected delivery time, or any other relevant details for Order #{messageDialog.orderId}
          </Typography>
          <TextField
            autoFocus
            fullWidth
            multiline
            rows={4}
            label="Message to Customer"
            placeholder="e.g., Your order is currently at Delhi warehouse and will be dispatched within 24 hours."
            value={messageDialog.message}
            onChange={(e) => setMessageDialog(prev => ({ ...prev, message: e.target.value }))}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleMessageDialogClose} color="inherit">
            Cancel
          </Button>
          <Button 
            onClick={handleMessageSubmit} 
            variant="contained" 
            color="primary"
            disabled={!messageDialog.message.trim()}
          >
            Send & Update Status
          </Button>
        </DialogActions>
      </Dialog>

      {/* Return/Exchange Dialog */}
      <ReturnExchangeDialog
        open={returnExchangeDialog.open}
        type={returnExchangeDialog.type}
        onClose={handleCloseReturnExchange}
        filteredOrders={filteredOrders}
        user={user}
        username={username}
        formatCurrency={formatCurrency}
        onSuccess={fetchOrders}
      />

      {tab === 0 && (
        <>
          <Box sx={{ mb: 3, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
            <Button
              variant="contained"
              startIcon={<AssignmentReturnIcon />}
              onClick={() => handleOpenReturnExchange('RETURN')}
              sx={{ 
                backgroundColor: '#ba3500ff',
                color: '#ffffffff',
                fontWeight: 'bold',
                '&:hover': { backgroundColor: '#ff6a00ff' }
              }}
            >
              Return Order
            </Button>
            <Button
              variant="contained"
              startIcon={<SwapHorizIcon />}
              onClick={() => handleOpenReturnExchange('EXCHANGE')}
              sx={{ 
                backgroundColor: '#800396ff',
                color: '#ffffffff',
                fontWeight: 'bold',
                '&:hover': { backgroundColor: '#b300ffff' }
              }}
            >
              Exchange Order
            </Button>
          </Box>

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

                <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                  <Box sx={{ p: 2 }}>
                    <Typography fontWeight={600} sx={{ mb: 1 }}>
                      Status: {order.status}
                    </Typography>

                    <Stepper activeStep={statusIdx} alternativeLabel sx={{ mb: 3 }}>
                      {steps.map((label, idx) => {
                        let tooltipMessage = "Not started yet";

                        const latestNotification = order.notifications?.[order.notifications.length - 1];

                        if (idx <= statusIdx) {
                          if (latestNotification && (latestNotification.status || "").toUpperCase() === label) {
                            tooltipMessage = latestNotification.message;
                            } else {
                            switch (label) {
                              case "PLACED":
                                tooltipMessage = "Order has been placed successfully.";
                                break;
                              case "PROCESSING":
                                tooltipMessage = "Warehouse has confirmed and processed the order.";
                                break;
                              case "SHIPPED":
                                tooltipMessage = "Agent is ready to ship your order.";
                                break;
                              case "OUT_FOR_DELIVERY":
                                tooltipMessage = "Courier is out for delivery.";
                                break;
                              case "DELIVERED":
                                tooltipMessage = "Your order has been delivered successfully.";
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

                    {canUpdate && statusIdx < steps.length - 1 && (
                      <Button
                        variant="contained"
                        color="primary"
                        sx={{ mb: 3, fontSize: 15 }}
                        onClick={() => handleNextStatus(order)}
                        disabled={updating[order.id]}
                      >
                        {updating[order.id] ? (
                          <>
                            <CircularProgress size={20} sx={{ mr: 1 }} color="inherit" />
                            Updating...
                          </>
                        ) : (
                          userType === "AGENT" && steps[statusIdx + 1] === "SHIPPED" 
                            ? "Ship Order & Add Message" 
                            : `Move to ${steps[statusIdx + 1]}`
                        )}
                      </Button>
                    )}

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

      {tab === 1 && (
        <NotificationsTab username={username} userType={userType} />
      )}
    </Box>
  );
}