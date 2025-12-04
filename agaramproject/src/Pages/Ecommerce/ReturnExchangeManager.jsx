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
} from "@mui/material";
import {
  getAllReturnExchangesApi,
  getReturnExchangesByUserApi,
  reviewReturnExchangeApi,
  updateReturnExchangeProgressApi,
} from "../../api/api";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";

// Simplified status flow
const RETURN_EXCHANGE_STEPS = [
  "PENDING",
  "APPROVED",
  "PICKED_UP",
  "IN_TRANSIT_TO_WAREHOUSE",
  "RECEIVED_AT_WAREHOUSE",
  "QUALITY_CHECK_PASSED",
  "COMPLETED"
];

const getUserType = (username) => {
  if (!username) return "USER";
  const lowerUsername = username.trim().toLowerCase();
  if (lowerUsername === "admin" || lowerUsername === "administrator") return "ADMIN";
  if (lowerUsername === "warehouse") return "WAREHOUSE";
  if (lowerUsername === "distributor") return "DISTRIBUTOR";
  if (lowerUsername === "agent") return "AGENT";
  if (lowerUsername === "courier") return "COURIER";
  return "USER";
};

// Define which user types can update to which status
const getAvailableStatusesForUser = (userType, currentStatus) => {
  if (currentStatus === "REJECTED" || currentStatus === "COMPLETED") {
    return [];
  }

  switch (userType) {
    case "COURIER":
      if (currentStatus === "APPROVED") {
        return [{ value: "PICKED_UP", label: "Picked Up" }];
      }
      return [];
    
    case "AGENT":
      if (currentStatus === "PICKED_UP") {
        return [{ value: "IN_TRANSIT_TO_WAREHOUSE", label: "In Transit to Warehouse" }];
      }
      return [];
    
    case "DISTRIBUTOR":
      if (currentStatus === "IN_TRANSIT_TO_WAREHOUSE") {
        return [{ value: "RECEIVED_AT_WAREHOUSE", label: "Received at Warehouse" }];
      }
      return [];
    
    case "WAREHOUSE":
      if (currentStatus === "RECEIVED_AT_WAREHOUSE") {
        return [
          { value: "QUALITY_CHECK_PASSED", label: "Quality Check Passed" },
          { value: "QUALITY_CHECK_FAILED", label: "Quality Check Failed" }
        ];
      }
      if (currentStatus === "QUALITY_CHECK_PASSED") {
        return [{ value: "COMPLETED", label: "Completed" }];
      }
      return [];
    
    default:
      return [];
  }
};

