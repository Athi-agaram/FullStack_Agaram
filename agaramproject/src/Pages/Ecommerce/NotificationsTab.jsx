// PART 1: First 500 lines with responsive improvements
// Key changes for mobile responsiveness:
// - Added useMediaQuery hooks for breakpoint detection
// - Changed Grid layouts to Stack/Flex for mobile
// - Made dialogs fullScreen on mobile
// - Adjusted spacing and padding for smaller screens
// - Made tabs scrollable on mobile
// - Responsive font sizes and chip sizes
// - Better touch targets for mobile

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
  IconButton,
  Tabs,
  Tab,
  Badge,
  Collapse,
  useMediaQuery,
  useTheme,
  Stack,
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
  "IN_TRANSIT",
  "RECEIVED",
  "QUALITY_CHECK",
  "PASSED",
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
        return [{ value: "IN_TRANSIT_TO_WAREHOUSE", label: "In Transit" }];
      }
      return [];
    
    case "DISTRIBUTOR":
      if (normalized === "IN_TRANSIT_TO_WAREHOUSE") {
        return [{ value: "RECEIVED_AT_WAREHOUSE", label: "Received" }];
      }
      return [];
    
    case "WAREHOUSE":
      if (normalized === "RECEIVED_AT_WAREHOUSE") {
        return [
          { value: "QUALITY_CHECK_PASSED", label: "QC Passed" },
          { value: "QUALITY_CHECK_FAILED", label: "QC Failed" }
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
  // RESPONSIVE HOOKS - ADDED FOR MOBILE
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

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
  const [groupedNotifs, setGroupedNotifs] = useState([]);
  const [returnExchangeNotifs, setReturnExchangeNotifs] = useState([]);
  const [tabValue, setTabValue] = useState(0);
  const [messageBoxOpen, setMessageBoxOpen] = useState({});
  const [agentMessages, setAgentMessages] = useState({});
  const [sending, setSending] = useState({});

  const [requestDialog, setRequestDialog] = useState({
    open: false,
    request: null,
  });

  const [adminNotes, setAdminNotes] = useState("");
  const [processing, setProcessing] = useState(false);

  const [progressDialog, setProgressDialog] = useState({
    open: false,
    requestId: null,
    currentStatus: null,
  });
  const [progressStatus, setProgressStatus] = useState("");
  const [progressMessage, setProgressMessage] = useState("");

  useEffect(() => {
    fetchAll();
    const interval = setInterval(fetchAll, 30000);
    return () => clearInterval(interval);
  }, [username, userType]);

  const fetchAll = async () => {
    setLoading(true);
    await Promise.all([fetchNotifications(), fetchReturnExchangeNotifications()]);
    setLoading(false);
  };

  const fetchNotifications = async () => {
    try {
      const res = await getNotificationsApi(username);
      const allNotifs = res.data || [];

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

  const fetchReturnExchangeNotifications = async () => {
    try {
      let res;
      if (userType === "USER") {
        res = await getReturnExchangesByUserApi(storedUser.id);
      } else {
        res = await getAllReturnExchangesApi();
      }

      let requests = res.data || [];

      if (userType === "ADMIN") {
        requests = requests.filter((r) => r.status === "PENDING");
      } else if (userType === "COURIER") {
        requests = requests.filter((r) => r.status === "APPROVED");
      } else if (userType === "AGENT") {
        requests = requests.filter((r) => r.status === "PICKED_UP");
      } else if (userType === "DISTRIBUTOR") {
        requests = requests.filter((r) => r.status === "IN_TRANSIT_TO_WAREHOUSE");
      } else if (userType === "WAREHOUSE") {
        requests = requests.filter(
          (r) => r.status === "RECEIVED_AT_WAREHOUSE" || r.status === "QUALITY_CHECK_PASSED"
        );
      }

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

  const openRequestDialog = (request) => {
    setRequestDialog({ open: true, request });
    setAdminNotes("");
  };

  const closeRequestDialog = () => {
    setRequestDialog({ open: false, request: null });
    setAdminNotes("");
  };

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
        status: progressStatus,
        updatedBy: username,
        message: progressMessage.trim(),
      };

      console.log("Sending update:", updateData);

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

  const getReturnExchangeUnreadCount = () => {
    if (userType === "ADMIN") return returnExchangeNotifs.filter((r) => r.status === "PENDING").length;
    return returnExchangeNotifs.length;
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" py={10}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ px: isMobile ? 1 : 2 }}> 
      <Tabs
        value={tabValue}
        onChange={(e, v) => setTabValue(v)}
        variant={isMobile ? "scrollable" : "standard"} 
        scrollButtons={isMobile ? "auto" : false}
        sx={{ 
          mb: 2,
          backgroundColor: "#fff", 
          borderRadius: 2, 
          boxShadow: 1,
          position: "sticky", 
          top: isMobile ? 0 : 50, 
          zIndex: 10 
        }}
      >
        <Tab
          label={
            <Badge badgeContent={groupedNotifs.length} color="primary">
              <Box sx={{ display: "flex", alignItems: "center", gap: isMobile ? 0.5 : 1 }}>
                <NotificationsIcon sx={{ fontSize: isMobile ? 18 : 24 }} />
                {!isMobile && "Order Updates"} {/* RESPONSIVE: Hide text on mobile */}
              </Box>
            </Badge>
          }
        />
        <Tab
          label={
            <Badge badgeContent={getReturnExchangeUnreadCount()} color="error">
              <Box sx={{ display: "flex", alignItems: "center", gap: isMobile ? 0.5 : 1 }}>
                <AssignmentReturnIcon sx={{ fontSize: isMobile ? 18 : 24 }} />
                {!isMobile && "Return/Exchange"} {/* RESPONSIVE: Hide text on mobile */}
              </Box>
            </Badge>
          }
        />
      </Tabs>

      {/* ---------------- Order Notifications ---------------- */}
      {tabValue === 0 && (
        <Box>
          {groupedNotifs.length === 0 ? (
            <Paper sx={{ p: isMobile ? 2 : 4, textAlign: "center", backgroundColor: "#fff" }}>
              <NotificationsIcon sx={{ fontSize: isMobile ? 48 : 60, color: "#bdbdbd", mb: 2 }} />
              <Typography variant={isMobile ? "body1" : "h6"} color="text.secondary">
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
                    p: isMobile ? 2 : 3,
                    mb: isMobile ? 2 : 3,
                    borderRadius: isMobile ? 2 : 3,
                    boxShadow: 3,
                    border: "1px solid #e0e0e0",
                    background: "#fff",
                  }}
                >
                  {/* RESPONSIVE: Stack layout on mobile */}
                  <Box sx={{ 
                    display: "flex", 
                    flexDirection: isMobile ? "column" : "row",
                    justifyContent: "space-between", 
                    alignItems: isMobile ? "flex-start" : "flex-start", 
                    mb: 2,
                    gap: isMobile ? 1 : 0
                  }}>
                    <Box>
                      <Typography variant={isMobile ? "subtitle1" : "h6"} fontWeight={600} sx={{ mb: 0.5 }}>
                        Order #{orderId}
                        {og.customer_username && (
                          <span style={{ fontSize: isMobile ? "0.8em" : "0.9em", fontWeight: 400, marginLeft: 8 }}>
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

                    <Box sx={{ display: "flex", gap: 1, alignItems: "center", flexWrap: "wrap" }}>
                      <Chip
                        label={currentStatus}
                        size="small"
                        sx={{ 
                          backgroundColor: getStatusColor(currentStatus), 
                          color: "#fff", 
                          fontWeight: 600,
                          fontSize: isMobile ? "0.7rem" : "0.8125rem"
                        }}
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
                      <Box sx={{ p: isMobile ? 1.5 : 2, mb: 2, backgroundColor: "#f3e5f5", borderRadius: 2, border: "2px solid #9c27b0" }}>
                        <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1, color: "#7b1fa2", fontSize: isMobile ? "0.875rem" : "1rem" }}>
                          Send Message to Customer
                        </Typography>
                        <TextField
                          fullWidth
                          multiline
                          rows={isMobile ? 2 : 3}
                          placeholder="e.g., Your order is at Mumbai warehouse..."
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
                        <Box sx={{ 
                          display: "flex", 
                          flexDirection: isMobile ? "column" : "row",
                          justifyContent: "flex-end", 
                          gap: 1 
                        }}>
                          <Button 
                            variant="outlined" 
                            size="small" 
                            onClick={() => toggleMessageBox(orderId)} 
                            sx={{ color: "#9c27b0", borderColor: "#9c27b0" }}
                            fullWidth={isMobile}
                          >
                            Cancel
                          </Button>
                          <Button
                            variant="contained"
                            size="small"
                            startIcon={sending[orderId] ? <CircularProgress size={16} color="inherit" /> : <SendIcon />}
                            onClick={() => handleSendMessage(orderId, currentStatus)}
                            disabled={!agentMessages[orderId]?.trim() || sending[orderId]}
                            sx={{ backgroundColor: "#9c27b0", "&:hover": { backgroundColor: "#7b1fa2" } }}
                            fullWidth={isMobile}
                          >
                            {sending[orderId] ? "Sending..." : "Send Message"}
                          </Button>
                        </Box>
                      </Box>
                    </Collapse>
                  )}

                  <Divider sx={{ mb: isMobile ? 2 : 3 }} />

                  <Box sx={{ 
                    p: isMobile ? 2 : 3, 
                    backgroundColor: "#f5f5f5", 
                    borderRadius: 2, 
                    borderLeft: `6px solid ${getStatusColor(currentStatus)}`, 
                    position: "relative" 
                  }}>
                    <Box sx={{ 
                      display: "flex", 
                      flexDirection: isMobile ? "column" : "row",
                      justifyContent: "space-between", 
                      alignItems: isMobile ? "flex-start" : "flex-start", 
                      mb: 2,
                      gap: isMobile ? 1 : 0
                    }}>
                      <Box sx={{ display: "flex", gap: 1, alignItems: "center", flexWrap: "wrap" }}>
                        <Chip 
                          label={currentStatus} 
                          sx={{ 
                            backgroundColor: getStatusColor(currentStatus), 
                            color: "#fff", 
                            fontWeight: 600,
                            fontSize: isMobile ? "0.7rem" : "0.8125rem"
                          }} 
                        />
                        {userType !== "USER" && (
                          <Chip 
                            label={getDisplayUserType(senderType)} 
                            size="small" 
                            variant="outlined" 
                            sx={{ fontWeight: 600, fontSize: isMobile ? "0.65rem" : "0.75rem" }} 
                          />
                        )}
                      </Box>

                      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                        <AccessTimeIcon sx={{ fontSize: isMobile ? 14 : 16, color: "text.secondary" }} />
                        <Typography variant="caption" color="text.secondary" sx={{ fontSize: isMobile ? "0.65rem" : "0.75rem" }}>
                          {new Date(notif.created_at).toLocaleDateString()} {!isMobile && new Date(notif.created_at).toLocaleTimeString()}
                        </Typography>
                      </Box>
                    </Box>

                    <Typography variant={isMobile ? "body2" : "body1"} sx={{ mt: 1, lineHeight: 1.6 }}>
                      {notif.message}
                    </Typography>
                  </Box>
                </Paper>
              );
            })
          )}
        </Box>
      )}

      {/* ---------------- Return/Exchange Tab ---------------- */}
      {tabValue === 1 && (
        <Box>
          {returnExchangeNotifs.length === 0 ? (
            <Paper sx={{ p: isMobile ? 2 : 4, textAlign: "center", backgroundColor: "#fff" }}>
              <AssignmentReturnIcon sx={{ fontSize: isMobile ? 48 : 60, color: "#bdbdbd", mb: 2 }} />
              <Typography variant={isMobile ? "body1" : "h6"} color="text.secondary">
                No return/exchange notifications
              </Typography>
            </Paper>
          ) : (
            returnExchangeNotifs.map((request) => {
              const notif = request.latestNotification;
              const latestStatus = request.status;
              return (
                <Paper 
                  key={request.id} 
                  sx={{ 
                    p: isMobile ? 2 : 3, 
                    mb: isMobile ? 2 : 3, 
                    borderRadius: isMobile ? 2 : 3, 
                    boxShadow: 3, 
                    background: "#fff", 
                    border: "1px solid #e0e0e0" 
                  }}
                >
                  <Box sx={{ 
                    display: "flex", 
                    flexDirection: isMobile ? "column" : "row",
                    justifyContent: "space-between", 
                    alignItems: isMobile ? "flex-start" : "flex-start", 
                    mb: 2,
                    gap: isMobile ? 1.5 : 0
                  }}>
                    <Box sx={{ width: isMobile ? "100%" : "auto" }}>
                      <Typography variant={isMobile ? "subtitle1" : "h6"} fontWeight={600} sx={{ mb: 0.5 }}>
                        {request.type === "RETURN" ? (
                          <AssignmentReturnIcon sx={{ mr: 1, verticalAlign: "middle", fontSize: isMobile ? 18 : 24 }} />
                        ) : (
                          <SwapHorizIcon sx={{ mr: 1, verticalAlign: "middle", fontSize: isMobile ? 18 : 24 }} />
                        )}
                        {request.type} Request #{request.id}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ fontSize: isMobile ? "0.75rem" : "0.875rem" }}>
                        Order #{request.order_id} | Customer: {request.username}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ fontSize: isMobile ? "0.65rem" : "0.75rem" }}>
                        Created: {new Date(request.created_at).toLocaleDateString()}
                      </Typography>
                    </Box>

                    <Box sx={{ 
                      display: "flex", 
                      gap: 1, 
                      alignItems: "center",
                      width: isMobile ? "100%" : "auto"
                    }}>
                      <Chip 
                        label={request.status} 
                        size="small" 
                        sx={{ 
                          backgroundColor: getStatusColor(request.status), 
                          color: "#fff", 
                          fontWeight: 600,
                          fontSize: isMobile ? "0.7rem" : "0.8125rem",
                          flex: isMobile ? 1 : "none"
                        }} 
                      />
                      <Button 
                        variant="contained" 
                        size="small" 
                        onClick={() => openRequestDialog(request)}
                        sx={{ minWidth: isMobile ? "auto" : undefined }}
                      >
                        Open
                      </Button>
                    </Box>
                  </Box>

                  <Divider sx={{ mb: 2 }} />

                  {notif ? (
                    <Box sx={{ 
                      p: isMobile ? 1.5 : 2, 
                      backgroundColor: "#f5f5f5", 
                      borderRadius: 2, 
                      borderLeft: `6px solid ${getStatusColor(notif.status)}` 
                    }}>
                      <Box sx={{ 
                        display: "flex", 
                        flexDirection: isMobile ? "column" : "row",
                        justifyContent: "space-between", 
                        mb: 1,
                        gap: isMobile ? 1 : 0
                      }}>
                        <Chip 
                          label={notif.status?.replace(/_/g, " ")} 
                          size="small" 
                          sx={{ 
                            backgroundColor: getStatusColor(notif.status), 
                            color: "#fff", 
                            fontWeight: 600,
                            fontSize: isMobile ? "0.7rem" : "0.8125rem"
                          }} 
                        />
                        <Typography variant="caption" color="text.secondary" sx={{ fontSize: isMobile ? "0.65rem" : "0.75rem" }}>
                          {new Date(notif.created_at).toLocaleDateString()} {!isMobile && new Date(notif.created_at).toLocaleTimeString()}
                        </Typography>
                      </Box>
                      <Typography variant={isMobile ? "body2" : "body1"} sx={{ mt: 1 }}>
                        {notif.message}
                      </Typography>
                      {notif.sender_username && notif.sender_username !== "SYSTEM" && (
                        <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: "block", fontSize: isMobile ? "0.65rem" : "0.75rem" }}>
                          By: {notif.sender_username}
                        </Typography>
                      )}
                    </Box>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      No activity yet for this request.
                    </Typography>
                  )}
                </Paper>
              );
            })
          )}
        </Box>
      )}

      {/* ---------------- Request Detail Modal ---------------- */}
      <Dialog 
        open={Boolean(requestDialog.open)} 
        onClose={closeRequestDialog} 
        maxWidth="md" 
        fullWidth
        fullScreen={isMobile} // RESPONSIVE: Full screen on mobile
      >
        <DialogTitle sx={{ fontSize: isMobile ? "1.1rem" : "1.25rem" }}>
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
              <Box sx={{ 
                display: "flex", 
                flexDirection: isMobile ? "column" : "row",
                justifyContent: "space-between", 
                alignItems: isMobile ? "flex-start" : "flex-start", 
                mb: 2,
                gap: isMobile ? 1 : 0
              }}>
                <Box>
                  <Typography variant={isMobile ? "body2" : "subtitle1"}>
                    Order #{requestDialog.request.order_id} • Customer: {requestDialog.request.username}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ fontSize: isMobile ? "0.65rem" : "0.75rem" }}>
                    Created: {new Date(requestDialog.request.created_at).toLocaleString()}
                  </Typography>
                </Box>
                <Chip 
                  label={requestDialog.request.status} 
                  sx={{ 
                    backgroundColor: getStatusColor(requestDialog.request.status), 
                    color: "#fff", 
                    fontWeight: 600,
                    fontSize: isMobile ? "0.7rem" : "0.8125rem"
                  }} 
                />
              </Box>

              <Divider sx={{ my: 2 }} />

              {/* Items */}
              <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1, fontSize: isMobile ? "0.875rem" : "1rem" }}>
                Items
              </Typography>
              <Grid container spacing={isMobile ? 1 : 2} sx={{ mb: 2 }}>
                {(requestDialog.request.items || []).map((it, i) => (
                  <Grid item xs={12} sm={6} md={4} key={i}>
                    <Paper sx={{ p: isMobile ? 1.5 : 2 }}>
                      <Typography fontWeight={600} sx={{ fontSize: isMobile ? "0.875rem" : "1rem" }}>
                        {it.product_name || it.productName || it.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ fontSize: isMobile ? "0.75rem" : "0.875rem" }}>
                        Qty: {it.qty} | {formatCurrency(it.price)}
                      </Typography>
                      {it.exchange_product_name && (
                        <Chip 
                          label={`Exchange: ${it.exchange_product_name}`} 
                          size="small" 
                          sx={{ mt: 1, fontSize: isMobile ? "0.65rem" : "0.75rem" }} 
                        />
                      )}
                    </Paper>
                  </Grid>
                ))}
              </Grid>

              {/* Reason */}
              <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1, fontSize: isMobile ? "0.875rem" : "1rem" }}>
                Reason
              </Typography>
              <Paper sx={{ p: isMobile ? 1.5 : 2, mb: 2, backgroundColor: "#f9f9f9" }}>
                <Typography sx={{ fontSize: isMobile ? "0.875rem" : "1rem" }}>
                  {requestDialog.request.reason}
                </Typography>
              </Paper>

              {/* Images */}
              {requestDialog.request.images && requestDialog.request.images.length > 0 && (
                <>
                  <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1, fontSize: isMobile ? "0.875rem" : "1rem" }}>
                    Uploaded Images
                  </Typography>
                  <Grid container spacing={isMobile ? 1 : 2} sx={{ mb: 2 }}>
                    {requestDialog.request.images.map((img, idx) => (
                      <Grid item xs={6} sm={4} md={3} key={idx}>
                        <Card>
                          <CardMedia 
                            component="img" 
                            height={isMobile ? "100" : "150"} 
                            image={img.image_data || img} 
                            alt={`img-${idx}`} 
                            sx={{ objectFit: "contain" }} 
                          />
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                </>
              )}

              {/* Progress / Timeline */}
              <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1, fontSize: isMobile ? "0.875rem" : "1rem" }}>
                Progress
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Stepper 
                  activeStep={getStepIndex(requestDialog.request.status)} 
                  alternativeLabel={!isMobile}
                  orientation={isMobile ? "vertical" : "horizontal"} // RESPONSIVE: Vertical on mobile
                >
                  {RETURN_EXCHANGE_STEPS.map((s) => (
                    <Step key={s}>
                      <StepLabel sx={{ 
                        "& .MuiStepLabel-label": { 
                          fontSize: isMobile ? "0.7rem" : "0.875rem" 
                        } 
                      }}>
                        {s.replace(/_/g, " ")}
                      </StepLabel>
                    </Step>
                  ))}
                </Stepper>
              </Box>

              {/* Activity timeline */}
              {requestDialog.request.notifications && requestDialog.request.notifications.length > 0 && (
                <>
                  <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1, fontSize: isMobile ? "0.875rem" : "1rem" }}>
                    Activity Timeline
                  </Typography>
                  <Box sx={{ mb: 2 }}>
                    {requestDialog.request.notifications.map((n, i) => (
                      <Paper 
                        key={i} 
                        sx={{ 
                          p: isMobile ? 1.5 : 2, 
                          mb: 1, 
                          borderLeft: `4px solid ${getStatusColor(n.status)}` 
                        }}
                      >
                        <Box sx={{ 
                          display: "flex", 
                          flexDirection: isMobile ? "column" : "row",
                          justifyContent: "space-between", 
                          mb: 1,
                          gap: isMobile ? 0.5 : 0
                        }}>
                          <Chip 
                            label={n.status?.replace(/_/g, " ")} 
                            size="small" 
                            sx={{ 
                              backgroundColor: getStatusColor(n.status), 
                              color: "#fff",
                              fontSize: isMobile ? "0.65rem" : "0.75rem"
                            }} 
                          />
                          <Typography variant="caption" color="text.secondary" sx={{ fontSize: isMobile ? "0.65rem" : "0.75rem" }}>
                            {new Date(n.created_at).toLocaleString()}
                          </Typography>
                        </Box>
                        <Typography variant="body2" sx={{ fontSize: isMobile ? "0.8rem" : "0.875rem" }}>
                          {n.message}
                        </Typography>
                        {n.sender_username && n.sender_username !== "SYSTEM" && (
                          <Typography variant="caption" color="text.secondary" sx={{ fontSize: isMobile ? "0.65rem" : "0.75rem" }}>
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
                <Paper sx={{ p: isMobile ? 1.5 : 2, mb: 2, backgroundColor: "#fff3e0", border: "1px solid #ff9800" }}>
                  <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1, fontSize: isMobile ? "0.875rem" : "1rem" }}>
                    Admin Notes
                  </Typography>
                  <Typography sx={{ fontSize: isMobile ? "0.8rem" : "0.875rem" }}>
                    {requestDialog.request.admin_notes}
                  </Typography>
                </Paper>
              )}
            </>
          )}
        </DialogContent>

        <DialogActions sx={{ 
          display: "flex", 
          flexDirection: isMobile ? "column" : "row", // RESPONSIVE: Stack on mobile
          justifyContent: "space-between", 
          px: isMobile ? 2 : 3, 
          pb: 2,
          gap: isMobile ? 1 : 0
        }}>
          {/* Left area: team actions */}
          <Box sx={{ 
            display: "flex", 
            flexDirection: isMobile ? "column" : "row",
            alignItems: "center", 
            gap: 1,
            width: isMobile ? "auto" : "auto",
           height:isMobile ? "40px" : "40px"

          }}>
            {userType !== "USER" && userType !== "ADMIN" && requestDialog.request && requestDialog.request.status && requestDialog.request.status !== "PENDING" && requestDialog.request.status !== "REJECTED" && requestDialog.request.status !== "COMPLETED" && (
              <Button 
                variant="contained" 

                onClick={() => openProgressDialog(requestDialog.request.id, requestDialog.request.status)} 
                startIcon={<LocalShippingIcon />}
                fullWidth={isMobile}

                size={isMobile ? "medium" : "medium"}
              >
                Update Progress
              </Button>
            )}

            {userType === "ADMIN" && requestDialog.request && requestDialog.request.status === "PENDING" && (
              <TextField
                size="small"
                placeholder="Add admin notes (optional)"
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                sx={{ minWidth: isMobile ? "100%" : 320 }}
                fullWidth={isMobile}
              />
            )}
          </Box>

          {/* Right area: Approve / Reject / Close */}
          <Box sx={{ 
            display: "flex", 
            flexDirection: isMobile ? "column" : "row",
            gap: 1,
            width: isMobile ? "100%" : "auto",
            height:isMobile ? "90px" : "40px",
            mt:0
          }}>
            <Button 
              onClick={closeRequestDialog}
              fullWidth={isMobile}
            >
              Close
            </Button>

            {userType === "ADMIN" && requestDialog.request && requestDialog.request.status === "PENDING" && (
              <>
                <Button 
                  variant="contained" 
                  color="error" 
                  startIcon={<CancelIcon />} 
                  onClick={() => handleReviewRequest("REJECTED")} 
                  disabled={processing}
                  fullWidth={isMobile}
                >
                  {processing ? <CircularProgress size={18} color="inherit" /> : "Reject"}
                </Button>
                <Button 
                  variant="contained" 
                  color="success" 
                  startIcon={<CheckCircleIcon />} 
                  onClick={() => handleReviewRequest("APPROVED")} 
                  disabled={processing}
                  fullWidth={isMobile}
                >
                  {processing ? <CircularProgress size={18} color="inherit" /> : "Approve"}
                </Button>
              </>
            )}
          </Box>
        </DialogActions>
      </Dialog>

      {/* ---------------- Progress Update Dialog ---------------- */}
      <Dialog 
        open={progressDialog.open} 
        onClose={closeProgressDialog} 
        maxWidth="sm" 
        fullWidth
        fullScreen={isMobile} // RESPONSIVE: Full screen on mobile
        sx={{flexDirection: isMobile ? "column" : "row"}}

      >
        <DialogTitle sx={{ fontSize: isMobile ? "1.1rem" : "1.25rem" }}>
          Update Progress
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 2, fontSize: isMobile ? "0.875rem" : "1rem" }}>
            Current Status: <strong>{progressDialog.currentStatus?.replace(/_/g, " ")}</strong>
          </Typography>
          
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2, fontSize: isMobile ? "0.875rem" : "1rem" }}>
            Your Role: <strong>{userType}</strong>
          </Typography>

          {getAvailableStatusOptions(userType, progressDialog.currentStatus).length === 0 ? (
            <Paper sx={{ p: isMobile ? 1.5 : 2, backgroundColor: "#fff3e0", border: "1px solid #ff9800" }}>
              <Typography variant="body2" color="warning.main" sx={{ fontSize: isMobile ? "0.875rem" : "1rem" }}>
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
                size={isMobile ? "medium" : "medium"}
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
                rows={isMobile ? 2 : 3}
                label="Message (optional)" 
                placeholder="Add a message for the customer..." 
                value={progressMessage} 
                onChange={(e) => setProgressMessage(e.target.value)}
                size={isMobile ? "medium" : "medium"}
              />
            </>
          )}
        </DialogContent>
        <DialogActions sx={{ 
          flexDirection: isMobile ? "column" : "row",
          gap: isMobile ? 1 : 0,
          p: isMobile ? 10 : undefined
        }}>
          <Button 
            onClick={closeProgressDialog}
            fullWidth={isMobile}
          >
            Cancel
          </Button>
          <Button 
            variant="contained" 
            onClick={handleUpdateProgress} 
            disabled={
              processing || 
              !progressStatus || 
              getAvailableStatusOptions(userType, progressDialog.currentStatus).length === 0
            }
            fullWidth={isMobile}
          >
            {processing ? <CircularProgress size={20} /> : "Update"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}



