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
@CrossOrigin(origins = "*")
public class OrderController {

    @Autowired
    private OrderService service;

    private static final Logger logger = Logger.getLogger(OrderController.class.getName());

    // === CHECKOUT ===
    @PostMapping("/checkout/{userId}")
    public ResponseEntity<?> checkout(@PathVariable int userId) {
        try {
            List<Map<String, Object>> cart = service.getCartForUser(userId);
            if (cart == null || cart.isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(Map.of("success", false, "error", "Cart is empty"));
            }

            int id = service.checkout(userId);
            return ResponseEntity.ok(Map.of("success", true, "orderId", id));
        } catch (Exception ex) {
            logger.severe("Error during checkout: " + ex.getMessage());
            ex.printStackTrace();
            return ResponseEntity.status(500)
                .body(Map.of("success", false, "error", "Checkout failed: " + ex.getMessage()));
        }
    }

    // === FETCH ORDERS (USER or ADMIN) ===
    @GetMapping("/{userId}")
    public ResponseEntity<?> getOrders(
            @PathVariable int userId,
            @RequestHeader(value = "role", required = false) String role
    ) {
        try {
            if ("ADMIN".equalsIgnoreCase(role)) {
                return ResponseEntity.ok(service.getOrdersForAdmin());
            }

            return ResponseEntity.ok(service.getOrders(userId));

        } catch (Exception ex) {
            logger.severe("Error fetching orders: " + ex.getMessage());
            return ResponseEntity.status(500)
                .body(Map.of("success", false, "error", "Could not fetch orders"));
        }
    }

    // === UPDATE ORDER STATUS (FIXED ENDPOINT) ===
    @PutMapping("/status")
    public ResponseEntity<?> updateOrderStatus(
            @RequestBody Map<String, Object> body,
            @RequestHeader(value = "role", required = false) String role    ) {
        try {
            if (!"ADMIN".equalsIgnoreCase(role)) {
                return ResponseEntity.status(403)
                    .body(Map.of("success", false, "error", "Unauthorized"));
            }

            int orderId = ((Number) body.get("orderId")).intValue();
            String status = (String) body.get("status");
            
            int rows = service.updateOrderStatus(orderId, status);

            return rows > 0
                    ? ResponseEntity.ok(Map.of("success", true))
                    : ResponseEntity.badRequest()
                        .body(Map.of("success", false, "error", "Order not found"));

        } catch (Exception ex) {
            logger.severe("Error updating order status: " + ex.getMessage());
            return ResponseEntity.status(500)
                .body(Map.of("success", false, "error", "Update failed: " + ex.getMessage()));
        }
    }
}