package com.example.demo.order.service;

import java.util.List;
import java.util.Map;

public interface OrderService {

    int checkout(int userId);

    List<Map<String, Object>> getOrders(int userId);

    List<Map<String, Object>> getOrdersForAdmin();

    int updateOrderStatus(int orderId, String status);

    List<Map<String, Object>> getCartForUser(int userId);
}