// PART 1: First 500 lines with responsive improvements
// Key changes for mobile responsiveness:
// - Added useMediaQuery hooks for breakpoint detection
// - Changed Grid layouts to Stack/Flex for mobile
// - Made dialogs fullScreen on mobile
// - Adjusted spacing and padding for smaller screens
// - Made tabs scrollable on mobile
// - Responsive font sizes and chip sizes
// - Better touch targets for mobile

// import React, { useEffect, useState } from "react";
// import {
//   Box,
//   Paper,
//   Typography,
//   Button,
//   CircularProgress,
//   Chip,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   TextField,
//   Divider,
//   Grid,
//   Card,
//   CardMedia,
//   Stepper,
//   Step,
//   StepLabel,
//   IconButton,
//   Tabs,
//   Tab,
//   Badge,
//   Collapse,
//   useMediaQuery,
//   useTheme,
//   Stack,
// } from "@mui/material";

// import NotificationsIcon from "@mui/icons-material/Notifications";
// import SendIcon from "@mui/icons-material/Send";
// import MessageIcon from "@mui/icons-material/Message";
// import ExpandLessIcon from "@mui/icons-material/ExpandLess";
// import AccessTimeIcon from "@mui/icons-material/AccessTime";
// import AssignmentReturnIcon from "@mui/icons-material/AssignmentReturn";
// import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
// import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
// import CheckCircleIcon from "@mui/icons-material/CheckCircle";
// import CancelIcon from "@mui/icons-material/Cancel";
// import LocalShippingIcon from "@mui/icons-material/LocalShipping";

