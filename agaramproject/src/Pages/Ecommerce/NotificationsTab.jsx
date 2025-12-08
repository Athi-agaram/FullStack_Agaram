import React, { useEffect, useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Button,
  CircularProgress,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Divider,
  Grid,
  Card,
  CardMedia,
  Stepper,
  Step,
  StepLabel,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  IconButton,
  Tooltip,
  Tabs,
  Tab,
  Badge,
  Collapse,
} from "@mui/material";

import NotificationsIcon from "@mui/icons-material/Notifications";
import SendIcon from "@mui/icons-material/Send";
import MessageIcon from "@mui/icons-material/Message";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import AssignmentReturnIcon from "@mui/icons-material/AssignmentReturn";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";

import {
  getNotificationsApi,
  sendNotificationApi,
  getAllReturnExchangesApi,
  getReturnExchangesByUserApi,
  reviewReturnExchangeApi,
  updateReturnExchangeProgressApi,
} from "../../api/api";


const RETURN_EXCHANGE_STEPS = [
  "PENDING",
  "APPROVED",
  "PICKED_UP",
  "IN_TRANSIT_TO_WAREHOUSE",
  "RECEIVED_AT_WAREHOUSE",
  "QUALITY_CHECK_IN_PROGRESS",
  "QUALITY_CHECK_PASSED",
  "PROCESSING",
  "COMPLETED",
];

const getUserType = (username) => {
  const lower = username?.toLowerCase?.();
  if (!lower) return "USER";
  if (lower === "admin" || lower === "administrator") return "ADMIN";
  if (lower === "warehouse") return "WAREHOUSE";
  if (lower === "distributor") return "DISTRIBUTOR";
  if (lower === "agent") return "AGENT";
  if (lower === "courier") return "COURIER";
  return "USER";
};
const getAvailableStatusOptions = (userType, currentStatus) => {
  if (!currentStatus) return [];
  
  const normalized = currentStatus.toUpperCase();
  
  switch (userType) {
    case "COURIER":
      if (normalized === "APPROVED") {
        return [{ value: "PICKED_UP", label: "Picked Up" }];
      }
      return [];
    
    case "AGENT":
      if (normalized === "PICKED_UP") {
        return [{ value: "IN_TRANSIT_TO_WAREHOUSE", label: "In Transit to Warehouse" }];
      }
      return [];
    
    case "DISTRIBUTOR":
      if (normalized === "IN_TRANSIT_TO_WAREHOUSE") {
        return [{ value: "RECEIVED_AT_WAREHOUSE", label: "Received at Warehouse" }];
      }
      return [];
    
    case "WAREHOUSE":
      if (normalized === "RECEIVED_AT_WAREHOUSE") {
        return [
          { value: "QUALITY_CHECK_PASSED", label: "Quality Check Passed" },
          { value: "QUALITY_CHECK_FAILED", label: "Quality Check Failed" }
        ];
      }
      if (normalized === "QUALITY_CHECK_PASSED") {
        return [{ value: "COMPLETED", label: "Completed" }];
      }
      return [];
    
    default:
      return [];
  }
};



