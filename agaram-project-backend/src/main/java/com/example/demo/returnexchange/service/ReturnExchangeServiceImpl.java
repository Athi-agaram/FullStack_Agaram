package com.example.demo.returnexchange.service;

import com.example.demo.returnexchange.dao.ReturnExchangeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.logging.Logger;

@Service
public class ReturnExchangeServiceImpl implements ReturnExchangeService {

    @Autowired
    private ReturnExchangeRepository repository;
    
    private static final Logger logger = Logger.getLogger(ReturnExchangeServiceImpl.class.getName());

    @Override
    @Transactional
    public int createReturnExchangeRequest(Map<String, Object> requestData) {
        try {
            // Extract main request data
            int orderId = ((Number) requestData.get("orderId")).intValue();
            int userId = ((Number) requestData.get("userId")).intValue();
            String username = (String) requestData.get("username");
            String type = (String) requestData.get("type"); // RETURN or EXCHANGE
            String reason = (String) requestData.get("reason");
            
            logger.info("Creating return/exchange request - Order: " + orderId + ", User: " + username + ", Type: " + type);
            
            // Create the main return/exchange record
            int returnExchangeId = repository.createReturnExchange(orderId, userId, username, type, reason);
            
            // Insert items
            @SuppressWarnings("unchecked")
            List<Map<String, Object>> items = (List<Map<String, Object>>) requestData.get("items");
            
            if (items != null && !items.isEmpty()) {
                for (Map<String, Object> item : items) {
                    int orderItemId = ((Number) item.get("orderItemId")).intValue();
                    int productId = ((Number) item.get("productId")).intValue();
                    String productName = (String) item.get("productName");
                    int qty = ((Number) item.get("qty")).intValue();
                    double price = ((Number) item.get("price")).doubleValue();
                    
                    Integer exchangeProductId = null;
                    String exchangeProductName = null;
                    
                    if ("EXCHANGE".equalsIgnoreCase(type)) {
                        if (item.get("exchangeProductId") != null) {
                            exchangeProductId = ((Number) item.get("exchangeProductId")).intValue();
                        }
                        exchangeProductName = (String) item.get("exchangeProductName");
                    }
                    
                    repository.insertReturnExchangeItem(
                        returnExchangeId, 
                        orderItemId, 
                        productId, 
                        productName, 
                        qty, 
                        price, 
                        exchangeProductId, 
                        exchangeProductName
                    );
                    
                    logger.info("Inserted item: " + productName + " (ID: " + productId + ")");
                }
            }
            
            // Insert images
            @SuppressWarnings("unchecked")
            List<String> images = (List<String>) requestData.get("images");
            
            if (images != null && !images.isEmpty()) {
                for (String imageData : images) {
                    repository.insertReturnExchangeImage(returnExchangeId, imageData);
                }
                logger.info("Inserted " + images.size() + " images");
            }
            
            // Create notification for USER - confirmation that request was sent
            String userMessage = "Your " + type.toLowerCase() + " request for Order #" + orderId + 
                " has been submitted successfully. The administrator will review your request shortly.";
            
            repository.insertReturnExchangeNotification(
                returnExchangeId, 
                "SYSTEM", 
                userMessage, 
                "PENDING"
            );
            
            // Create notification for ADMIN - new request to review
            String adminMessage = "New " + type.toLowerCase() + " request #" + returnExchangeId + 
                " from customer " + username + " for Order #" + orderId + 
                ". Please review and approve or reject this request.";
            
            repository.insertReturnExchangeNotification(
                returnExchangeId, 
                "SYSTEM", 
                adminMessage, 
                "PENDING"
            );
            
            logger.info("Successfully created return/exchange request with ID: " + returnExchangeId);
            
            return returnExchangeId;
            
        } catch (Exception e) {
            logger.severe("Error creating return/exchange request: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Failed to create return/exchange request", e);
        }
    }

    @Override
    public List<Map<String, Object>> getAllReturnExchanges() {
        try {
            logger.info("Fetching all return/exchange requests");
            return repository.findAllReturnExchanges();
        } catch (Exception e) {
            logger.severe("Error fetching all return/exchanges: " + e.getMessage());
            throw new RuntimeException("Failed to fetch return/exchanges", e);
        }
    }

