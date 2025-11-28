package com.example.demo.order.dao;

import java.util.List;
import java.util.Map;

public interface OrderRepository {
    // Existing methods
    List<Map<String, Object>> findAllOrders();
    int createOrder(int userId, double totalAmount);
    int insertOrderItem(int orderId, int productId, int qty, double price);
    List<Map<String, Object>> findOrdersByUserId(int userId);
    List<Map<String, Object>> findOrderItemsByOrderId(int orderId);
    List<Map<String, Object>> findCartByUserId(int userId);
    int decrementStock(int productId, int qty);
    int clearCart(int userId);
    int updateStatus(int orderId, String status);
    int runRawSqlDelete(String sql, int orderId);
    int deleteOldNotificationsExceptLatest(int orderId);

    // Notifications
    List<Map<String, Object>> findNotificationsByUsername(String username);
    int insertNotification(int orderId, String senderUsername, String message, String status);
    List<Map<String, Object>> findNotificationsByOrderId(int orderId);
    
    // Permissions
    Map<String, Object> findUserPermission(String username);
    boolean canUserUpdateStep(String username, String currentStatus);
}