export default function NotificationsTab({ username: propUsername, userType: propUserType }) {
  // allow prop-driven username/userType but fallback to localStorage
  const getUserFromStorage = () => {
    try {
      const u = localStorage.getItem("user");
      return u ? JSON.parse(u) : null;
    } catch {
      return null;
    }
  };
  const storedUser = getUserFromStorage();
  const username = propUsername ?? storedUser?.username ?? "";
  const userType = propUserType ?? getUserType(username);

  const [loading, setLoading] = useState(true);

  // Order notifications grouped by order
  const [groupedNotifs, setGroupedNotifs] = useState([]);

  // Return/exchange requests shown in second tab
  const [returnExchangeNotifs, setReturnExchangeNotifs] = useState([]);

  // UI states
  const [tabValue, setTabValue] = useState(0);
  const [messageBoxOpen, setMessageBoxOpen] = useState({});
  const [agentMessages, setAgentMessages] = useState({});
  const [sending, setSending] = useState({});

  // Dialog for viewing & managing a single return/exchange request
  const [requestDialog, setRequestDialog] = useState({
    open: false,
    request: null, // full request object
  });

  // Admin review modal fields
  const [adminNotes, setAdminNotes] = useState("");
  const [processing, setProcessing] = useState(false);

  // Progress update modal for team members
  const [progressDialog, setProgressDialog] = useState({
    open: false,
    requestId: null,
    currentStatus: null,
  });
  const [progressStatus, setProgressStatus] = useState("");
  const [progressMessage, setProgressMessage] = useState("");

  // fetch both notifications and return-exchange lists
  useEffect(() => {
    fetchAll();
    const interval = setInterval(fetchAll, 30000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [username, userType]);

  const fetchAll = async () => {
    setLoading(true);
    await Promise.all([fetchNotifications(), fetchReturnExchangeNotifications()]);
    setLoading(false);
  };

  // ---------------------- Order Notifications ----------------------
  const fetchNotifications = async () => {
    try {
      const res = await getNotificationsApi(username);
      const allNotifs = res.data || [];

      // group by order_id and keep latest notification per order
      const grouped = {};
      allNotifs.forEach((notif) => {
        const orderId = notif.order_id;
        if (!orderId) return;
        if (!grouped[orderId]) {
          grouped[orderId] = {
            order_id: orderId,
            customer_username: notif.customer_username,
            item_count: notif.item_count,
            latestNotification: notif,
            relevantStatus: notif.status,
          };
        } else {
          const cur = new Date(grouped[orderId].latestNotification.created_at || 0);
          const n = new Date(notif.created_at || 0);
          if (n > cur) {
            grouped[orderId].latestNotification = notif;
            grouped[orderId].relevantStatus = notif.status;
          }
        }
      });

      const arr = Object.values(grouped).sort((a, b) => {
        const A = new Date(a.latestNotification.created_at || 0);
        const B = new Date(b.latestNotification.created_at || 0);
        return B - A;
      });

      setGroupedNotifs(arr);
    } catch (err) {
      console.error("fetchNotifications error:", err);
      setGroupedNotifs([]);
    }
  };

  const toggleMessageBox = (orderId) => {
    setMessageBoxOpen((p) => ({ ...p, [orderId]: !p[orderId] }));
  };

  const handleMessageChange = (orderId, message) => {
    setAgentMessages((p) => ({ ...p, [orderId]: message }));
  };

  const handleSendMessage = async (orderId, currentStatus) => {
    const message = (agentMessages[orderId] || "").trim();
    if (!message) {
      alert("Please enter a message");
      return;
    }
    try {
      setSending((p) => ({ ...p, [orderId]: true }));
      await sendNotificationApi({
        orderId,
        username,
        message,
        status: currentStatus,
      });
      setAgentMessages((p) => ({ ...p, [orderId]: "" }));
      setMessageBoxOpen((p) => ({ ...p, [orderId]: false }));
      await fetchNotifications();
      alert("Message sent successfully!");
    } catch (err) {
      console.error("sendNotificationApi error:", err);
      alert("Failed to send message");
    } finally {
      setSending((p) => ({ ...p, [orderId]: false }));
    }
  };

  // ---------------------- Return / Exchange ----------------------
const fetchReturnExchangeNotifications = async () => {
  try {
    let res;
    // ALL team members (including regular users) should fetch ALL requests
    // Filtering will happen on frontend based on role
    if (userType === "USER") {
      // Only regular users fetch by their user ID
      res = await getReturnExchangesByUserApi(storedUser.id);
    } else {
      // Admin, Courier, Agent, Distributor, Warehouse all fetch ALL requests
      res = await getAllReturnExchangesApi();
    }

    let requests = res.data || [];

    // Filter based on user type and current status
    if (userType === "ADMIN") {
      // Admin sees only PENDING requests
      requests = requests.filter((r) => r.status === "PENDING");
    } else if (userType === "COURIER") {
      // Courier sees only APPROVED requests (waiting for pickup)
      requests = requests.filter((r) => r.status === "APPROVED");
    } else if (userType === "AGENT") {
      // Agent sees only PICKED_UP requests (waiting for transit)
      requests = requests.filter((r) => r.status === "PICKED_UP");
    } else if (userType === "DISTRIBUTOR") {
      // Distributor sees only IN_TRANSIT_TO_WAREHOUSE requests
      requests = requests.filter((r) => r.status === "IN_TRANSIT_TO_WAREHOUSE");
    } else if (userType === "WAREHOUSE") {
      // Warehouse sees RECEIVED_AT_WAREHOUSE and QUALITY_CHECK_PASSED
      requests = requests.filter(
        (r) => r.status === "RECEIVED_AT_WAREHOUSE" || r.status === "QUALITY_CHECK_PASSED"
      );
    }
    // USER already filtered by userId above

    const withLatest = requests
      .map((r) => {
        const notifs = r.notifications || [];
        const latest = notifs.length > 0 ? notifs[notifs.length - 1] : null;
        return { ...r, latestNotification: latest };
      })
      .sort((a, b) => {
        const aDate = a.latestNotification ? new Date(a.latestNotification.created_at) : new Date(a.created_at);
        const bDate = b.latestNotification ? new Date(b.latestNotification.created_at) : new Date(b.created_at);
        return bDate - aDate;
      });

    setReturnExchangeNotifs(withLatest);
  } catch (err) {
    console.error("fetchReturnExchangeNotifications error:", err);
    setReturnExchangeNotifs([]);
  }
};

  // Open request modal
  const openRequestDialog = (request) => {
    setRequestDialog({ open: true, request });
    setAdminNotes("");
  };

  const closeRequestDialog = () => {
    setRequestDialog({ open: false, request: null });
    setAdminNotes("");
  };

  // Admin approve/reject
  const handleReviewRequest = async (action) => {
    if (!requestDialog.request) return;
    const id = requestDialog.request.id;
    try {
      setProcessing(true);
      const reviewData = {
        status: action,
        reviewedBy: username,
        adminNotes: adminNotes.trim(),
      };
      const res = await reviewReturnExchangeApi(id, reviewData);
      if (res.data?.success) {
        alert(`Request ${action}ed successfully`);
        closeRequestDialog();
        fetchReturnExchangeNotifications();
      } else {
        alert("Failed to submit review: " + (res.data?.message || "unknown"));
      }
    } catch (err) {
      console.error("reviewReturnExchangeApi error:", err);
      alert("Failed to review request: " + (err?.response?.data?.message || err.message));
    } finally {
      setProcessing(false);
    }
  };

  // Team members (warehouse/distributor/agent/courier) update progress
  const openProgressDialog = (requestId, currentStatus) => {
    setProgressDialog({ open: true, requestId, currentStatus });
    setProgressStatus("");
    setProgressMessage("");
  };
  const closeProgressDialog = () => {
    setProgressDialog({ open: false, requestId: null, currentStatus: null });
    setProgressStatus("");
    setProgressMessage("");
  };
const handleUpdateProgress = async () => {
    if (!progressDialog.requestId || !progressStatus) {
      alert("Please select a status");
      return;
    }

    try {
      setProcessing(true);

      const updateData = {
        status: progressStatus,  // Make sure this is exactly "QUALITY_CHECK_PASSED" or "QUALITY_CHECK_FAILED"
        updatedBy: username,
        message: progressMessage.trim(),
      };

      console.log("Sending update:", updateData); // ADD THIS LINE FOR DEBUGGING

      const res = await updateReturnExchangeProgressApi(progressDialog.requestId, updateData);
      if (res.data?.success) {
        alert("Progress updated");
        closeProgressDialog();
        fetchReturnExchangeNotifications();
      } else {
        alert("Failed to update progress: " + (res.data?.message || "unknown"));
      }
    } catch (err) {
      console.error("updateReturnExchangeProgressApi error:", err);
      alert("Failed to update progress: " + (err?.response?.data?.message || err.message));
    } finally {
      setProcessing(false);
    }
  };

  // Helpers
  const getStatusColor = (status) => {
    const colors = {
      PLACED: "#2196f3",
      PROCESSING: "#ff9800",
      SHIPPED: "#9c27b0",
      OUT_FOR_DELIVERY: "#ff5722",
      DELIVERED: "#4caf50",
      PENDING: "#ff9800",
      APPROVED: "#4caf50",
      REJECTED: "#f44336",
      PICKED_UP: "#2196f3",
      IN_TRANSIT_TO_WAREHOUSE: "#2196f3",
      RECEIVED_AT_WAREHOUSE: "#9c27b0",
      QUALITY_CHECK_IN_PROGRESS: "#ff9800",
      QUALITY_CHECK_PASSED: "#4caf50",
      COMPLETED: "#4caf50",
    };
    return colors[status?.toUpperCase?.()] || "#757575";
  };

  const getDisplayUserType = (type) => {
    const types = {
      ADMIN: "Admin",
      WAREHOUSE: "Warehouse",
      DISTRIBUTOR: "Distributor",
      AGENT: "Agent",
      COURIER: "Courier",
      USER: "Customer",
      SYSTEM: "System",
    };
    return types[type] || type;
  };

  const formatCurrency = (amt) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(amt || 0);

  const getStepIndex = (status) => {
    const idx = RETURN_EXCHANGE_STEPS.indexOf(status?.toUpperCase?.());
    return idx === -1 ? 0 : idx;
  };

  // For badge count on return/exchange tab
  const getReturnExchangeUnreadCount = () => {
    if (userType === "ADMIN") return returnExchangeNotifs.filter((r) => r.status === "PENDING").length;
    return returnExchangeNotifs.length;
  };

  // Loading state
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" py={10}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Tabs
        value={tabValue}
        onChange={(e, v) => setTabValue(v)}
        sx={{ mb: 2,backgroundColor: "#fff", borderRadius: 2, boxShadow: 1,position: "sticky", top: 65, zIndex: 10 }}
      >
        <Tab
          label={
            <Badge badgeContent={groupedNotifs.length} color="primary">
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <NotificationsIcon />
                Order Updates
              </Box>
            </Badge>
          }
        />
        <Tab
          label={
            <Badge badgeContent={getReturnExchangeUnreadCount()} color="error">
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <AssignmentReturnIcon />
                Return/Exchange
              </Box>
            </Badge>
          }
        />
      </Tabs>

      {/* ---------------- Order Notifications ---------------- */}
      {tabValue === 0 && (
        <Box>
          {groupedNotifs.length === 0 ? (
            <Paper sx={{ p: 4, textAlign: "center", backgroundColor: "#fff" }}>
              <NotificationsIcon sx={{ fontSize: 60, color: "#bdbdbd", mb: 2 }} />
              <Typography variant="h6" color="text.secondary">
                No order notifications yet
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                {userType === "USER" ? "You'll see your order updates here" : "You'll see relevant order updates here"}
              </Typography>
            </Paper>
          ) : (
            groupedNotifs.map((og) => {
              const notif = og.latestNotification;
              const currentStatus = notif.status || notif.order_status || "UNKNOWN";
              const itemCount = og.item_count || 0;
              const orderId = og.order_id;
              const isBoxOpen = !!messageBoxOpen[orderId];
              const senderType = getUserType(notif.sender_username);

              return (
                <Paper
                  key={orderId}
                  sx={{
                    p: 3,
                    mb: 3,
                    borderRadius: 3,
                    boxShadow: 3,
                    border: "1px solid #e0e0e0",
                    background: "#fff",
                  }}
                >
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
                    <Box>
                      <Typography variant="h6" fontWeight={600} sx={{ mb: 0.5 }}>
                        Order #{orderId}
                        {og.customer_username && (
                          <span style={{ fontSize: "0.9em", fontWeight: 400, marginLeft: 8 }}>
                            by {og.customer_username}
                          </span>
                        )}
                      </Typography>
                      {itemCount > 0 && (
                        <Typography variant="caption" color="text.secondary">
                          {itemCount} item{itemCount !== 1 ? "s" : ""} in this order
                        </Typography>
                      )}
                    </Box>

                    <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                      <Chip
                        label={currentStatus}
                        size="small"
                        sx={{ backgroundColor: getStatusColor(currentStatus), color: "#fff", fontWeight: 600 }}
                      />
                      {userType === "AGENT" && (
                        <IconButton
                          size="small"
                          onClick={() => toggleMessageBox(orderId)}
                          sx={{
                            backgroundColor: isBoxOpen ? "#9c27b0" : "#f5f5f5",
                            color: isBoxOpen ? "#fff" : "#9c27b0",
                            "&:hover": { backgroundColor: isBoxOpen ? "#7b1fa2" : "#e0e0e0" },
                          }}
                        >
                          {isBoxOpen ? <ExpandLessIcon /> : <MessageIcon />}
                        </IconButton>
                      )}
                    </Box>
                  </Box>

                  {/* Agent message box */}
                  {userType === "AGENT" && (
                    <Collapse in={isBoxOpen}>
                      <Box sx={{ p: 2, mb: 2, backgroundColor: "#f3e5f5", borderRadius: 2, border: "2px solid #9c27b0" }}>
                        <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1, color: "#7b1fa2" }}>
                          Send Message to Customer
                        </Typography>
                        <TextField
                          fullWidth
                          multiline
                          rows={3}
                          placeholder="e.g., Your order is at Mumbai warehouse and will be dispatched within 24 hours..."
                          value={agentMessages[orderId] || ""}
                          onChange={(e) => handleMessageChange(orderId, e.target.value)}
                          sx={{
                            mb: 1,
                            backgroundColor: "#fff",
                            "& .MuiOutlinedInput-root": {
                              "&:hover fieldset": { borderColor: "#9c27b0" },
                              "&.Mui-focused fieldset": { borderColor: "#9c27b0" },
                            },
                          }}
                        />
                        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
                          <Button variant="outlined" size="small" onClick={() => toggleMessageBox(orderId)} sx={{ color: "#9c27b0", borderColor: "#9c27b0" }}>
                            Cancel
                          </Button>
                          <Button
                            variant="contained"
                            size="small"
                            startIcon={sending[orderId] ? <CircularProgress size={16} color="inherit" /> : <SendIcon />}
                            onClick={() => handleSendMessage(orderId, currentStatus)}
                            disabled={!agentMessages[orderId]?.trim() || sending[orderId]}
                            sx={{ backgroundColor: "#9c27b0", "&:hover": { backgroundColor: "#7b1fa2" } }}
                          >
                            {sending[orderId] ? "Sending..." : "Send Message"}
                          </Button>
                        </Box>
                      </Box>
                    </Collapse>
                  )}

                  <Divider sx={{ mb: 3 }} />

                  <Box sx={{ p: 3, backgroundColor: "#f5f5f5", borderRadius: 2, borderLeft: `6px solid ${getStatusColor(currentStatus)}`, position: "relative" }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
                      <Box sx={{ display: "flex", gap: 1, alignItems: "center", flexWrap: "wrap" }}>
                        <Chip label={currentStatus} sx={{ backgroundColor: getStatusColor(currentStatus), color: "#fff", fontWeight: 600 }} />
                        {userType !== "USER" && <Chip label={getDisplayUserType(senderType)} size="small" variant="outlined" sx={{ fontWeight: 600 }} />}
                      </Box>

                      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                        <AccessTimeIcon sx={{ fontSize: 16, color: "text.secondary" }} />
                        <Typography variant="caption" color="text.secondary">
                          {new Date(notif.created_at).toLocaleDateString()} {new Date(notif.created_at).toLocaleTimeString()}
                        </Typography>
                      </Box>
                    </Box>

                    <Typography variant="body1" sx={{ mt: 1, lineHeight: 1.6 }}>
                      {notif.message}
                    </Typography>
                  </Box>
                </Paper>
              );
            })
          )}
        </Box>
      )}

      {/* ---------------- Return/Exchange Tab (integrated manager via modal) ---------------- */}
      {tabValue === 1 && (
        <Box>
          {returnExchangeNotifs.length === 0 ? (
            <Paper sx={{ p: 4, textAlign: "center", backgroundColor: "#fff" }}>
              <AssignmentReturnIcon sx={{ fontSize: 60, color: "#bdbdbd", mb: 2 }} />
              <Typography variant="h6" color="text.secondary">
                No return/exchange notifications
              </Typography>
            </Paper>
          ) : (
            returnExchangeNotifs.map((request) => {
              const notif = request.latestNotification;
              const latestStatus = request.status;
              return (
                <Paper key={request.id} sx={{ p: 3, mb: 3, borderRadius: 3, boxShadow: 3, background: "#fff", border: "1px solid #e0e0e0" }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
                    <Box>
                      <Typography variant="h6" fontWeight={600} sx={{ mb: 0.5 }}>
                        {request.type === "RETURN" ? <AssignmentReturnIcon sx={{ mr: 1, verticalAlign: "middle" }} /> : <SwapHorizIcon sx={{ mr: 1, verticalAlign: "middle" }} />}
                        {request.type} Request #{request.id}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Order #{request.order_id} | Customer: {request.username}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Created: {new Date(request.created_at).toLocaleDateString()}
                      </Typography>
                    </Box>

                    <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                      <Chip label={request.status} size="small" sx={{ backgroundColor: getStatusColor(request.status), color: "#fff", fontWeight: 600 }} />
                      <Button variant="contained" size="small" onClick={() => openRequestDialog(request)}>
                        Open
                      </Button>
                    </Box>
                  </Box>

                  <Divider sx={{ mb: 2 }} />

                  {notif ? (
                    <Box sx={{ p: 2, backgroundColor: "#f5f5f5", borderRadius: 2, borderLeft: `6px solid ${getStatusColor(notif.status)}` }}>
                      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                        <Chip label={notif.status?.replace(/_/g, " ")} size="small" sx={{ backgroundColor: getStatusColor(notif.status), color: "#fff", fontWeight: 600 }} />
                        <Typography variant="caption" color="text.secondary">
                          {new Date(notif.created_at).toLocaleDateString()} {new Date(notif.created_at).toLocaleTimeString()}
                        </Typography>
                      </Box>
                      <Typography variant="body1" sx={{ mt: 1 }}>
                        {notif.message}
                      </Typography>
                      {notif.sender_username && notif.sender_username !== "SYSTEM" && (
                        <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: "block" }}>
                          By: {notif.sender_username}
                        </Typography>
                      )}
                    </Box>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      No activity yet for this request.
                    </Typography>
                  )}

                  {userType === "ADMIN" && request.status === "PENDING" && (
                    <Box sx={{ mt: 2 }}>

                    </Box>
                  )}
                </Paper>
              );
            })
          )}
        </Box>
      )}

      {/* ---------------- Request Detail Modal (used by admins & team) ---------------- */}
      <Dialog open={Boolean(requestDialog.open)} onClose={closeRequestDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {requestDialog.request ? `${requestDialog.request.type} Request #${requestDialog.request.id}` : "Request"}
        </DialogTitle>
        <DialogContent dividers>
          {!requestDialog.request ? (
            <Box py={2}>
              <Typography>Loading...</Typography>
            </Box>
          ) : (
            <>
              {/* Basic info */}
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
                <Box>
                  <Typography variant="subtitle1">
                    Order #{requestDialog.request.order_id} • Customer: {requestDialog.request.username}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Created: {new Date(requestDialog.request.created_at).toLocaleString()}
                  </Typography>
                </Box>
                <Chip label={requestDialog.request.status} sx={{ backgroundColor: getStatusColor(requestDialog.request.status), color: "#fff", fontWeight: 600 }} />
              </Box>

              <Divider sx={{ my: 2 }} />

              {/* Items */}
              <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1 }}>
                Items
              </Typography>
              <Grid container spacing={2} sx={{ mb: 2 }}>
                {(requestDialog.request.items || []).map((it, i) => (
                  <Grid item xs={12} sm={6} md={4} key={i}>
                    <Paper sx={{ p: 2 }}>
                      <Typography fontWeight={600}>{it.product_name || it.productName || it.name}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        Qty: {it.qty} | {formatCurrency(it.price)}
                      </Typography>
                      {it.exchange_product_name && <Chip label={`Exchange: ${it.exchange_product_name}`} size="small" sx={{ mt: 1 }} />}
                    </Paper>
                  </Grid>
                ))}
              </Grid>

              {/* Reason */}
              <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1 }}>
                Reason
              </Typography>
              <Paper sx={{ p: 2, mb: 2, backgroundColor: "#f9f9f9" }}>
                <Typography>{requestDialog.request.reason}</Typography>
              </Paper>

              {/* Images */}
              {requestDialog.request.images && requestDialog.request.images.length > 0 && (
                <>
                  <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1 }}>
                    Uploaded Images
                  </Typography>
                  <Grid container spacing={2} sx={{ mb: 2 }}>
                    {requestDialog.request.images.map((img, idx) => (
                      <Grid item xs={6} sm={4} md={3} key={idx}>
                        <Card>
                          <CardMedia component="img" height="150" image={img.image_data || img} alt={`img-${idx}`} sx={{ objectFit: "contain" }} />
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                </>
              )}

              {/* Progress / Timeline */}
              <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1 }}>
                Progress
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Stepper activeStep={getStepIndex(requestDialog.request.status)} alternativeLabel>
                  {RETURN_EXCHANGE_STEPS.map((s) => (
                    <Step key={s}>
                      <StepLabel>{s.replace(/_/g, " ")}</StepLabel>
                    </Step>
                  ))}
                </Stepper>
              </Box>

              {/* Activity timeline */}
              {requestDialog.request.notifications && requestDialog.request.notifications.length > 0 && (
                <>
                  <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1 }}>
                    Activity Timeline
                  </Typography>
                  <Box sx={{ mb: 2 }}>
                    {requestDialog.request.notifications.map((n, i) => (
                      <Paper key={i} sx={{ p: 2, mb: 1, borderLeft: `4px solid ${getStatusColor(n.status)}` }}>
                        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                          <Chip label={n.status?.replace(/_/g, " ")} size="small" sx={{ backgroundColor: getStatusColor(n.status), color: "#fff" }} />
                          <Typography variant="caption" color="text.secondary">
                            {new Date(n.created_at).toLocaleString()}
                          </Typography>
                        </Box>
                        <Typography variant="body2">{n.message}</Typography>
                        {n.sender_username && n.sender_username !== "SYSTEM" && (
                          <Typography variant="caption" color="text.secondary">
                            By: {n.sender_username}
                          </Typography>
                        )}
                      </Paper>
                    ))}
                  </Box>
                </>
              )}

              {/* Admin Notes if present */}
              {requestDialog.request.admin_notes && (
                <Paper sx={{ p: 2, mb: 2, backgroundColor: "#fff3e0", border: "1px solid #ff9800" }}>
                  <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1 }}>
                    Admin Notes
                  </Typography>
                  <Typography>{requestDialog.request.admin_notes}</Typography>
                </Paper>
              )}
            </>
          )}
        </DialogContent>

        <DialogActions sx={{ display: "flex", justifyContent: "space-between", px: 3, pb: 2 }}>
          {/* Left area: team actions (update progress) */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            {/* If non-admin team member and request is in-progress, allow progress update */}
            {userType !== "USER" && userType !== "ADMIN" && requestDialog.request && requestDialog.request.status && requestDialog.request.status !== "PENDING" && requestDialog.request.status !== "REJECTED" && requestDialog.request.status !== "COMPLETED" && (
              <Button variant="contained" onClick={() => openProgressDialog(requestDialog.request.id, requestDialog.request.status)} startIcon={<LocalShippingIcon />}>
                Update Progress
              </Button>
            )}

            {/* Admin: admin notes input shown when reviewing */}
            {userType === "ADMIN" && requestDialog.request && requestDialog.request.status === "PENDING" && (
              <TextField
                size="small"
                placeholder="Add admin notes (optional)"
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                sx={{ minWidth: 320 }}
              />
            )}
          </Box>

          {/* Right area: Approve / Reject / Close */}
          <Box sx={{ display: "flex", gap: 1 }}>
            <Button onClick={closeRequestDialog}>Close</Button>

            {userType === "ADMIN" && requestDialog.request && requestDialog.request.status === "PENDING" && (
              <>
                <Button variant="contained" color="error" startIcon={<CancelIcon />} onClick={() => handleReviewRequest("REJECTED")} disabled={processing}>
                  {processing ? <CircularProgress size={18} color="inherit" /> : "Reject"}
                </Button>
                <Button variant="contained" color="success" startIcon={<CheckCircleIcon />} onClick={() => handleReviewRequest("APPROVED")} disabled={processing}>
                  {processing ? <CircularProgress size={18} color="inherit" /> : "Approve"}
                </Button>
              </>
            )}
          </Box>
        </DialogActions>
      </Dialog>

      {/* ---------------- Progress Update Dialog ---------------- */}
<Dialog open={progressDialog.open} onClose={closeProgressDialog} maxWidth="sm" fullWidth>
  <DialogTitle>Update Progress</DialogTitle>
  <DialogContent>
    <Typography variant="body2" sx={{ mb: 2 }}>
      Current Status: <strong>{progressDialog.currentStatus?.replace(/_/g, " ")}</strong>
    </Typography>
    
    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
      Your Role: <strong>{userType}</strong>
    </Typography>

    {getAvailableStatusOptions(userType, progressDialog.currentStatus).length === 0 ? (
      <Paper sx={{ p: 2, backgroundColor: "#fff3e0", border: "1px solid #ff9800" }}>
        <Typography variant="body2" color="warning.main">
          No status updates available for your role at this stage.
        </Typography>
      </Paper>
    ) : (
      <>
        <TextField
          select
          fullWidth
          value={progressStatus}
          onChange={(e) => setProgressStatus(e.target.value)}
          SelectProps={{ native: true }}
          sx={{ mb: 2 }}
        >
          <option value="">-- Select Status --</option>
          {getAvailableStatusOptions(userType, progressDialog.currentStatus).map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </TextField>
        
        <TextField 
          fullWidth 
          multiline 
          rows={3} 
          label="Message (optional)" 
          placeholder="Add a message for the customer..." 
          value={progressMessage} 
          onChange={(e) => setProgressMessage(e.target.value)} 
        />
      </>
    )}
  </DialogContent>
  <DialogActions>
    <Button onClick={closeProgressDialog}>Cancel</Button>
    <Button 
      variant="contained" 
      onClick={handleUpdateProgress} 
      disabled={
        processing || 
        !progressStatus || 
        getAvailableStatusOptions(userType, progressDialog.currentStatus).length === 0
      }
    >
      {processing ? <CircularProgress size={20} /> : "Update"}
    </Button>
  </DialogActions>
</Dialog>
    </Box>
  );
}