package com.example.demo.order.dao;

import java.util.List;
import java.util.Map;

public interface OrderRepository {

    int createOrder(int userId, double totalAmount);

    int insertOrderItem(int orderId, int productId, int qty, double price);

    List<Map<String, Object>> findOrdersByUserId(int userId);

    List<Map<String, Object>> findAllOrders();  // Admin fetch

    List<Map<String, Object>> findOrderItemsByOrderId(int orderId);

    List<Map<String, Object>> findCartByUserId(int userId);

    int decrementStock(int productId, int qty);

    int clearCart(int userId);

    int updateStatus(int orderId, String status);
}