// import {
//   getNotificationsApi,
//   sendNotificationApi,
//   getAllReturnExchangesApi,
//   getReturnExchangesByUserApi,
//   reviewReturnExchangeApi,
//   updateReturnExchangeProgressApi,
// } from "../../api/api";


// const RETURN_EXCHANGE_STEPS = [
//   "PENDING",
//   "APPROVED",
//   "PICKED_UP",
//   "IN_TRANSIT",
//   "RECEIVED",
//   "QUALITY_CHECK",
//   "PASSED",
//   "PROCESSING",
//   "COMPLETED",
// ];

// const getUserType = (username) => {
//   const lower = username?.toLowerCase?.();
//   if (!lower) return "USER";
//   if (lower === "admin" || lower === "administrator") return "ADMIN";
//   if (lower === "warehouse") return "WAREHOUSE";
//   if (lower === "distributor") return "DISTRIBUTOR";
//   if (lower === "agent") return "AGENT";
//   if (lower === "courier") return "COURIER";
//   return "USER";
// };

// const getAvailableStatusOptions = (userType, currentStatus) => {
//   if (!currentStatus) return [];
  
//   const normalized = currentStatus.toUpperCase();
  
//   switch (userType) {
//     case "COURIER":
//       if (normalized === "APPROVED") {
//         return [{ value: "PICKED_UP", label: "Picked Up" }];
//       }
//       return [];
    