    @Override
    public List<Map<String, Object>> getReturnExchangesByUserId(int userId) {
        try {
            logger.info("Fetching return/exchange requests for user ID: " + userId);
            return repository.findReturnExchangesByUserId(userId);
        } catch (Exception e) {
            logger.severe("Error fetching return/exchanges for user " + userId + ": " + e.getMessage());
            throw new RuntimeException("Failed to fetch return/exchanges for user", e);
        }
    }

    @Override
    public Map<String, Object> getReturnExchangeById(int returnExchangeId) {
        try {
            logger.info("Fetching return/exchange with ID: " + returnExchangeId);
            return repository.findReturnExchangeById(returnExchangeId);
        } catch (Exception e) {
            logger.severe("Error fetching return/exchange " + returnExchangeId + ": " + e.getMessage());
            throw new RuntimeException("Failed to fetch return/exchange", e);
        }
    }

    @Override
    @Transactional
    public int reviewReturnExchange(int returnExchangeId, String status, String reviewedBy, String adminNotes) {
        try {
            logger.info("Admin review - ID: " + returnExchangeId + ", Status: " + status + ", Reviewer: " + reviewedBy);
            
            // Validate status
            if (!status.equalsIgnoreCase("APPROVED") && !status.equalsIgnoreCase("REJECTED")) {
                throw new IllegalArgumentException("Invalid status. Must be APPROVED or REJECTED");
            }
            
            // Get the return/exchange details
            Map<String, Object> returnExchange = repository.findReturnExchangeById(returnExchangeId);
            if (returnExchange == null) {
                throw new IllegalArgumentException("Return/Exchange not found with ID: " + returnExchangeId);
            }
            
            int orderId = ((Number) returnExchange.get("order_id")).intValue();
            String customerUsername = (String) returnExchange.get("username");
            String type = (String) returnExchange.get("type");
            
            // Update the main return/exchange status
            int updated = repository.updateReturnExchangeStatus(
                returnExchangeId, 
                status.toUpperCase(), 
                reviewedBy, 
                adminNotes
            );
            
            if (updated > 0) {
                if (status.equalsIgnoreCase("APPROVED")) {
                    // Notify CUSTOMER about approval
                    String customerMessage = "Great news! Your " + type.toLowerCase() + " request #" + returnExchangeId + 
                        " for Order #" + orderId + " has been approved by the administrator. " +
                        "A courier will contact you soon for pickup." +
                        (adminNotes != null && !adminNotes.trim().isEmpty() ? " Admin note: " + adminNotes : "");
                    
                    repository.insertReturnExchangeNotification(
                        returnExchangeId, 
                        reviewedBy, 
                        customerMessage, 
                        "APPROVED"
                    );
                    
                    // Notify COURIER for pickup (next step in workflow)
                    String courierMessage = "COURIER ACTION REQUIRED: Administrator has approved " + type.toLowerCase() + 
                        " request #" + returnExchangeId + " for Order #" + orderId + 
                        " from customer " + customerUsername + ". " +
                        "Please arrange pickup and update the status to 'PICKED_UP' once completed.";
                    
                    repository.insertReturnExchangeNotification(
                        returnExchangeId,
                        "SYSTEM",
                        courierMessage,
                        "APPROVED"
                    );
                    
                    logger.info("Sent approval notifications to customer and courier for return/exchange ID: " + returnExchangeId);
                    
                } else {
                    // REJECTED
                    String customerMessage = "Your " + type.toLowerCase() + " request #" + returnExchangeId + 
                        " for Order #" + orderId + " has been rejected by the administrator." +
                        (adminNotes != null && !adminNotes.trim().isEmpty() ? " Reason: " + adminNotes : "");
                    
                    repository.insertReturnExchangeNotification(
                        returnExchangeId, 
                        reviewedBy, 
                        customerMessage, 
                        "REJECTED"
                    );
                    
                    logger.info("Sent rejection notification to customer for return/exchange ID: " + returnExchangeId);
                }
                
                logger.info("Successfully reviewed return/exchange ID: " + returnExchangeId);
            }
            
            return updated;
            
        } catch (Exception e) {
            logger.severe("Error reviewing return/exchange " + returnExchangeId + ": " + e.getMessage());
            throw new RuntimeException("Failed to review return/exchange", e);
        }
    }


