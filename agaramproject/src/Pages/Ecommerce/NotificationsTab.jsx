// NotificationsTab.jsx
import React, { useEffect, useState } from "react";
import { 
  Paper, 
  Typography, 
  Box, 
  CircularProgress,
  Chip,
  Divider,
} from "@mui/material";
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineOppositeContent,
} from "@mui/lab";

import NotificationsIcon from "@mui/icons-material/Notifications";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { getNotificationsApi } from "../../api/api";

// Determine user type based on username
const getUserType = (username) => {
  const lowerUsername = username?.toLowerCase();
  
  if (lowerUsername === "admin") return "ADMIN";
  if (lowerUsername === "warehouse") return "WAREHOUSE";
  if (lowerUsername === "distributor") return "DISTRIBUTOR";
  if (lowerUsername === "agent") return "AGENT";
  if (lowerUsername === "courier") return "COURIER";
  
  return "USER";
};

// Helper function to determine if a notification should be shown
const shouldShowNotification = (notif, viewerType) => {
  // Admin sees everything
  if (viewerType === "ADMIN") return true;
  
  // Regular users see all notifications for their orders
  if (viewerType === "USER") return true;
  
  // Determine sender type from notification
  const senderType = getUserType(notif.sender_username);
  
  // Middlemen only see notifications from their previous step
  const stepOrder = ["WAREHOUSE", "DISTRIBUTOR", "AGENT", "COURIER"];
  const senderIndex = stepOrder.indexOf(senderType);
  const viewerIndex = stepOrder.indexOf(viewerType);
  
  // Show if sender is the previous step or if it's their own notification
  return senderIndex === viewerIndex - 1 || senderType === viewerType;
};