//     case "AGENT":
//       if (normalized === "PICKED_UP") {
//         return [{ value: "IN_TRANSIT_TO_WAREHOUSE", label: "In Transit" }];
//       }
//       return [];
    
//     case "DISTRIBUTOR":
//       if (normalized === "IN_TRANSIT_TO_WAREHOUSE") {
//         return [{ value: "RECEIVED_AT_WAREHOUSE", label: "Received" }];
//       }
//       return [];
    
//     case "WAREHOUSE":
//       if (normalized === "RECEIVED_AT_WAREHOUSE") {
//         return [
//           { value: "QUALITY_CHECK_PASSED", label: "QC Passed" },
//           { value: "QUALITY_CHECK_FAILED", label: "QC Failed" }
//         ];
//       }
//       if (normalized === "QUALITY_CHECK_PASSED") {
//         return [{ value: "COMPLETED", label: "Completed" }];
//       }
//       return [];
    
//     default:
//       return [];
//   }
// };

// export default function NotificationsTab({ username: propUsername, userType: propUserType }) {
//   // RESPONSIVE HOOKS - ADDED FOR MOBILE
//   const theme = useTheme();
//   const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
//   const isTablet = useMediaQuery(theme.breakpoints.down('md'));

//   const getUserFromStorage = () => {
//     try {
//       const u = localStorage.getItem("user");
//       return u ? JSON.parse(u) : null;
//     } catch {
//       return null;
//     }
//   };
  
//   const storedUser = getUserFromStorage();
//   const username = propUsername ?? storedUser?.username ?? "";
//   const userType = propUserType ?? getUserType(username);

//   const [loading, setLoading] = useState(true);
//   const [groupedNotifs, setGroupedNotifs] = useState([]);
//   const [returnExchangeNotifs, setReturnExchangeNotifs] = useState([]);
//   const [tabValue, setTabValue] = useState(0);
//   const [messageBoxOpen, setMessageBoxOpen] = useState({});
//   const [agentMessages, setAgentMessages] = useState({});
//   const [sending, setSending] = useState({});

//   const [requestDialog, setRequestDialog] = useState({
//     open: false,
//     request: null,
//   });

//   const [adminNotes, setAdminNotes] = useState("");
//   const [processing, setProcessing] = useState(false);

//   const [progressDialog, setProgressDialog] = useState({
//     open: false,
//     requestId: null,
//     currentStatus: null,
//   });
//   const [progressStatus, setProgressStatus] = useState("");
//   const [progressMessage, setProgressMessage] = useState("");

//   useEffect(() => {
//     fetchAll();
//     const interval = setInterval(fetchAll, 30000);
//     return () => clearInterval(interval);
//   }, [username, userType]);

//   const fetchAll = async () => {
//     setLoading(true);
//     await Promise.all([fetchNotifications(), fetchReturnExchangeNotifications()]);
//     setLoading(false);
//   };

//   const fetchNotifications = async () => {
//     try {
//       const res = await getNotificationsApi(username);
//       const allNotifs = res.data || [];

//       const grouped = {};
//       allNotifs.forEach((notif) => {
//         const orderId = notif.order_id;
//         if (!orderId) return;
//         if (!grouped[orderId]) {
//           grouped[orderId] = {
//             order_id: orderId,
//             customer_username: notif.customer_username,
//             item_count: notif.item_count,
//             latestNotification: notif,
//             relevantStatus: notif.status,
//           };
//         } else {
//           const cur = new Date(grouped[orderId].latestNotification.created_at || 0);
//           const n = new Date(notif.created_at || 0);
//           if (n > cur) {
//             grouped[orderId].latestNotification = notif;
//             grouped[orderId].relevantStatus = notif.status;
//           }
//         }
//       });

//       const arr = Object.values(grouped).sort((a, b) => {
//         const A = new Date(a.latestNotification.created_at || 0);
//         const B = new Date(b.latestNotification.created_at || 0);
//         return B - A;
//       });

//       setGroupedNotifs(arr);
//     } catch (err) {
//       console.error("fetchNotifications error:", err);
//       setGroupedNotifs([]);
//     }
//   };

//   const toggleMessageBox = (orderId) => {
//     setMessageBoxOpen((p) => ({ ...p, [orderId]: !p[orderId] }));
//   };

//   const handleMessageChange = (orderId, message) => {
//     setAgentMessages((p) => ({ ...p, [orderId]: message }));
//   };

//   const handleSendMessage = async (orderId, currentStatus) => {
//     const message = (agentMessages[orderId] || "").trim();
//     if (!message) {
//       alert("Please enter a message");
//       return;
//     }
//     try {
//       setSending((p) => ({ ...p, [orderId]: true }));
//       await sendNotificationApi({
//         orderId,
//         username,
//         message,
//         status: currentStatus,
//       });
//       setAgentMessages((p) => ({ ...p, [orderId]: "" }));
//       setMessageBoxOpen((p) => ({ ...p, [orderId]: false }));
//       await fetchNotifications();
//       alert("Message sent successfully!");
//     } catch (err) {
//       console.error("sendNotificationApi error:", err);
//       alert("Failed to send message");
//     } finally {
//       setSending((p) => ({ ...p, [orderId]: false }));
//     }
//   };

//   const fetchReturnExchangeNotifications = async () => {
//     try {
//       let res;
//       if (userType === "USER") {
//         res = await getReturnExchangesByUserApi(storedUser.id);
//       } else {
//         res = await getAllReturnExchangesApi();
//       }

//       let requests = res.data || [];