    @Override
    @Transactional
    public int updateReturnExchangeProgress(int returnExchangeId, String status, String updatedBy, String message) {
        try {
            logger.info("=== UPDATE PROGRESS START ===");
            logger.info("Return/Exchange ID: " + returnExchangeId);
            logger.info("New Status: " + status);
            logger.info("Updated By: " + updatedBy);
            logger.info("Message: " + message);
            
            // Get the return/exchange details
            Map<String, Object> returnExchange = repository.findReturnExchangeById(returnExchangeId);
            if (returnExchange == null) {
                throw new IllegalArgumentException("Return/Exchange not found with ID: " + returnExchangeId);
            }
            
            int orderId = ((Number) returnExchange.get("order_id")).intValue();
            String type = (String) returnExchange.get("type");
            String currentStatus = (String) returnExchange.get("status");
            String customerUsername = (String) returnExchange.get("username");
            
            logger.info("Current Status: " + currentStatus);
            logger.info("Customer: " + customerUsername);
            
            // Normalize statuses
            String normalizedCurrentStatus = currentStatus.trim().toUpperCase();
            String normalizedNewStatus = status.trim().toUpperCase();
            
            // Validate status transitions (without role check)
            validateStatusTransition(normalizedCurrentStatus, normalizedNewStatus);
            
            // Validate user role for this transition
            validateUserRole(updatedBy, normalizedCurrentStatus, normalizedNewStatus);
            
            logger.info("Validation passed. Updating status...");
            
            // Update the status
            int updated = repository.updateReturnExchangeStatus(
                returnExchangeId, 
                normalizedNewStatus, 
                updatedBy, 
                null // No admin notes for progress updates
            );
            
            if (updated > 0) {
                // Create customer notification
                String customerMessage = message != null && !message.trim().isEmpty() 
                    ? message 
                    : getDefaultCustomerMessage(normalizedNewStatus, type, orderId);
                
                repository.insertReturnExchangeNotification(
                    returnExchangeId, 
                    updatedBy, 
                    customerMessage, 
                    normalizedNewStatus
                );
                
                // Notify next team member in the workflow
                notifyNextTeamMember(returnExchangeId, normalizedNewStatus, orderId, type, customerUsername);
                
                logger.info("Successfully updated progress for return/exchange ID: " + returnExchangeId);
            }
            
            return updated;
            
        } catch (IllegalArgumentException e) {
            logger.warning("Validation error: " + e.getMessage());
            throw e; // Re-throw to be caught by controller
        } catch (Exception e) {
            logger.severe("Error updating return/exchange progress " + returnExchangeId + ": " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Failed to update return/exchange progress", e);
        }
    }

    /**
     * Validate status transitions based on workflow
     * This only checks if the transition itself is valid, not the user role
     */
    private void validateStatusTransition(String currentStatus, String newStatus) {
        if (currentStatus == null || newStatus == null) {
            throw new IllegalArgumentException("Status cannot be null");
        }
        
        logger.info("Validating transition: " + currentStatus + " -> " + newStatus);
        
        // Define valid transitions
        switch (currentStatus) {
            case "APPROVED":
                if (!newStatus.equals("PICKED_UP")) {
                    throw new IllegalArgumentException("From APPROVED, can only transition to PICKED_UP");
                }
                break;
            case "PICKED_UP":
                if (!newStatus.equals("IN_TRANSIT_TO_WAREHOUSE")) {
                    throw new IllegalArgumentException("From PICKED_UP, can only transition to IN_TRANSIT_TO_WAREHOUSE");
                }
                break;
            case "IN_TRANSIT_TO_WAREHOUSE":
                if (!newStatus.equals("RECEIVED_AT_WAREHOUSE")) {
                    throw new IllegalArgumentException("From IN_TRANSIT_TO_WAREHOUSE, can only transition to RECEIVED_AT_WAREHOUSE");
                }
                break;
            case "RECEIVED_AT_WAREHOUSE":
                if (!newStatus.equals("QUALITY_CHECK_PASSED") && !newStatus.equals("QUALITY_CHECK_FAILED")) {
                    throw new IllegalArgumentException("From RECEIVED_AT_WAREHOUSE, can only transition to QUALITY_CHECK_PASSED or QUALITY_CHECK_FAILED");
                }
                break;
            case "QUALITY_CHECK_PASSED":
                if (!newStatus.equals("COMPLETED")) {
                    throw new IllegalArgumentException("From QUALITY_CHECK_PASSED, can only transition to COMPLETED");
                }
                break;
            case "QUALITY_CHECK_FAILED":
                if (!newStatus.equals("CANCELLED")) {
                    throw new IllegalArgumentException("From QUALITY_CHECK_FAILED, can only transition to CANCELLED");
                }
                break;
            case "REJECTED":
            case "COMPLETED":
            case "CANCELLED":
                throw new IllegalArgumentException("Cannot update a " + currentStatus + " request");
            default:
                throw new IllegalArgumentException("Invalid current status: " + currentStatus);
        }
        
        logger.info("Status transition is valid");
    }

    /**
     * Validate that the user has permission to make this status transition
     */
    private void validateUserRole(String username, String currentStatus, String newStatus) {
        if (username == null || username.trim().isEmpty()) {
            throw new IllegalArgumentException("Username cannot be null or empty");
        }
        
        String lowerUsername = username.trim().toLowerCase();
        String userRole = getUserRole(lowerUsername);
        
        logger.info("User role: " + userRole + " for username: " + username);
        
        // Define which roles can make which transitions
        switch (currentStatus) {
            case "APPROVED":
                if (!userRole.equals("COURIER")) {
                    throw new IllegalArgumentException("Only COURIER can update from APPROVED to PICKED_UP. Your role: " + userRole);
                }
                break;
            case "PICKED_UP":
                if (!userRole.equals("AGENT")) {
                    throw new IllegalArgumentException("Only AGENT can update from PICKED_UP to IN_TRANSIT_TO_WAREHOUSE. Your role: " + userRole);
                }
                break;
            case "IN_TRANSIT_TO_WAREHOUSE":
                if (!userRole.equals("DISTRIBUTOR")) {
                    throw new IllegalArgumentException("Only DISTRIBUTOR can update from IN_TRANSIT_TO_WAREHOUSE to RECEIVED_AT_WAREHOUSE. Your role: " + userRole);
                }
                break;
            case "RECEIVED_AT_WAREHOUSE":
                if (!userRole.equals("WAREHOUSE")) {
                    throw new IllegalArgumentException("Only WAREHOUSE can update from RECEIVED_AT_WAREHOUSE to quality check status. Your role: " + userRole);
                }
                break;
            case "QUALITY_CHECK_PASSED":
                if (!userRole.equals("WAREHOUSE")) {
                    throw new IllegalArgumentException("Only WAREHOUSE can mark as COMPLETED. Your role: " + userRole);
                }
                break;
            default:
                // No specific role restriction for other transitions
                break;
        }
        
        logger.info("User role validation passed");
    }

    /**
     * Determine user role based on username
     */
    private String getUserRole(String username) {
        if (username == null) return "USER";
        
        String lower = username.toLowerCase();
        
        if (lower.equals("admin") || lower.equals("administrator")) return "ADMIN";
        if (lower.equals("warehouse")) return "WAREHOUSE";
        if (lower.equals("distributor")) return "DISTRIBUTOR";
        if (lower.equals("agent")) return "AGENT";
        if (lower.equals("courier")) return "COURIER";
        
        return "USER";
    }

    /**
     * Notify the next team member in the sequential workflow
     */
    private void notifyNextTeamMember(int returnExchangeId, String status, int orderId, String type, String customerUsername) {
        String teamMessage = "";
        
        switch (status) {
            case "PICKED_UP":
                teamMessage = "AGENT ACTION REQUIRED: Item for " + type.toLowerCase() + " request #" + 
                    returnExchangeId + " (Order #" + orderId + " from customer " + customerUsername + 
                    ") has been picked up by courier. " +
                    "Please update status to 'IN_TRANSIT_TO_WAREHOUSE' when you begin transport.";
                break;
                
            case "IN_TRANSIT_TO_WAREHOUSE":
                teamMessage = "DISTRIBUTOR ACTION REQUIRED: Item for " + type.toLowerCase() + " request #" + 
                    returnExchangeId + " (Order #" + orderId + " from customer " + customerUsername + 
                    ") is in transit to warehouse. " +
                    "Please update status to 'RECEIVED_AT_WAREHOUSE' once the item arrives.";
                break;
                
            case "RECEIVED_AT_WAREHOUSE":
                teamMessage = "WAREHOUSE ACTION REQUIRED: Item for " + type.toLowerCase() + " request #" + 
                    returnExchangeId + " (Order #" + orderId + " from customer " + customerUsername + 
                    ") has been received at warehouse. " +
                    "Please perform quality check and update status accordingly.";
                break;
                
            case "QUALITY_CHECK_PASSED":
                teamMessage = "WAREHOUSE ACTION: Quality check passed for " + type.toLowerCase() + " request #" + 
                    returnExchangeId + " (Order #" + orderId + "). " +
                    "Please mark as COMPLETED to finalize the request.";
                break;
                
            case "COMPLETED":
                teamMessage = "Your " + type.toLowerCase() + " request #" + returnExchangeId + 
                    " for Order #" + orderId + " has been completed successfully. " +
                    (type.equalsIgnoreCase("RETURN") 
                        ? "Your refund will be processed within 5-7 business days." 
                        : "Thank you for your patience with the exchange process.");
                break;
                
            case "QUALITY_CHECK_FAILED":
                teamMessage = "Unfortunately, the item(s) for your " + type.toLowerCase() + " request #" + 
                    returnExchangeId + " (Order #" + orderId + ") did not pass quality inspection. " +
                    "Our customer service team will contact you shortly to discuss next steps.";
                break;
                
            default:
                return;
        }
        
        if (!teamMessage.isEmpty()) {
            repository.insertReturnExchangeNotification(
                returnExchangeId,
                "SYSTEM",
                teamMessage,
                status
            );
            logger.info("Sent notification for status " + status + " on return/exchange ID: " + returnExchangeId);
        }
    }

    /**
     * Get default customer message for status updates
     */
    private String getDefaultCustomerMessage(String status, String type, int orderId) {
        switch (status) {
            case "PICKED_UP":
                return "Update: Your " + type.toLowerCase() + " item for Order #" + orderId + 
                    " has been picked up successfully and is now being processed.";
                    
            case "IN_TRANSIT_TO_WAREHOUSE":
                return "Update: Your " + type.toLowerCase() + " item for Order #" + orderId + 
                    " is in transit to our warehouse.";
                    
            case "RECEIVED_AT_WAREHOUSE":
                return "Update: Your " + type.toLowerCase() + " item for Order #" + orderId + 
                    " has been received at our warehouse and will undergo quality inspection shortly.";
                    
            case "QUALITY_CHECK_PASSED":
                return "Good news! Your returned item for Order #" + orderId + 
                    " has passed quality inspection. " + 
                    (type.equalsIgnoreCase("RETURN") 
                        ? "Your refund will be processed shortly." 
                        : "Your exchange item will be prepared for dispatch.");
                        
            case "QUALITY_CHECK_FAILED":
                return "Unfortunately, your returned item for Order #" + orderId + 
                    " did not pass quality inspection. Our customer service team will contact you.";
                    
            case "COMPLETED":
                return "Your " + type.toLowerCase() + " request for Order #" + orderId + 
                    " has been completed successfully. Thank you for your patience!";
                    
            default:
                return "Status updated to: " + status.replace("_", " ");
        }
    }
}