package com.example.demo.order.dao;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

@Repository
public class OrderRepositoryImpl implements OrderRepository {

    @Autowired
    private JdbcTemplate jdbc;

    @Override
    public int createOrder(int userId, double totalAmount) {
        String sql = "INSERT INTO orders (user_id, total_amount, created_at) OUTPUT INSERTED.id VALUES (?, ?, GETDATE())";
        return jdbc.queryForObject(sql, Integer.class, userId, totalAmount);
    }

    @Override
    public int insertOrderItem(int orderId, int productId, int qty, double price) {
        return jdbc.update(
                "INSERT INTO order_items (order_id, product_id, qty, price) VALUES (?, ?, ?, ?)",
                orderId, productId, qty, price
        );
    }

    @Override
    public List<Map<String, Object>> findOrdersByUserId(int userId) {
        List<Map<String, Object>> orders = jdbc.queryForList(
                "SELECT id, user_id, total_amount, created_at FROM orders WHERE user_id = ? ORDER BY created_at DESC",
                userId
        );

        // For each order, fetch items
        for (Map<String, Object> order : orders) {
            int orderId = (Integer) order.get("id");
            List<Map<String, Object>> items = findOrderItemsByOrderId(orderId);
            order.put("items", items);
        }

        return orders;
    }

    @Override
    public List<Map<String, Object>> findOrderItemsByOrderId(int orderId) {
        return jdbc.queryForList(
                "SELECT oi.id, oi.order_id, oi.product_id, oi.qty, oi.price, " +
                        "p.name, p.image, p.stock " +
                        "FROM order_items oi " +
                        "JOIN storeproducts p ON oi.product_id = p.id " +
                        "WHERE oi.order_id = ?",
                orderId
        );
    }

    @Override
    public List<Map<String, Object>> findCartByUserId(int userId) {
        return jdbc.queryForList(
                "SELECT c.id AS cart_id, c.product_id, c.qty, p.price, p.name, p.image " +
                        "FROM cart c JOIN storeproducts p ON c.product_id = p.id " +
                        "WHERE c.user_id = ?",
                userId
        );
    }

    @Override
    public int decrementProductStockIfAvailable(int productId, int qty) {
        return jdbc.update(
                "UPDATE storeproducts SET stock = stock - ? WHERE id = ? AND stock >= ?",
                qty, productId, qty
        );
    }

    @Override
    public int clearCartByUserId(int userId) {
        return jdbc.update("DELETE FROM cart WHERE user_id = ? AND is_saved = 0", userId);
    }
}