//       if (userType === "ADMIN") {
//         requests = requests.filter((r) => r.status === "PENDING");
//       } else if (userType === "COURIER") {
//         requests = requests.filter((r) => r.status === "APPROVED");
//       } else if (userType === "AGENT") {
//         requests = requests.filter((r) => r.status === "PICKED_UP");
//       } else if (userType === "DISTRIBUTOR") {
//         requests = requests.filter((r) => r.status === "IN_TRANSIT_TO_WAREHOUSE");
//       } else if (userType === "WAREHOUSE") {
//         requests = requests.filter(
//           (r) => r.status === "RECEIVED_AT_WAREHOUSE" || r.status === "QUALITY_CHECK_PASSED"
//         );
//       }

//       const withLatest = requests
//         .map((r) => {
//           const notifs = r.notifications || [];
//           const latest = notifs.length > 0 ? notifs[notifs.length - 1] : null;
//           return { ...r, latestNotification: latest };
//         })
//         .sort((a, b) => {
//           const aDate = a.latestNotification ? new Date(a.latestNotification.created_at) : new Date(a.created_at);
//           const bDate = b.latestNotification ? new Date(b.latestNotification.created_at) : new Date(b.created_at);
//           return bDate - aDate;
//         });

//       setReturnExchangeNotifs(withLatest);
//     } catch (err) {
//       console.error("fetchReturnExchangeNotifications error:", err);
//       setReturnExchangeNotifs([]);
//     }
//   };

//   const openRequestDialog = (request) => {
//     setRequestDialog({ open: true, request });
//     setAdminNotes("");
//   };

//   const closeRequestDialog = () => {
//     setRequestDialog({ open: false, request: null });
//     setAdminNotes("");
//   };

//   const handleReviewRequest = async (action) => {
//     if (!requestDialog.request) {
//       alert("No request selected");
//       return;
//     }
    
//     const id = requestDialog.request.id;
    
//     // Add confirmation
//     const confirmMsg = action === "APPROVED" 
//       ? "Are you sure you want to approve this request?" 
//       : "Are you sure you want to reject this request?";
    
//     if (!window.confirm(confirmMsg)) {
//       return;
//     }
    
//     try {
//       setProcessing(true);
      
//       const reviewData = {
//         status: action,
//         reviewedBy: username,
//         adminNotes: adminNotes.trim() || undefined,
//       };
      
//       console.log("Sending review:", reviewData); // Debug log
      
//       const res = await reviewReturnExchangeApi(id, reviewData);
      
//       console.log("Review response:", res); // Debug log
      
//       if (res.data?.success || res.status === 200) {
//         alert(`Request ${action.toLowerCase()} successfully!`);
//         closeRequestDialog();
//         await fetchReturnExchangeNotifications();
//       } else {
//         alert("Failed to submit review: " + (res.data?.message || "unknown error"));
//       }
//     } catch (err) {
//       console.error("reviewReturnExchangeApi error:", err);
//       const errorMsg = err?.response?.data?.message || err?.message || "Unknown error occurred";
//       alert("Failed to review request: " + errorMsg);
//     } finally {
//       setProcessing(false);
//     }
//   };

//   const openProgressDialog = (requestId, currentStatus) => {
//     setProgressDialog({ open: true, requestId, currentStatus });
//     setProgressStatus("");
//     setProgressMessage("");
//   };

//   const closeProgressDialog = () => {
//     setProgressDialog({ open: false, requestId: null, currentStatus: null });
//     setProgressStatus("");
//     setProgressMessage("");
//   };

//   const handleUpdateProgress = async () => {
//     if (!progressDialog.requestId || !progressStatus) {
//       alert("Please select a status");
//       return;
//     }

//     try {
//       setProcessing(true);
//       const updateData = {
//         status: progressStatus,
//         updatedBy: username,
//         message: progressMessage.trim(),
//       };

//       console.log("Sending update:", updateData);

//       const res = await updateReturnExchangeProgressApi(progressDialog.requestId, updateData);
//       if (res.data?.success) {
//         alert("Progress updated");
//         closeProgressDialog();
//         fetchReturnExchangeNotifications();
//       } else {
//         alert("Failed to update progress: " + (res.data?.message || "unknown"));
//       }
//     } catch (err) {
//       console.error("updateReturnExchangeProgressApi error:", err);
//       alert("Failed to update progress: " + (err?.response?.data?.message || err.message));
//     } finally {
//       setProcessing(false);
//     }
//   };

//   const getStatusColor = (status) => {
//     const colors = {
//       PLACED: "#2196f3",
//       PROCESSING: "#ff9800",
//       SHIPPED: "#9c27b0",
//       OUT_FOR_DELIVERY: "#ff5722",
//       DELIVERED: "#4caf50",
//       PENDING: "#ff9800",
//       APPROVED: "#4caf50",
//       REJECTED: "#f44336",
//       PICKED_UP: "#2196f3",
//       IN_TRANSIT_TO_WAREHOUSE: "#2196f3",
//       RECEIVED_AT_WAREHOUSE: "#9c27b0",
//       QUALITY_CHECK_IN_PROGRESS: "#ff9800",
//       QUALITY_CHECK_PASSED: "#4caf50",
//       COMPLETED: "#4caf50",
//     };
//     return colors[status?.toUpperCase?.()] || "#757575";
//   };

//   const getDisplayUserType = (type) => {
//     const types = {
//       ADMIN: "Admin",
//       WAREHOUSE: "Warehouse",
//       DISTRIBUTOR: "Distributor",
//       AGENT: "Agent",
//       COURIER: "Courier",
//       USER: "Customer",
//       SYSTEM: "System",
//     };
//     return types[type] || type;
//   };

//   const formatCurrency = (amt) =>
//     new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(amt || 0);

//   const getStepIndex = (status) => {
//     const idx = RETURN_EXCHANGE_STEPS.indexOf(status?.toUpperCase?.());
//     return idx === -1 ? 0 : idx;
//   };

//   const getReturnExchangeUnreadCount = () => {
//     if (userType === "ADMIN") return returnExchangeNotifs.filter((r) => r.status === "PENDING").length;
//     return returnExchangeNotifs.length;
//   };

//   if (loading) {
//     return (
//       <Box display="flex" justifyContent="center" alignItems="center" py={10}>
//         <CircularProgress />
//       </Box>
//     );
//   }

//   return (
//     <Box sx={{ px: isMobile ? 1 : 2 }}> {/* RESPONSIVE: Reduced padding on mobile */}
//       <Tabs
//         value={tabValue}
//         onChange={(e, v) => setTabValue(v)}
//         variant={isMobile ? "scrollable" : "standard"}
//         scrollButtons={isMobile ? "auto" : false}
//         sx={{ 
//           mb: 2,
//           backgroundColor: "#fff", 
//           borderRadius: 2, 
//           boxShadow: 1,
//           position: "sticky", 
//           top: isMobile ? 0 : 50, 
//           zIndex: 10 
//         }}
//       >
//         <Tab
//           label={
//             <Badge badgeContent={groupedNotifs.length} color="primary">
//               <Box sx={{ display: "flex", alignItems: "center", gap: isMobile ? 0.5 : 1 }}>
//                 <NotificationsIcon sx={{ fontSize: isMobile ? 18 : 24 }} />
//                 {!isMobile && "Order Updates"} {/* RESPONSIVE: Hide text on mobile */}
//               </Box>
//             </Badge>
//           }
//         />
//         <Tab
//           label={
//             <Badge badgeContent={getReturnExchangeUnreadCount()} color="error">
//               <Box sx={{ display: "flex", alignItems: "center", gap: isMobile ? 0.5 : 1 }}>
//                 <AssignmentReturnIcon sx={{ fontSize: isMobile ? 18 : 24 }} />
//                 {!isMobile && "Return/Exchange"} {/* RESPONSIVE: Hide text on mobile */}
//               </Box>
//             </Badge>
//           }
//         />
//       </Tabs>

//       {/* ---------------- Order Notifications ---------------- */}
//       {tabValue === 0 && (
//         <Box>
//           {groupedNotifs.length === 0 ? (
//             <Paper sx={{ p: isMobile ? 2 : 4, textAlign: "center", backgroundColor: "#fff" }}>
//               <NotificationsIcon sx={{ fontSize: isMobile ? 48 : 60, color: "#bdbdbd", mb: 2 }} />
//               <Typography variant={isMobile ? "body1" : "h6"} color="text.secondary">
//                 No order notifications yet
//               </Typography>
//               <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
//                 {userType === "USER" ? "You'll see your order updates here" : "You'll see relevant order updates here"}
//               </Typography>
//             </Paper>
//           ) : (
//             groupedNotifs.map((og) => {
//               const notif = og.latestNotification;
//               const currentStatus = notif.status || notif.order_status || "UNKNOWN";
//               const itemCount = og.item_count || 0;
//               const orderId = og.order_id;
//               const isBoxOpen = !!messageBoxOpen[orderId];
//               const senderType = getUserType(notif.sender_username);