export default function NotificationsTab({ username, userType }) {
  const [groupedNotifs, setGroupedNotifs] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
    // Poll for new notifications every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [username]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await getNotificationsApi(username);
      console.log("Fetched notifications:", res.data);
      
      let allNotifs = res.data || [];
      
      // Filter notifications based on user type
      if (userType === "USER") {
        // Regular users only see notifications for their own orders
        allNotifs = allNotifs.filter(notif => 
          notif.customer_username === username || 
          notif.username === username
        );
      } else if (userType !== "ADMIN") {
        // Middlemen (warehouse, distributor, agent, courier) see filtered notifications
        allNotifs = allNotifs.filter(notif => shouldShowNotification(notif, userType));
      }
      // Admin sees all notifications (no filtering)
      
      // Group notifications by order_id
      const grouped = {};
      allNotifs.forEach(notif => {
        const orderId = notif.order_id;
        if (!grouped[orderId]) {
          grouped[orderId] = {
            order_id: orderId,
            customer_username: notif.customer_username,
            item_count: notif.item_count,
            notifications: []
          };
        }
        grouped[orderId].notifications.push(notif);
      });
      
      // Sort notifications within each order by created_at (oldest first for timeline)
      Object.keys(grouped).forEach(orderId => {
        grouped[orderId].notifications.sort((a, b) => 
          new Date(a.created_at) - new Date(b.created_at)
        );
      });
      
      // Convert to array and sort by latest notification (newest orders first)
      const groupedArray = Object.values(grouped).sort((a, b) => {
        const latestA = new Date(a.notifications[a.notifications.length - 1].created_at);
        const latestB = new Date(b.notifications[b.notifications.length - 1].created_at);
        return latestB - latestA;
      });
      
      // Convert back to object with order_id as key
      setGroupedNotifs(groupedArray);

      setLoading(false);
    } catch (err) {
      console.error("Error fetching notifications:", err);
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      PLACED: "#2196f3",
      PROCESSING: "#ff9800",
      SHIPPED: "#9c27b0",
      OUT_FOR_DELIVERY: "#ff5722",
      DELIVERED: "#4caf50"
    };
    return colors[status?.toUpperCase()] || "#757575";
  };

  // Get display name for user type
  const getDisplayUserType = (type) => {
    const types = {
      ADMIN: "Admin",
      WAREHOUSE: "Warehouse",
      DISTRIBUTOR: "Distributor",
      AGENT: "Agent",
      COURIER: "Courier",
      USER: "Customer"
    };
    return types[type] || type;
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" py={10}>
        <CircularProgress />
      </Box>
    );
  }

  if (Object.keys(groupedNotifs).length === 0) {
    return (
      <Paper sx={{ p: 4, textAlign: "center", backgroundColor: "#fff" }}>
        <NotificationsIcon sx={{ fontSize: 60, color: "#bdbdbd", mb: 2 }} />
        <Typography variant="h6" color="text.secondary">
          No notifications yet
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          {userType === "USER" 
            ? "You'll see your order updates here" 
            : "You'll see relevant order updates here"}
        </Typography>
      </Paper>
    );
  }

  return (
    <Box>
{groupedNotifs.map((orderGroup) => {
        const latestNotif = orderGroup.notifications[orderGroup.notifications.length - 1];
        const currentStatus = latestNotif.order_status || latestNotif.status || "UNKNOWN";
        const itemCount = orderGroup.item_count || 0;
        
        return (
          <Paper 
            key={orderGroup.order_id} 
            sx={{ 
              p: 3, 
              mb: 3, 
              borderRadius: 3,
              boxShadow: 3,
              border: "1px solid #e0e0e0",
              background: "#fff"
            }}
          >
            {/* Header */}
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
              <Box>
                <Typography variant="h6" fontWeight={600} sx={{ mb: 0.5 }}>
                  Order #{orderGroup.order_id}
                  {userType !== "USER" && orderGroup.customer_username && (
                    <span style={{ fontSize: "0.9em", fontWeight: 400, marginLeft: "8px" }}>
                      by {orderGroup.customer_username}
                    </span>
                  )}
                </Typography>
                {itemCount > 0 && (
                  <Typography variant="caption" color="text.secondary">
                    {itemCount} item{itemCount !== 1 ? 's' : ''} in this order
                  </Typography>
                )}
              </Box>

              <Chip 
                label={currentStatus} 
                size="small"
                sx={{ 
                  backgroundColor: getStatusColor(currentStatus),
                  color: "#fff",
                  fontWeight: 600,
                  fontSize: "0.85rem"
                }}
              />
            </Box>

            <Divider sx={{ mb: 3 }} />

            {/* Timeline of Updates */}
            <Timeline 
              sx={{ 
                p: 0, 
                m: 0,
                '& .MuiTimelineItem-root:before': {
                  flex: 0,
                  padding: 0
                }
              }}
            >
              {orderGroup.notifications.map((notif, index) => {
                const isLast = index === orderGroup.notifications.length - 1;
                const senderType = getUserType(notif.sender_username);
                const notifStatus = notif.order_status || notif.status || "UNKNOWN";
                
                return (
                  <TimelineItem key={notif.id}>
                    <TimelineOppositeContent 
                      sx={{ 
                        maxWidth: '140px', 
                        paddingLeft: 0,
                        paddingRight: 2,
                        flex: 0.3
                      }}
                    >
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                        {new Date(notif.created_at).toLocaleDateString()}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                        {new Date(notif.created_at).toLocaleTimeString()}
                      </Typography>
                    </TimelineOppositeContent>
                    
                    <TimelineSeparator>
                      <TimelineDot 
                        sx={{ 
                          backgroundColor: getStatusColor(notifStatus),
                          boxShadow: `0 0 0 4px ${getStatusColor(notifStatus)}20`
                        }}
                      >
                        <CheckCircleIcon sx={{ fontSize: 16 }} />
                      </TimelineDot>
                      {!isLast && <TimelineConnector sx={{ backgroundColor: '#e0e0e0' }} />}
                    </TimelineSeparator>
                    
                    <TimelineContent sx={{ py: '12px', px: 2 }}>
                      <Box 
                        sx={{ 
                          p: 2, 
                          backgroundColor: "#f5f5f5", 
                          borderRadius: 2,
                          borderLeft: `4px solid ${getStatusColor(notifStatus)}`
                        }}
                      >
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                          <Chip 
                            label={notifStatus}
                            size="small"
                            sx={{ 
                              backgroundColor: getStatusColor(notifStatus),
                              color: '#fff',
                              fontWeight: 600,
                              fontSize: '0.75rem'
                            }}
                          />
                          {userType !== "USER" && (
                            <Chip 
                              label={getDisplayUserType(senderType)}
                              size="small"
                              variant="outlined"
                              sx={{ fontWeight: 600, fontSize: '0.75rem' }}
                            />
                          )}
                        </Box>
                        <Typography variant="body2" sx={{ mt: 1 }}>
                          {notif.message}
                        </Typography>
                      </Box>
                    </TimelineContent>
                  </TimelineItem>
                );
              })}
            </Timeline>
          </Paper>
        );
      })}
    </Box>
  );
}