export default function ReturnExchangeManager() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviewDialog, setReviewDialog] = useState({
    open: false,
    requestId: null,
    action: null,
  });
  const [adminNotes, setAdminNotes] = useState("");
  const [progressDialog, setProgressDialog] = useState({
    open: false,
    requestId: null,
    currentStatus: null,
  });
  const [progressStatus, setProgressStatus] = useState("");
  const [progressMessage, setProgressMessage] = useState("");
  const [processing, setProcessing] = useState(false);

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
    fetchRequests();
    const interval = setInterval(fetchRequests, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      
      let res;
      if (userType === "ADMIN") {
        res = await getAllReturnExchangesApi();
      } else {
        res = await getReturnExchangesByUserApi(user.id);
      }
      
      setRequests(res.data || []);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching return/exchange requests:", err);
      setLoading(false);
    }
  };

  const handleOpenReviewDialog = (requestId, action) => {
    setReviewDialog({
      open: true,
      requestId: requestId,
      action: action,
    });
    setAdminNotes("");
  };

  const handleCloseReviewDialog = () => {
    setReviewDialog({
      open: false,
      requestId: null,
      action: null,
    });
    setAdminNotes("");
  };

  const handleReview = async () => {
    if (!reviewDialog.requestId || !reviewDialog.action) return;

    try {
      setProcessing(true);
      
      const reviewData = {
        status: reviewDialog.action,
        reviewedBy: username,
        adminNotes: adminNotes.trim(),
      };

      const res = await reviewReturnExchangeApi(reviewDialog.requestId, reviewData);

      if (res.data?.success) {
        alert(`Request ${reviewDialog.action.toLowerCase()} successfully!`);
        handleCloseReviewDialog();
        fetchRequests();
      } else {
        alert("Failed to review request");
      }
    } catch (err) {
      console.error("Error reviewing request:", err);
      alert("Failed to review request: " + (err.response?.data?.message || err.message));
    } finally {
      setProcessing(false);
    }
  };

  const handleOpenProgressDialog = (requestId, currentStatus) => {
    setProgressDialog({
      open: true,
      requestId: requestId,
      currentStatus: currentStatus,
    });
    setProgressStatus("");
    setProgressMessage("");
  };

  const handleCloseProgressDialog = () => {
    setProgressDialog({
      open: false,
      requestId: null,
      currentStatus: null,
    });
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

      const res = await updateReturnExchangeProgressApi(progressDialog.requestId, updateData);

      if (res.data?.success) {
        alert("Progress updated successfully!");
        handleCloseProgressDialog();
        fetchRequests();
      } else {
        alert("Failed to update progress");
      }
    } catch (err) {
      console.error("Error updating progress:", err);
      alert("Failed to update progress: " + (err.response?.data?.message || err.message));
    } finally {
      setProcessing(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      PENDING: "#ff9800",
      APPROVED: "#4caf50",
      REJECTED: "#f44336",
      PICKED_UP: "#2196f3",
      IN_TRANSIT_TO_WAREHOUSE: "#2196f3",
      RECEIVED_AT_WAREHOUSE: "#9c27b0",
      QUALITY_CHECK_PASSED: "#4caf50",
      QUALITY_CHECK_FAILED: "#f44336",
      COMPLETED: "#4caf50",
      CANCELLED: "#757575",
    };
    return colors[status?.toUpperCase()] || "#757575";
  };

  const getStepIndex = (status) => {
    const idx = RETURN_EXCHANGE_STEPS.indexOf(status?.toUpperCase());
    return idx === -1 ? 0 : idx;
  };

  const formatCurrency = (amt) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amt);

  // Check if user can update this request
  const canUpdateRequest = (request) => {
    if (userType === "USER" || userType === "ADMIN") return false;
    if (request.status === "REJECTED" || request.status === "COMPLETED") return false;
    
    const availableStatuses = getAvailableStatusesForUser(userType, request.status);
    return availableStatuses.length > 0;
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" py={10}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, backgroundColor: "#f5f5f5", minHeight: "100vh" }}>
      <Typography variant="h4" fontWeight={600} sx={{ mb: 3 }}>
        {userType === "ADMIN" ? "Manage Return/Exchange Requests" : "My Return/Exchange Requests"}
      </Typography>

      {requests.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: "center" }}>
          <Typography variant="h6" color="text.secondary">
            No return/exchange requests found
          </Typography>
        </Paper>
      ) : (
        requests.map((request) => (
          <Accordion key={request.id} sx={{ mb: 2, borderRadius: 2 }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Box sx={{ display: "flex", justifyContent: "space-between", width: "100%", alignItems: "center", pr: 2 }}>
                <Box>
                  <Typography variant="h6" fontWeight={600}>
                    {request.type} Request #{request.id}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Order #{request.order_id} | Customer: {request.username}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Created: {new Date(request.created_at).toLocaleString()}
                  </Typography>
                </Box>
                <Chip
                  label={request.status.replace(/_/g, " ")}
                  sx={{
                    backgroundColor: getStatusColor(request.status),
                    color: "#fff",
                    fontWeight: 600,
                  }}
                />
              </Box>
            </AccordionSummary>

            <AccordionDetails>
              <Divider sx={{ mb: 3 }} />

              {/* Items */}
              <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>
                Items:
              </Typography>
              <Grid container spacing={2} sx={{ mb: 3 }}>
                {(request.items || []).map((item, idx) => (
                  <Grid item xs={12} sm={6} md={4} key={idx}>
                    <Paper sx={{ p: 2 }}>
                      <Typography fontWeight={600}>{item.product_name}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        Qty: {item.qty} | {formatCurrency(item.price)}
                      </Typography>
                      {item.exchange_product_name && (
                        <Chip
                          label={`Exchange: ${item.exchange_product_name}`}
                          size="small"
                          color="primary"
                          sx={{ mt: 1 }}
                        />
                      )}
                    </Paper>
                  </Grid>
                ))}
              </Grid>

              {/* Reason */}
              <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1 }}>
                Reason:
              </Typography>
              <Paper sx={{ p: 2, mb: 3, backgroundColor: "#f9f9f9" }}>
                <Typography>{request.reason}</Typography>
              </Paper>

              {/* Images */}
              {request.images && request.images.length > 0 && (
                <>
                  <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>
                    Uploaded Images:
                  </Typography>
                  <Grid container spacing={2} sx={{ mb: 3 }}>
                    {request.images.map((image, idx) => (
                      <Grid item xs={6} sm={4} md={3} key={idx}>
                        <Card>
                          <CardMedia
                            component="img"
                            height="150"
                            image={image.image_data}
                            alt={`Image ${idx + 1}`}
                            sx={{ objectFit: "contain" }}
                          />
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                </>
              )}

              {/* Status Progress */}
              {request.status !== "REJECTED" && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>
                    Progress:
                  </Typography>
                  <Stepper activeStep={getStepIndex(request.status)} alternativeLabel>
                    {RETURN_EXCHANGE_STEPS.map((step) => (
                      <Step key={step}>
                        <StepLabel>{step.replace(/_/g, " ")}</StepLabel>
                      </Step>
                    ))}
                  </Stepper>
                </Box>
              )}

              {/* Admin Notes */}
              {request.admin_notes && (
                <Paper sx={{ p: 2, mb: 3, backgroundColor: "#fff3e0", border: "1px solid #ff9800" }}>
                  <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>
                    Admin Notes:
                  </Typography>
                  <Typography>{request.admin_notes}</Typography>
                  {request.reviewed_by && (
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: "block" }}>
                      Reviewed by: {request.reviewed_by} on {new Date(request.reviewed_at).toLocaleString()}
                    </Typography>
                  )}
                </Paper>
              )}

              {/* Notifications */}
              {request.notifications && request.notifications.length > 0 && (
                <>
                  <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>
                    Activity Timeline:
                  </Typography>
                  <Box sx={{ mb: 3 }}>
                    {request.notifications.map((notif, idx) => (
                      <Paper
                        key={idx}
                        sx={{
                          p: 2,
                          mb: 2,
                          borderLeft: `4px solid ${getStatusColor(notif.status)}`,
                        }}
                      >
                        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                          <Chip
                            label={notif.status?.replace(/_/g, " ")}
                            size="small"
                            sx={{
                              backgroundColor: getStatusColor(notif.status),
                              color: "#fff",
                            }}
                          />
                          <Typography variant="caption" color="text.secondary">
                            {new Date(notif.created_at).toLocaleString()}
                          </Typography>
                        </Box>
                        <Typography variant="body2">{notif.message}</Typography>
                        {notif.sender_username && notif.sender_username !== "SYSTEM" && (
                          <Typography variant="caption" color="text.secondary">
                            By: {notif.sender_username}
                          </Typography>
                        )}
                      </Paper>
                    ))}
                  </Box>
                </>
              )}

              {/* Admin Actions */}
              {userType === "ADMIN" && request.status === "PENDING" && (
                <Box sx={{ display: "flex", gap: 2, mt: 3 }}>
                  <Button
                    variant="contained"
                    color="success"
                    startIcon={<CheckCircleIcon />}
                    onClick={() => handleOpenReviewDialog(request.id, "APPROVED")}
                  >
                    Approve
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    startIcon={<CancelIcon />}
                    onClick={() => handleOpenReviewDialog(request.id, "REJECTED")}
                  >
                    Reject
                  </Button>
                </Box>
              )}

              {/* Team Member Actions */}
              {canUpdateRequest(request) && (
                <Box sx={{ mt: 3 }}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleOpenProgressDialog(request.id, request.status)}
                  >
                    Update Status
                  </Button>
                </Box>
              )}
            </AccordionDetails>
          </Accordion>
        ))
      )}

      {/* Review Dialog */}
      <Dialog open={reviewDialog.open} onClose={handleCloseReviewDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {reviewDialog.action === "APPROVED" ? "Approve Request" : "Reject Request"}
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 2 }}>
            {reviewDialog.action === "APPROVED"
              ? "By approving, the courier will be notified to pick up the item from the customer."
              : "Please provide a reason for rejection."}
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Admin Notes"
            placeholder={
              reviewDialog.action === "APPROVED"
                ? "Add any special instructions or notes..."
                : "Explain why this request is being rejected..."
            }
            value={adminNotes}
            onChange={(e) => setAdminNotes(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseReviewDialog}>Cancel</Button>
          <Button
            variant="contained"
            color={reviewDialog.action === "APPROVED" ? "success" : "error"}
            onClick={handleReview}
            disabled={processing}
          >
            {processing ? <CircularProgress size={20} /> : "Confirm"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Progress Update Dialog */}
      <Dialog open={progressDialog.open} onClose={handleCloseProgressDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Update Status</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Current Status: <strong>{progressDialog.currentStatus?.replace(/_/g, " ")}</strong>
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            You are logged in as: <strong>{userType}</strong>
          </Typography>
          <TextField
            select
            fullWidth
            value={progressStatus}
            onChange={(e) => setProgressStatus(e.target.value)}
            SelectProps={{ native: true }}
            sx={{ mb: 2 }}
          >
            <option value="">-- Select Status --</option>
            {getAvailableStatusesForUser(userType, progressDialog.currentStatus).map((status) => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </TextField>
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Message (Optional)"
            placeholder="Add any additional information for the customer..."
            value={progressMessage}
            onChange={(e) => setProgressMessage(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseProgressDialog}>Cancel</Button>
          <Button variant="contained" onClick={handleUpdateProgress} disabled={processing || !progressStatus}>
            {processing ? <CircularProgress size={20} /> : "Update"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}