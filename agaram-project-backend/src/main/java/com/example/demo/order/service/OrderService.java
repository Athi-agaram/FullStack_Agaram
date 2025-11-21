package com.example.demo.order.service;

import java.util.List;
import java.util.Map;

public interface OrderService {

    // Method for placing an order (checkout)
    int checkout(int userId);
    
    // Method for fetching orders for a specific user (regular user orders)
    List<Map<String, Object>> getOrders(int userId); 
    
    // Method for fetching all orders for admin (with usernames)
    List<Map<String, Object>> getOrdersForAdmin();  // Admin's orders with usernames
    
    // Method for updating order status (only admins can update)
    int updateOrderStatus(int orderId, String status);
    
    // Method for fetching the cart items for a user
    List<Map<String, Object>> getCartForUser(int userId); 
    
    // Admin's method to fetch all orders with user details (already included in getOrdersForAdmin)
    List<Map<String, Object>> getAllOrdersWithUsernames();  // This can be same as getOrdersForAdmin, hence removed if unnecessary
}
