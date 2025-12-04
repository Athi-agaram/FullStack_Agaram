package com.example.demo.controller;

import com.example.demo.returnexchange.service.ReturnExchangeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.logging.Logger;

@RestController
@RequestMapping("/api/returns-exchanges")
@CrossOrigin(origins = "*")
public class ReturnExchangeController {

    @Autowired
    private ReturnExchangeService service;
    
    private static final Logger logger = Logger.getLogger(ReturnExchangeController.class.getName());

    /**
     * Create a new return or exchange request
     * POST /api/returns-exchanges
     */
    @PostMapping
    public ResponseEntity<?> createReturnExchange(@RequestBody Map<String, Object> requestData) {
        try {
            logger.info("Received return/exchange request: " + requestData.get("type"));
            
            int returnExchangeId = service.createReturnExchangeRequest(requestData);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Return/Exchange request submitted successfully");
            response.put("returnExchangeId", returnExchangeId);
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            logger.severe("Error creating return/exchange: " + e.getMessage());
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Failed to create return/exchange request: " + e.getMessage());
            
            return ResponseEntity.status(500).body(response);
        }
    }

    /**
     * Get all return/exchange requests (for all team members)
     * GET /api/returns-exchanges/all
     * 
     * NOTE: This endpoint returns ALL requests. Filtering by role/status
     * should be done on the frontend to ensure team members see notifications.
     */
    @GetMapping("/all")
    public ResponseEntity<?> getAllReturnExchanges() {
        try {
            logger.info("Fetching all return/exchange requests");
            List<Map<String, Object>> returnExchanges = service.getAllReturnExchanges();
            logger.info("Found " + returnExchanges.size() + " return/exchange requests");
            return ResponseEntity.ok(returnExchanges);
        } catch (Exception e) {
            logger.severe("Error fetching return/exchanges: " + e.getMessage());
            return ResponseEntity.status(500).body("Failed to fetch return/exchanges");
        }
    }

    /**
     * Get return/exchange requests for a specific user
     * GET /api/returns-exchanges/user/{userId}
     */
    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getReturnExchangesByUser(@PathVariable int userId) {
        try {
            logger.info("Fetching return/exchange requests for user ID: " + userId);
            List<Map<String, Object>> returnExchanges = service.getReturnExchangesByUserId(userId);
            logger.info("Found " + returnExchanges.size() + " requests for user " + userId);
            return ResponseEntity.ok(returnExchanges);
        } catch (Exception e) {
            logger.severe("Error fetching user return/exchanges: " + e.getMessage());
            return ResponseEntity.status(500).body("Failed to fetch return/exchanges");
        }
    }

