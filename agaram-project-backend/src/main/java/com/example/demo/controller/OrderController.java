package com.example.demo.controller;

import com.example.demo.order.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.Map;
import java.util.List;
import java.util.logging.Logger;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "*")
public class OrderController {

    @Autowired
    private OrderService service;

    private static final Logger logger = Logger.getLogger(OrderController.class.getName());

    // Checkout API (users can place an order)
    @PostMapping("/checkout/{userId}")
    public Object checkout(@PathVariable int userId) {
        try {
            List<Map<String, Object>> cart = service.getCartForUser(userId);
            if (cart == null || cart.isEmpty()) {
                return Map.of("success", false, "error", "Cart is empty");
            }

            int id = service.checkout(userId);
            return Map.of("success", true, "orderId", id);
        } catch (Exception ex) {
            logger.severe("Error during checkout: " + ex.getMessage());
            return Map.of("success", false, "error", "An error occurred while processing your checkout.");
        }
    }

    // API for fetching orders (both regular user and admin)
    @GetMapping("/")
    public Object getAllOrders(@RequestParam("userId") int userId) {
        try {
            if (userId == 1) {
                return service.getOrdersForAdmin();
            }
            return service.getOrders(userId);
        } catch (Exception ex) {
            logger.severe("Error fetching orders for userId " + userId + ": " + ex.getMessage());
            return Map.of("success", false, "error", "Error fetching orders.");
        }
    }

    // New API for fetching all orders for admin (using /all route)
    @GetMapping("/all")
    public Object getAllOrdersForAdmin() {
        try {
            logger.info("Fetching all orders for admin...");
            List<Map<String, Object>> orders = service.getOrdersForAdmin();
            if (orders == null || orders.isEmpty()) {
                return Map.of("success", false, "error", "No orders found for admin.");
            }
            return orders;
        } catch (Exception ex) {
            logger.severe("Error fetching all orders for admin: " + ex.getMessage());
            return Map.of("success", false, "error", "Error fetching all orders for admin.");
        }
    }

    // Update Order Status (only admins can update)
    @PostMapping("/status")
    public Object updateOrderStatus(@RequestBody Map<String, Object> body, @RequestHeader("role") String role) {
        try {
            if (!"ADMIN".equals(role)) {
                return Map.of("success", false, "error", "Unauthorized");
            }

            int orderId = (int) body.get("orderId");
            String status = (String) body.get("status");

            int rows = service.updateOrderStatus(orderId, status);

            if (rows > 0) {
                return Map.of("success", true, "message", "Order status updated successfully.");
            } else {
                return Map.of("success", false, "error", "Order not found.");
            }
        } catch (Exception ex) {
            logger.severe("Error updating order status: " + ex.getMessage());
            return Map.of("success", false, "error", "Failed to update order status.");
        }
    }
}
