package com.example.demo.order.dao;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import java.sql.PreparedStatement;
import java.util.List;
import java.util.Map;

@Repository
public class OrderRepositoryImpl implements OrderRepository {

    @Autowired
    private JdbcTemplate jdbc;

    @Override
    public List<Map<String, Object>> findAllOrders() {
        String sql =
                "SELECT o.id AS order_id, o.user_id, u.username, o.total_amount, o.status, o.created_at " +
                "FROM orders o " +
                "JOIN users u ON o.user_id = u.id " +
                "ORDER BY o.created_at DESC";

        List<Map<String, Object>> orders = jdbc.queryForList(sql);

        for (Map<String, Object> order : orders) {
            int oid = ((Number) order.get("order_id")).intValue();
            order.put("items", findOrderItemsByOrderId(oid));
        }

        return orders;
    }

    @Override
    public int createOrder(int userId, double totalAmount) {
        String sql = "INSERT INTO orders (user_id, total_amount, status, created_at) " +
                     "VALUES (?, ?, 'PLACED', CURRENT_TIMESTAMP)";

        KeyHolder keyHolder = new GeneratedKeyHolder();

        jdbc.update(conn -> {
            PreparedStatement ps = conn.prepareStatement(sql, new String[]{"id"});
            ps.setInt(1, userId);
            ps.setDouble(2, totalAmount);
            return ps;
        }, keyHolder);

        return keyHolder.getKey().intValue();
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
        // Use parameterized query to prevent SQL injection
        String sql =
                "SELECT o.id AS order_id, o.user_id, u.username, o.total_amount, o.status, o.created_at " +
                "FROM orders o " +
                "JOIN users u ON o.user_id = u.id " +
                "WHERE o.user_id = ? " +
                "ORDER BY o.created_at DESC";

        List<Map<String, Object>> orders = jdbc.queryForList(sql, userId);

        for (Map<String, Object> order : orders) {
            int oid = ((Number) order.get("order_id")).intValue();
            order.put("items", findOrderItemsByOrderId(oid));
        }

        return orders;
    }

    @Override
    public List<Map<String, Object>> findOrderItemsByOrderId(int orderId) {
        // Use parameterized query
        String sql =
                "SELECT oi.id AS item_id, oi.product_id, oi.qty, oi.price, " +
                "p.name AS product_name, p.image AS product_image " +
                "FROM order_items oi " +
                "JOIN storeproducts p ON oi.product_id = p.id " +
                "WHERE oi.order_id = ?";

        return jdbc.queryForList(sql, orderId);
    }

    @Override
    public List<Map<String, Object>> findCartByUserId(int userId) {
        // Use parameterized query
        String sql =
                "SELECT c.id AS cart_id, c.product_id, c.qty, p.price, p.name, p.image " +
                "FROM cart c " +
                "JOIN storeproducts p ON c.product_id = p.id " +
                "WHERE c.user_id = ? AND c.is_saved = 0";

        return jdbc.queryForList(sql, userId);
    }

    @Override
    public int decrementStock(int productId, int qty) {
        return jdbc.update(
                "UPDATE storeproducts SET stock = stock - ? WHERE id = ? AND stock >= ?",
                qty, productId, qty
        );
    }

    @Override
    public int clearCart(int userId) {
        return jdbc.update("DELETE FROM cart WHERE user_id = ? AND is_saved = 0", userId);
    }

    @Override
    public int updateStatus(int orderId, String status) {
        return jdbc.update("UPDATE orders SET status = ? WHERE id = ?", status, orderId);
    }
}