//               return (
//                 <Paper
//                   key={orderId}
//                   sx={{
//                     p: isMobile ? 2 : 3,
//                     mb: isMobile ? 2 : 3,
//                     borderRadius: isMobile ? 2 : 3,
//                     boxShadow: 3,
//                     border: "1px solid #e0e0e0",
//                     background: "#fff",
//                   }}
//                 >
//                   {/* RESPONSIVE: Stack layout on mobile */}
//                   <Box sx={{ 
//                     display: "flex", 
//                     flexDirection: isMobile ? "column" : "row",
//                     justifyContent: "space-between", 
//                     alignItems: isMobile ? "flex-start" : "flex-start", 
//                     mb: 2,
//                     gap: isMobile ? 1 : 0
//                   }}>
//                     <Box>
//                       <Typography variant={isMobile ? "subtitle1" : "h6"} fontWeight={600} sx={{ mb: 0.5 }}>
//                         Order #{orderId}
//                         {og.customer_username && (
//                           <span style={{ fontSize: isMobile ? "0.8em" : "0.9em", fontWeight: 400, marginLeft: 8 }}>
//                             by {og.customer_username}
//                           </span>
//                         )}
//                       </Typography>
//                       {itemCount > 0 && (
//                         <Typography variant="caption" color="text.secondary">
//                           {itemCount} item{itemCount !== 1 ? "s" : ""} in this order
//                         </Typography>
//                       )}
//                     </Box>

//                     <Box sx={{ display: "flex", gap: 1, alignItems: "center", flexWrap: "wrap" }}>
//                       <Chip
//                         label={currentStatus}
//                         size="small"
//                         sx={{ 
//                           backgroundColor: getStatusColor(currentStatus), 
//                           color: "#fff", 
//                           fontWeight: 600,
//                           fontSize: isMobile ? "0.7rem" : "0.8125rem"
//                         }}
//                       />
//                       {userType === "AGENT" && (
//                         <IconButton
//                           size="small"
//                           onClick={() => toggleMessageBox(orderId)}
//                           sx={{
//                             backgroundColor: isBoxOpen ? "#9c27b0" : "#f5f5f5",
//                             color: isBoxOpen ? "#fff" : "#9c27b0",
//                             "&:hover": { backgroundColor: isBoxOpen ? "#7b1fa2" : "#e0e0e0" },
//                           }}
//                         >
//                           {isBoxOpen ? <ExpandLessIcon /> : <MessageIcon />}
//                         </IconButton>
//                       )}
//                     </Box>
//                   </Box>

//                   {/* Agent message box */}
//                   {userType === "AGENT" && (
//                     <Collapse in={isBoxOpen}>
//                       <Box sx={{ p: isMobile ? 1.5 : 2, mb: 2, backgroundColor: "#f3e5f5", borderRadius: 2, border: "2px solid #9c27b0" }}>
//                         <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1, color: "#7b1fa2", fontSize: isMobile ? "0.875rem" : "1rem" }}>
//                           Send Message to Customer
//                         </Typography>
//                         <TextField
//                           fullWidth
//                           multiline
//                           rows={isMobile ? 2 : 3}
//                           placeholder="e.g., Your order is at Mumbai warehouse..."
//                           value={agentMessages[orderId] || ""}
//                           onChange={(e) => handleMessageChange(orderId, e.target.value)}
//                           sx={{
//                             mb: 1,
//                             backgroundColor: "#fff",
//                             "& .MuiOutlinedInput-root": {
//                               "&:hover fieldset": { borderColor: "#9c27b0" },
//                               "&.Mui-focused fieldset": { borderColor: "#9c27b0" },
//                             },
//                           }}
//                         />
//                         <Box sx={{ 
//                           display: "flex", 
//                           flexDirection: isMobile ? "column" : "row",
//                           justifyContent: "flex-end", 
//                           gap: 1 
//                         }}>
//                           <Button 
//                             variant="outlined" 
//                             size="small" 
//                             onClick={() => toggleMessageBox(orderId)} 
//                             sx={{ color: "#9c27b0", borderColor: "#9c27b0" }}
//                             fullWidth={isMobile}
//                           >
//                             Cancel
//                           </Button>
//                           <Button
//                             variant="contained"
//                             size="small"
//                             startIcon={sending[orderId] ? <CircularProgress size={16} color="inherit" /> : <SendIcon />}
//                             onClick={() => handleSendMessage(orderId, currentStatus)}
//                             disabled={!agentMessages[orderId]?.trim() || sending[orderId]}
//                             sx={{ backgroundColor: "#9c27b0", "&:hover": { backgroundColor: "#7b1fa2" } }}
//                             fullWidth={isMobile}
//                           >
//                             {sending[orderId] ? "Sending..." : "Send Message"}
//                           </Button>
//                         </Box>
//                       </Box>
//                     </Collapse>
//                   )}

//                   <Divider sx={{ mb: isMobile ? 2 : 3 }} />

//                   <Box sx={{ 
//                     p: isMobile ? 2 : 3, 
//                     backgroundColor: "#f5f5f5", 
//                     borderRadius: 2, 
//                     borderLeft: `6px solid ${getStatusColor(currentStatus)}`, 
//                     position: "relative" 
//                   }}>
//                     <Box sx={{ 
//                       display: "flex", 
//                       flexDirection: isMobile ? "column" : "row",
//                       justifyContent: "space-between", 
//                       alignItems: isMobile ? "flex-start" : "flex-start", 
//                       mb: 2,
//                       gap: isMobile ? 1 : 0
//                     }}>
//                       <Box sx={{ display: "flex", gap: 1, alignItems: "center", flexWrap: "wrap" }}>
//                         <Chip 
//                           label={currentStatus} 
//                           sx={{ 
//                             backgroundColor: getStatusColor(currentStatus), 
//                             color: "#fff", 
//                             fontWeight: 600,
//                             fontSize: isMobile ? "0.7rem" : "0.8125rem"
//                           }} 
//                         />
//                         {userType !== "USER" && (
//                           <Chip 
//                             label={getDisplayUserType(senderType)} 
//                             size="small" 
//                             variant="outlined" 
//                             sx={{ fontWeight: 600, fontSize: isMobile ? "0.65rem" : "0.75rem" }} 
//                           />
//                         )}
//                       </Box>

//                       <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
//                         <AccessTimeIcon sx={{ fontSize: isMobile ? 14 : 16, color: "text.secondary" }} />
//                         <Typography variant="caption" color="text.secondary" sx={{ fontSize: isMobile ? "0.65rem" : "0.75rem" }}>
//                           {new Date(notif.created_at).toLocaleDateString()} {!isMobile && new Date(notif.created_at).toLocaleTimeString()}
//                         </Typography>
//                       </Box>
//                     </Box>

//                     <Typography variant={isMobile ? "body2" : "body1"} sx={{ mt: 1, lineHeight: 1.6 }}>
//                       {notif.message}
//                     </Typography>
//                   </Box>
//                 </Paper>
//               );
//             })
//           )}
//         </Box>
//       )}

//       {/* ---------------- Return/Exchange Tab ---------------- */}
//       {tabValue === 1 && (
//         <Box>
//           {returnExchangeNotifs.length === 0 ? (
//             <Paper sx={{ p: isMobile ? 2 : 4, textAlign: "center", backgroundColor: "#fff" }}>
//               <AssignmentReturnIcon sx={{ fontSize: isMobile ? 48 : 60, color: "#bdbdbd", mb: 2 }} />
//               <Typography variant={isMobile ? "body1" : "h6"} color="text.secondary">
//                 No return/exchange notifications
//               </Typography>
//             </Paper>
//           ) : (
//             returnExchangeNotifs.map((request) => {
//               const notif = request.latestNotification;
//               const latestStatus = request.status;
//               return (
//                 <Paper 
//                   key={request.id} 
//                   sx={{ 
//                     p: isMobile ? 2 : 3, 
//                     mb: isMobile ? 2 : 3, 
//                     borderRadius: isMobile ? 2 : 3, 
//                     boxShadow: 3, 
//                     background: "#fff", 
//                     border: "1px solid #e0e0e0" 
//                   }}
//                 >
//                   <Box sx={{ 
//                     display: "flex", 
//                     flexDirection: isMobile ? "column" : "row",
//                     justifyContent: "space-between", 
//                     alignItems: isMobile ? "flex-start" : "flex-start", 
//                     mb: 2,
//                     gap: isMobile ? 1.5 : 0
//                   }}>
//                     <Box sx={{ width: isMobile ? "100%" : "auto" }}>
//                       <Typography variant={isMobile ? "subtitle1" : "h6"} fontWeight={600} sx={{ mb: 0.5 }}>
//                         {request.type === "RETURN" ? (
//                           <AssignmentReturnIcon sx={{ mr: 1, verticalAlign: "middle", fontSize: isMobile ? 18 : 24 }} />
//                         ) : (
//                           <SwapHorizIcon sx={{ mr: 1, verticalAlign: "middle", fontSize: isMobile ? 18 : 24 }} />
//                         )}
//                         {request.type} Request #{request.id}
//                       </Typography>
//                       <Typography variant="body2" color="text.secondary" sx={{ fontSize: isMobile ? "0.75rem" : "0.875rem" }}>
//                         Order #{request.order_id} | Customer: {request.username}
//                       </Typography>
//                       <Typography variant="caption" color="text.secondary" sx={{ fontSize: isMobile ? "0.65rem" : "0.75rem" }}>
//                         Created: {new Date(request.created_at).toLocaleDateString()}
//                       </Typography>
//                     </Box>