    /**
     * Get a specific return/exchange by ID
     * GET /api/returns-exchanges/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<?> getReturnExchangeById(@PathVariable int id) {
        try {
            Map<String, Object> returnExchange = service.getReturnExchangeById(id);
            
            if (returnExchange == null) {
                return ResponseEntity.notFound().build();
            }
            
            return ResponseEntity.ok(returnExchange);
        } catch (Exception e) {
            logger.severe("Error fetching return/exchange: " + e.getMessage());
            return ResponseEntity.status(500).body("Failed to fetch return/exchange");
        }
    }

    /**
     * Admin reviews and approves/rejects return/exchange
     * POST /api/returns-exchanges/{id}/review
     */
    @PostMapping("/{id}/review")
    public ResponseEntity<?> reviewReturnExchange(
            @PathVariable int id,
            @RequestBody Map<String, String> reviewData) {
        try {
            String status = reviewData.get("status"); // APPROVED or REJECTED
            String reviewedBy = reviewData.get("reviewedBy");
            String adminNotes = reviewData.get("adminNotes");
            
            logger.info("Reviewing return/exchange ID: " + id + ", status: " + status + ", by: " + reviewedBy);
            
            int updated = service.reviewReturnExchange(id, status, reviewedBy, adminNotes);
            
            if (updated > 0) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", true);
                response.put("message", "Return/Exchange " + status.toLowerCase() + " successfully");
                
                logger.info("Successfully reviewed return/exchange ID: " + id);
                return ResponseEntity.ok(response);
            } else {
                Map<String, Object> response = new HashMap<>();
                response.put("success", false);
                response.put("message", "Failed to update return/exchange");
                
                return ResponseEntity.status(400).body(response);
            }
            
        } catch (Exception e) {
            logger.severe("Error reviewing return/exchange: " + e.getMessage());
            e.printStackTrace();
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Failed to review return/exchange: " + e.getMessage());
            
            return ResponseEntity.status(500).body(response);
        }
    }

    
    @PostMapping("/{id}/update-progress")
    public ResponseEntity<?> updateProgress(
            @PathVariable int id,
            @RequestBody Map<String, String> updateData) {
        try {
            String status = updateData.get("status");
            String updatedBy = updateData.get("updatedBy");
            String message = updateData.get("message");
            
            // Enhanced logging
            logger.info("=== UPDATE PROGRESS REQUEST ===");
            logger.info("Return/Exchange ID: " + id);
            logger.info("New Status: " + status);
            logger.info("Updated By: " + updatedBy);
            logger.info("Message: " + message);
            logger.info("Raw updateData: " + updateData.toString());
            
            // Validate inputs
            if (status == null || status.trim().isEmpty()) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", false);
                response.put("message", "Status is required");
                return ResponseEntity.status(400).body(response);
            }
            
            if (updatedBy == null || updatedBy.trim().isEmpty()) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", false);
                response.put("message", "Updated by is required");
                return ResponseEntity.status(400).body(response);
            }
            
            int updated = service.updateReturnExchangeProgress(id, status.trim(), updatedBy.trim(), message);
            
            if (updated > 0) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", true);
                response.put("message", "Return/Exchange updated successfully");
                
                logger.info("Successfully updated return/exchange ID: " + id + " to status: " + status);
                return ResponseEntity.ok(response);
            } else {
                Map<String, Object> response = new HashMap<>();
                response.put("success", false);
                response.put("message", "Failed to update return/exchange - no rows affected");
                
                return ResponseEntity.status(400).body(response);
            }
            
        } catch (IllegalArgumentException e) {
            // This catches validation errors from validateStatusTransition
            logger.warning("Validation error updating return/exchange: " + e.getMessage());
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            
            return ResponseEntity.status(400).body(response);
            
        } catch (Exception e) {
            logger.severe("Error updating return/exchange progress: " + e.getMessage());
            e.printStackTrace();
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Failed to update return/exchange: " + e.getMessage());
            
            return ResponseEntity.status(500).body(response);
        }
    }

    @GetMapping("/debug-user-role/{username}")
    public ResponseEntity<?> debugUserRole(@PathVariable String username) {
        String lowerUsername = username.trim().toLowerCase();
        String role;
        
        if (lowerUsername.equals("admin") || lowerUsername.equals("administrator")) {
            role = "ADMIN";
        } else if (lowerUsername.equals("warehouse")) {
            role = "WAREHOUSE";
        } else if (lowerUsername.equals("distributor")) {
            role = "DISTRIBUTOR";
        } else if (lowerUsername.equals("agent")) {
            role = "AGENT";
        } else if (lowerUsername.equals("courier")) {
            role = "COURIER";
        } else {
            role = "USER";
        }
        
        Map<String, Object> response = new HashMap<>();
        response.put("username", username);
        response.put("lowerUsername", lowerUsername);
        response.put("detectedRole", role);
        response.put("expectedForWarehouse", "WAREHOUSE");
        response.put("matches", role.equals("WAREHOUSE"));
        
        logger.info("DEBUG: Username '" + username + "' detected as role: " + role);
        
        return ResponseEntity.ok(response);
    }
}