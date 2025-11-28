package com.example.demo.order.service;

import java.util.List;
import java.util.Map;

public interface OrderService {
    // Existing methods
    int checkout(int userId);
    List<Map<String, Object>> getOrders(int userId);
    List<Map<String, Object>> getOrdersForAdmin();
    int updateOrderStatus(int orderId, String status);
    List<Map<String, Object>> getCartForUser(int userId);
    
    // NEW: Notification methods
    List<Map<String, Object>> getNotificationsByUsername(String username);
    
    // NEW: Permission check
    boolean canUserUpdateStep(String username, String currentStatus);
	List<Map<String, Object>> getOrdersForRoles();
	int sendNotification(int orderId, String username, String message, String status);
	Map<String, Object> getUserPermission(String username);
	String getUserRole(String username);
}