//                     <Box sx={{ 
//                       display: "flex", 
//                       gap: 1, 
//                       alignItems: "center",
//                       width: isMobile ? "100%" : "auto"
//                     }}>
//                       <Chip 
//                         label={request.status} 
//                         size="small" 
//                         sx={{ 
//                           backgroundColor: getStatusColor(request.status), 
//                           color: "#fff", 
//                           fontWeight: 600,
//                           fontSize: isMobile ? "0.7rem" : "0.8125rem",
//                           flex: isMobile ? 1 : "none"
//                         }} 
//                       />
//                       <Button 
//                         variant="contained" 
//                         size="small" 
//                         onClick={() => openRequestDialog(request)}
//                         sx={{ minWidth: isMobile ? "auto" : undefined }}
//                       >
//                         Open
//                       </Button>
//                     </Box>
//                   </Box>

//                   <Divider sx={{ mb: 2 }} />

//                   {notif ? (
//                     <Box sx={{ 
//                       p: isMobile ? 1.5 : 2, 
//                       backgroundColor: "#f5f5f5", 
//                       borderRadius: 2, 
//                       borderLeft: `6px solid ${getStatusColor(notif.status)}` 
//                     }}>
//                       <Box sx={{ 
//                         display: "flex", 
//                         flexDirection: isMobile ? "column" : "row",
//                         justifyContent: "space-between", 
//                         mb: 1,
//                         gap: isMobile ? 1 : 0
//                       }}>
//                         <Chip 
//                           label={notif.status?.replace(/_/g, " ")} 
//                           size="small" 
//                           sx={{ 
//                             backgroundColor: getStatusColor(notif.status), 
//                             color: "#fff", 
//                             fontWeight: 600,
//                             fontSize: isMobile ? "0.7rem" : "0.8125rem"
//                           }} 
//                         />
//                         <Typography variant="caption" color="text.secondary" sx={{ fontSize: isMobile ? "0.65rem" : "0.75rem" }}>
//                           {new Date(notif.created_at).toLocaleDateString()} {!isMobile && new Date(notif.created_at).toLocaleTimeString()}
//                         </Typography>
//                       </Box>
//                       <Typography variant={isMobile ? "body2" : "body1"} sx={{ mt: 1 }}>
//                         {notif.message}
//                       </Typography>
//                       {notif.sender_username && notif.sender_username !== "SYSTEM" && (
//                         <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: "block", fontSize: isMobile ? "0.65rem" : "0.75rem" }}>
//                           By: {notif.sender_username}
//                         </Typography>
//                       )}
//                     </Box>
//                   ) : (
//                     <Typography variant="body2" color="text.secondary">
//                       No activity yet for this request.
//                     </Typography>
//                   )}
//                 </Paper>
//               );
//             })
//           )}
//         </Box>
//       )}

//       {/* ---------------- Request Detail Modal ---------------- */}
//       <Dialog 
//         open={Boolean(requestDialog.open)} 
//         onClose={closeRequestDialog} 
//         maxWidth="md" 
//         fullWidth
//         fullScreen={isMobile} // RESPONSIVE: Full screen on mobile,
        
//       >
//         <DialogTitle sx={{ fontSize: isMobile ? "1.1rem" : "1.25rem" }}>
//           {requestDialog.request ? `${requestDialog.request.type} Request #${requestDialog.request.id}` : "Request"}
//         </DialogTitle>
//         <DialogContent dividers>
//           {!requestDialog.request ? (
//             <Box py={2}>
//               <Typography>Loading...</Typography>
//             </Box>
//           ) : (
//             <>
//               {/* Basic info */}
//               <Box sx={{ 
//                 display: "flex", 
//                 flexDirection: isMobile ? "column" : "row",
//                 justifyContent: "space-between", 
//                 alignItems: isMobile ? "flex-start" : "flex-start", 
//                 mb: 2,
//                 gap: isMobile ? 1 : 0
//               }}>
//                 <Box>
//                   <Typography variant={isMobile ? "body2" : "subtitle1"}>
//                     Order #{requestDialog.request.order_id} • Customer: {requestDialog.request.username}
//                   </Typography>
//                   <Typography variant="caption" color="text.secondary" sx={{ fontSize: isMobile ? "0.65rem" : "0.75rem" }}>
//                     Created: {new Date(requestDialog.request.created_at).toLocaleString()}
//                   </Typography>
//                 </Box>
//                 <Chip 
//                   label={requestDialog.request.status} 
//                   sx={{ 
//                     backgroundColor: getStatusColor(requestDialog.request.status), 
//                     color: "#fff", 
//                     fontWeight: 600,
//                     fontSize: isMobile ? "0.7rem" : "0.8125rem"
//                   }} 
//                 />
//               </Box>

//               <Divider sx={{ my: 2 }} />

//               {/* Items */}
//               <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1, fontSize: isMobile ? "0.875rem" : "1rem" }}>
//                 Items
//               </Typography>
//               <Grid container spacing={isMobile ? 1 : 2} sx={{ mb: 2 }}>
//                 {(requestDialog.request.items || []).map((it, i) => (
//                   <Grid item xs={12} sm={6} md={4} key={i}>
//                     <Paper sx={{ p: isMobile ? 1.5 : 2 }}>
//                       <Typography fontWeight={600} sx={{ fontSize: isMobile ? "0.875rem" : "1rem" }}>
//                         {it.product_name || it.productName || it.name}
//                       </Typography>
//                       <Typography variant="body2" color="text.secondary" sx={{ fontSize: isMobile ? "0.75rem" : "0.875rem" }}>
//                         Qty: {it.qty} | {formatCurrency(it.price)}
//                       </Typography>
//                       {it.exchange_product_name && (
//                         <Chip 
//                           label={`Exchange: ${it.exchange_product_name}`} 
//                           size="small" 
//                           sx={{ mt: 1, fontSize: isMobile ? "0.65rem" : "0.75rem" }} 
//                         />
//                       )}
//                     </Paper>
//                   </Grid>
//                 ))}
//               </Grid>

//               {/* Reason */}
//               <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1, fontSize: isMobile ? "0.875rem" : "1rem" }}>
//                 Reason
//               </Typography>
//               <Paper sx={{ p: isMobile ? 1.5 : 2, mb: 2, backgroundColor: "#f9f9f9" }}>
//                 <Typography sx={{ fontSize: isMobile ? "0.875rem" : "1rem" }}>
//                   {requestDialog.request.reason}
//                 </Typography>
//               </Paper>

//               {/* Images */}
//               {requestDialog.request.images && requestDialog.request.images.length > 0 && (
//                 <>
//                   <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1, fontSize: isMobile ? "0.875rem" : "1rem" }}>
//                     Uploaded Images
//                   </Typography>
//                   <Grid container spacing={isMobile ? 1 : 2} sx={{ mb: 2 }}>
//                     {requestDialog.request.images.map((img, idx) => (
//                       <Grid item xs={6} sm={4} md={3} key={idx}>
//                         <Card>
//                           <CardMedia 
//                             component="img" 
//                             height={isMobile ? "180" : "150"} 
//                             image={img.image_data || img} 
//                             alt={`img-${idx}`} 
//                             sx={{ objectFit: "contain" }} 
//                           />
//                         </Card>
//                       </Grid>
//                     ))}
//                   </Grid>
//                 </>
//               )}

//               {/* Progress / Timeline */}
//               <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1, fontSize: isMobile ? "0.875rem" : "1rem" }}>
//                 Progress
//               </Typography>
//               <Box sx={{ mb: 2 }}>
//                 <Stepper 
//                   activeStep={getStepIndex(requestDialog.request.status)} 
//                   alternativeLabel={!isMobile}
//                   orientation={isMobile ? "vertical" : "horizontal"} // RESPONSIVE: Vertical on mobile
//                 >
//                   {RETURN_EXCHANGE_STEPS.map((s) => (
//                     <Step key={s}>
//                       <StepLabel sx={{ 
//                         "& .MuiStepLabel-label": { 
//                           fontSize: isMobile ? "0.7rem" : "0.875rem" 
//                         } 
//                       }}>
//                         {s.replace(/_/g, " ")}
//                       </StepLabel>
//                     </Step>
//                   ))}
//                 </Stepper>
//               </Box>

