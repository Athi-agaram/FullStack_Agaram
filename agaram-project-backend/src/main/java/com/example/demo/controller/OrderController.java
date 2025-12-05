package com.example.demo.controller;

import com.example.demo.order.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.Map;
import java.util.List;
import java.util.logging.Logger;
import org.springframework.http.ResponseEntity;

@RestController
@RequestMapping("/api/orders")
//@CrossOrigin(origins = "*")
public class OrderController {

    @Autowired
    private OrderService service;

    private static final Logger logger = Logger.getLogger(OrderController.class.getName());

    // =============================
    // CHECKOUT
    // =============================
    @PostMapping("/checkout/{userId}")
    public ResponseEntity<?> checkout(@PathVariable int userId) {
        try {
            List<Map<String, Object>> cart = service.getCartForUser(userId);
            if (cart == null || cart.isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(Map.of("success", false, "error", "Cart is empty"));
            }

            int orderId = service.checkout(userId);
            
            // AUTO-GENERATE initial notification for warehouse
            try {
                // Get order details to find customer username
                List<Map<String, Object>> orders = service.getOrders(userId);
                if (!orders.isEmpty()) {
                    Map<String, Object> order = orders.stream()
                        .filter(o -> ((Number)o.get("order_id")).intValue() == orderId)
                        .findFirst()
                        .orElse(null);
                    
                    if (order != null) {
                        String customerUsername = (String) order.get("username");
                        int itemCount = order.containsKey("items") ? 
                            ((List<?>) order.get("items")).size() : 0;
                        
                        String message = String.format(
                            " New order placed by %s with %d items", 
                            customerUsername, itemCount
                        );
                        
                        service.sendNotification(orderId, customerUsername, message, "PLACED");
                    }
                }
            } catch (Exception notifEx) {
                logger.warning("Failed to send initial notification: " + notifEx.getMessage());
            }

            return ResponseEntity.ok(Map.of("success", true, "orderId", orderId));

        } catch (Exception ex) {
            logger.severe("Error during checkout: " + ex.getMessage());
            ex.printStackTrace();
            return ResponseEntity.status(500)
                    .body(Map.of("success", false, "error", "Checkout failed: " + ex.getMessage()));
        }
    }

    // =============================
    // GET ORDERS (USERNAME BASED)
    // =============================
    @GetMapping("/{userId}")
    public ResponseEntity<?> getOrders(
            @PathVariable int userId,
            @RequestHeader(value = "username", required = false) String username
    ) {
        try {
            logger.info("Fetching orders for userId: " + userId + ", username: " + username);
            
            // Get user permission
            Map<String, Object> perm = service.getUserPermission(username);
            boolean isAdmin = perm != null && Boolean.TRUE.equals(perm.get("can_update_any"));
            
            List<Map<String, Object>> orders;

            if (isAdmin) {
                // Admin sees all orders
                logger.info("User is admin - fetching all orders");
                orders = service.getOrdersForAdmin();
            } else if (perm != null) {
                // Warehouse/Distributor/Agent/Courier see all orders (but can only update their step)
                logger.info("User has role permission - fetching all orders");
                orders = service.getOrdersForRoles();
            } else {
                // Regular customer sees only their orders
                logger.info("Regular customer - fetching user orders");
                orders = service.getOrders(userId);
            }

            logger.info("Returning " + orders.size() + " orders");
            return ResponseEntity.ok(orders);

        } catch (Exception ex) {
            logger.severe("Error fetching orders: " + ex.getMessage());
            ex.printStackTrace();
            return ResponseEntity.status(500)
                    .body(Map.of("success", false, "error", "Could not fetch orders: " + ex.getMessage()));
        }
    }

    // =============================
    // UPDATE ORDER STATUS
    // =============================
    @PutMapping("/status")
    public ResponseEntity<?> updateOrderStatus(
            @RequestBody Map<String, Object> body,
            @RequestHeader(value = "username", required = false) String username
    ) {
        try {
            int orderId = ((Number) body.get("orderId")).intValue();
            String status = (String) body.get("status");
            String currentStatus = (String) body.get("currentStatus");

            logger.info(String.format("Update request - Order: %d, From: %s, To: %s, User: %s", 
                orderId, currentStatus, status, username));

            // Check permission
            if (!service.canUserUpdateStep(username, currentStatus)) {
                return ResponseEntity.status(403)
                        .body(Map.of("success", false,
                                "error", "User '" + username + "' cannot update from step '" + currentStatus + "'"));
            }

            int rows = service.updateOrderStatus(orderId, status);
            
            if (rows > 0) {
                logger.info("Order updated successfully");
                return ResponseEntity.ok(Map.of("success", true));
            } else {
                return ResponseEntity.badRequest()
                    .body(Map.of("success", false, "error", "Order not found"));
            }

        } catch (Exception ex) {
            logger.severe("Error updating order status: " + ex.getMessage());
            ex.printStackTrace();
            return ResponseEntity.status(500)
                    .body(Map.of("success", false, "error", "Update failed: " + ex.getMessage()));
        }
    }

    // =============================
    // GET NOTIFICATIONS
    // =============================
    @GetMapping("/notifications")
    public ResponseEntity<?> getNotifications(
            @RequestHeader("username") String username
    ) {
        try {
            logger.info("Fetching notifications for username: " + username);
            
            List<Map<String, Object>> notifs = service.getNotificationsByUsername(username);
            
            logger.info("Returning " + notifs.size() + " notifications");
            return ResponseEntity.ok(notifs);

        } catch (Exception ex) {
            logger.severe("Error fetching notifications: " + ex.getMessage());
            ex.printStackTrace();
            return ResponseEntity.status(500)
                    .body(Map.of("success", false, "error", "Could not fetch notifications: " + ex.getMessage()));
        }
    }

    // =============================
    // SEND NOTIFICATION
    // =============================
    @PostMapping("/notifications/send")
    public ResponseEntity<?> sendNotification(
            @RequestBody Map<String, Object> body,
            @RequestHeader("username") String username
    ) {
        try {
            int orderId = ((Number) body.get("orderId")).intValue();
            String message = (String) body.get("message");
            String status = (String) body.get("status");

            logger.info(String.format("Sending notification - Order: %d, User: %s, Status: %s", 
                orderId, username, status));

            int rows = service.sendNotification(orderId, username, message, status);
            
            if (rows > 0) {
                logger.info("Notification sent successfully");
                return ResponseEntity.ok(Map.of("success", true));
            } else {
                return ResponseEntity.badRequest()
                    .body(Map.of("success", false, "error", "Failed to send notification"));
            }

        } catch (Exception ex) {
            logger.severe("Error sending notification: " + ex.getMessage());
            ex.printStackTrace();
            return ResponseEntity.status(500)
                    .body(Map.of("success", false, "error", "Send failed: " + ex.getMessage()));
        }
    }
}