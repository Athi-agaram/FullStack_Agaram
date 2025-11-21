package com.example.demo.order.dao;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.PreparedStatementCreator;
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
        // Updated query with the correct column name 'username'
        String sql = "SELECT o.*, u.username FROM orders o JOIN users u ON o.user_id = u.id ORDER BY o.created_at DESC";
        List<Map<String, Object>> orders = jdbc.queryForList(sql);
        System.out.println("Fetched " + orders.size() + " orders for admin");
        return orders;
    }

    @Override
    public int createOrder(int userId, double totalAmount) {
        String sql = "INSERT INTO orders (user_id, total_amount, status, created_at) VALUES (?, ?, 'PLACED', CURRENT_TIMESTAMP)";
        
        // Create a KeyHolder to store the generated keys
        KeyHolder keyHolder = new GeneratedKeyHolder();
        
        // Using PreparedStatementCreator to pass the query with parameters
        jdbc.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(sql, new String[]{"id"});
            ps.setInt(1, userId);
            ps.setDouble(2, totalAmount);
            return ps;
        }, keyHolder);

        // Return the generated order ID
        return keyHolder.getKey().intValue();
    }

    @Override
    public int insertOrderItem(int orderId, int productId, int qty, double price) {
        String sql = "INSERT INTO order_items (order_id, product_id, qty, price) VALUES (?, ?, ?, ?)";
        return jdbc.update(sql, orderId, productId, qty, price);
    }

    @Override
    public List<Map<String, Object>> findOrdersByUserId(int userId) {
        String sql = "SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC";
        List<Map<String, Object>> orders = jdbc.queryForList(sql, userId);

        // Attach items for each order
        for (Map<String, Object> order : orders) {
            int orderId = (int) order.get("id");
            order.put("items", findOrderItemsByOrderId(orderId));
        }

        return orders;
    }

    @Override
    public List<Map<String, Object>> findOrderItemsByOrderId(int orderId) {
        String sql = "SELECT oi.*, p.name, p.image FROM order_items oi JOIN storeproducts p ON oi.product_id = p.id WHERE oi.order_id = ?";
        return jdbc.queryForList(sql, orderId);
    }

    @Override
    public List<Map<String, Object>> findCartByUserId(int userId) {
        String sql = "SELECT c.id AS cart_id, c.product_id, c.qty, p.price, p.name, p.image " +
                     "FROM cart c JOIN storeproducts p ON c.product_id = p.id " +
                     "WHERE c.user_id = ? AND c.is_saved = 0";
        return jdbc.queryForList(sql, userId);
    }

    @Override
    public int decrementStock(int productId, int qty) {
        String sql = "UPDATE storeproducts SET stock = stock - ? WHERE id = ? AND stock >= ?";
        return jdbc.update(sql, qty, productId, qty);
    }

    @Override
    public int clearCart(int userId) {
        String sql = "DELETE FROM cart WHERE user_id = ? AND is_saved = 0";
        return jdbc.update(sql, userId);
    }

    @Override
    public int updateStatus(int orderId, String status) {
        String sql = "UPDATE orders SET status = ? WHERE id = ?";
        return jdbc.update(sql, status, orderId);
    }
}