//               {/* Activity timeline */}
//               {requestDialog.request.notifications && requestDialog.request.notifications.length > 0 && (
//                 <>
//                   <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1, fontSize: isMobile ? "0.875rem" : "1rem" }}>
//                     Activity Timeline
//                   </Typography>
//                   <Box sx={{ mb: 2 }}>
//                     {requestDialog.request.notifications.map((n, i) => (
//                       <Paper 
//                         key={i} 
//                         sx={{ 
//                           p: isMobile ? 1.5 : 2, 
//                           mb: 1, 
//                           borderLeft: `4px solid ${getStatusColor(n.status)}` 
//                         }}
//                       >
//                         <Box sx={{ 
//                           display: "flex", 
//                           flexDirection: isMobile ? "column" : "row",
//                           justifyContent: "space-between", 
//                           mb: 1,
//                           gap: isMobile ? 0.5 : 0
//                         }}>
//                           <Chip 
//                             label={n.status?.replace(/_/g, " ")} 
//                             size="small" 
//                             sx={{ 
//                               backgroundColor: getStatusColor(n.status), 
//                               color: "#fff",
//                               fontSize: isMobile ? "0.5rem" : "0.75rem"
//                             }} 
//                           />
//                           <Typography variant="caption" color="text.secondary" sx={{ fontSize: isMobile ? "0.65rem" : "0.75rem" }}>
//                             {new Date(n.created_at).toLocaleString()}
//                           </Typography>
//                         </Box>
//                         <Typography variant="body2" sx={{ fontSize: isMobile ? "0.8rem" : "0.875rem" }}>
//                           {n.message}
//                         </Typography>
//                         {n.sender_username && n.sender_username !== "SYSTEM" && (
//                           <Typography variant="caption" color="text.secondary" sx={{ fontSize: isMobile ? "0.65rem" : "0.75rem" }}>
//                             By: {n.sender_username}
//                           </Typography>
//                         )}
//                       </Paper>
//                     ))}
//                   </Box>
//                 </>
//               )}

//               {/* Admin Notes if present */}
//               {requestDialog.request.admin_notes && (
//                 <Paper sx={{ p: isMobile ? 1.5 : 2, mb: 2, backgroundColor: "#fff3e0", border: "1px solid #ff9800" }}>
//                   <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1, fontSize: isMobile ? "0.875rem" : "1rem" }}>
//                     Admin Notes
//                   </Typography>
//                   <Typography sx={{ fontSize: isMobile ? "0.8rem" : "0.875rem" }}>
//                     {requestDialog.request.admin_notes}
//                   </Typography>
//                 </Paper>
//               )}
//             </>
//           )}
//         </DialogContent>

//         <DialogActions sx={{ 
//           display: "flex", 
//           flexDirection: isMobile ? "column" : "row", // RESPONSIVE: Stack on mobile
//           justifyContent: "space-between", 
//           px: isMobile ? 2 : 3, 
//           pb: 2,
//           gap: isMobile ? 1 : 0
//         }}>
//           {/* Left area: team actions */}
//           <Box sx={{ 
//             display: "flex", 
//             flexDirection: isMobile ? "column" : "row",
//             alignItems: "center", 
//             gap: 1,
//             width: isMobile ? "100%" : "auto"
//           }}>
//             {/* Team member progress update button */}
//             {userType !== "USER" && 
//              userType !== "ADMIN" && 
//              requestDialog.request && 
//              requestDialog.request.status && 
//              requestDialog.request.status !== "PENDING" && 
//              requestDialog.request.status !== "REJECTED" && 
//              requestDialog.request.status !== "COMPLETED" && (
//               <Button 
//                 variant="contained" 
//                 onClick={() => openProgressDialog(requestDialog.request.id, requestDialog.request.status)} 
//                 startIcon={<LocalShippingIcon />}
//                 fullWidth={isMobile}
//                 size={isMobile ? "medium" : "medium"}
//               >
//                 Update Progress
//               </Button>
//             )}

//             {/* Admin notes input - ONLY for pending requests */}
//             {userType === "ADMIN" && 
//              requestDialog.request && 
//              requestDialog.request.status === "PENDING" && (
//               <TextField
//                 size="small"
//                 placeholder="Add admin notes (optional)"
//                 value={adminNotes}
//                 onChange={(e) => setAdminNotes(e.target.value)}
//                 sx={{ minWidth: isMobile ? "100%" : 320 }}
//                 fullWidth={isMobile}
//               />
//             )}
//           </Box>

//           {/* Right area: Close / Approve / Reject buttons */}
//           <Box sx={{ 
//             display: "flex", 
//             flexDirection: isMobile ? "column" : "row",
//             gap: 1,
//             width: isMobile ? "100%" : "auto",
//             height: isMobile ? "180px" : "40px"
//           }}>
//             {userType === "ADMIN" && 
//              requestDialog.request && 
//              requestDialog.request.status === "PENDING" ? (
//               <>
//                 <Button 
//                   onClick={closeRequestDialog}
//                   fullWidth={isMobile}
//                   variant="outlined"
//                 >
//                   Cancel
//                 </Button>
//                 <Button 
//                   variant="contained" 
//                   color="error" 
//                   startIcon={processing ? null : <CancelIcon />} 
//                   onClick={() => handleReviewRequest("REJECTED")} 
//                   disabled={processing}
//                   fullWidth={isMobile}
//                 >
//                   {processing ? <CircularProgress size={18} color="inherit" /> : "Reject"}
//                 </Button>
//                 <Button 
//                   variant="contained" 
//                   color="success" 
//                   startIcon={processing ? null : <CheckCircleIcon />} 
//                   onClick={() => handleReviewRequest("APPROVED")} 
//                   disabled={processing}
//                   fullWidth={isMobile}
//                 >
//                   {processing ? <CircularProgress size={18} color="inherit" /> : "Approve"}
//                 </Button>
//               </>
//             ) : (
//               // Just close button for non-admin or non-pending requests
//               <Button 
//                 onClick={closeRequestDialog}
//                 fullWidth={isMobile}
//                 variant="contained"
//               >
//                 Close
//               </Button>
//             )}
//           </Box>
//         </DialogActions>
//       </Dialog>

//       {/* ---------------- Progress Update Dialog ---------------- */}
//       <Dialog 
//         open={progressDialog.open} 
//         onClose={closeProgressDialog} 
//         maxWidth="sm" 
//         fullWidth
//         fullScreen={isMobile} // RESPONSIVE: Full screen on mobile,
//          sx={{ height: isMobile ? "100px" : "40px"
//         }}
//       >
//         <DialogTitle sx={{ fontSize: isMobile ? "1.1rem" : "1.25rem" }}>
//           Update Progress
//         </DialogTitle>
//         <DialogContent>
//           <Typography variant="body2" sx={{ mb: 2, fontSize: isMobile ? "0.875rem" : "1rem" }}>
//             Current Status: <strong>{progressDialog.currentStatus?.replace(/_/g, " ")}</strong>
//           </Typography>
          
//           <Typography variant="body2" color="text.secondary" sx={{ mb: 2, fontSize: isMobile ? "0.875rem" : "1rem" }}>
//             Your Role: <strong>{userType}</strong>
//           </Typography>

//           {getAvailableStatusOptions(userType, progressDialog.currentStatus).length === 0 ? (
//             <Paper sx={{ p: isMobile ? 1.5 : 2, backgroundColor: "#fff3e0", border: "1px solid #ff9800" }}>
//               <Typography variant="body2" color="warning.main" sx={{ fontSize: isMobile ? "0.875rem" : "1rem" }}>
//                 No status updates available for your role at this stage.
//               </Typography>
//             </Paper>
//           ) : (
//             <>
//               <TextField
//                 select
//                 fullWidth
//                 value={progressStatus}
//                 onChange={(e) => setProgressStatus(e.target.value)}
//                 SelectProps={{ native: true }}
//                 sx={{ mb: 2 }}
//                 size={isMobile ? "medium" : "medium"}
//               >
//                 <option value="">-- Select Status --</option>
//                 {getAvailableStatusOptions(userType, progressDialog.currentStatus).map((option) => (
//                   <option key={option.value} value={option.value}>
//                     {option.label}
//                   </option>
//                 ))}
//               </TextField>
              
//               <TextField 
//                 fullWidth 
//                 multiline 
//                 rows={isMobile ? 2 : 3}
//                 label="Message (optional)" 
//                 placeholder="Add a message for the customer..." 
//                 value={progressMessage} 
//                 onChange={(e) => setProgressMessage(e.target.value)}
//                 size={isMobile ? "medium" : "medium"}
//               />
//             </>
//           )}
//         </DialogContent>
//         <DialogActions sx={{ 
//           flexDirection: isMobile ? "column" : "row",
//           gap: isMobile ? 1 : 0,
//           p: isMobile ? 2 : undefined
//         }}>
//           <Button 
//             onClick={closeProgressDialog}
//             fullWidth={isMobile}
//           >
//             Cancel
//           </Button>
//           <Button 
//             variant="contained" 
//             onClick={handleUpdateProgress} 
//             disabled={
//               processing || 
//               !progressStatus || 
//               getAvailableStatusOptions(userType, progressDialog.currentStatus).length === 0
//             }
//             fullWidth={isMobile}
//           >
//             {processing ? <CircularProgress size={20} /> : "Update"}
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </Box>
//   );
// }