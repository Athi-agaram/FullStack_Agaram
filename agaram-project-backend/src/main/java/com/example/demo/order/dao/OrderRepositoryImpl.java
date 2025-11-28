package com.example.demo.order.dao;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import java.sql.PreparedStatement;
import java.util.List;
import java.util.Map;
import java.util.logging.Logger;

@Repository
public class OrderRepositoryImpl implements OrderRepository {

    @Autowired
    private JdbcTemplate jdbc;
    
    private static final Logger logger = Logger.getLogger(OrderRepositoryImpl.class.getName());

    @Override
    public List<Map<String, Object>> findAllOrders() {
        String sql =
            "SELECT o.id AS order_id, o.user_id, u.username, o.total_amount, o.status, o.created_at " +
            "FROM orders o " +
            "JOIN users u ON o.user_id = u.id " +
            "ORDER BY o.created_at DESC";

        logger.info("Executing findAllOrders query");
        List<Map<String, Object>> orders = jdbc.queryForList(sql);
        logger.info("Found " + orders.size() + " orders");

        for (Map<String, Object> order : orders) {
            int oid = ((Number) order.get("order_id")).intValue();
            order.put("items", findOrderItemsByOrderId(oid));

            List<Map<String, Object>> notifs = findNotificationsByOrderId(oid);
            if (notifs != null && !notifs.isEmpty()) {
                for (Map<String, Object> n : notifs) {
                    n.putIfAbsent("customer_username", order.get("username"));
                }
            }
            order.put("notifications", notifs);
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

            List<Map<String, Object>> notifs = findNotificationsByOrderId(oid);
            if (notifs != null && !notifs.isEmpty()) {
                for (Map<String, Object> n : notifs) {
                    n.putIfAbsent("customer_username", order.get("username"));
                }
            }
            order.put("notifications", notifs);
        }

        return orders;
    }

    @Override
    public List<Map<String, Object>> findOrderItemsByOrderId(int orderId) {
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

    // =========================
    // Notifications - FIXED
    // =========================

    @Override
    public List<Map<String, Object>> findNotificationsByUsername(String username) {
        String sql =
            "SELECT n.id, n.order_id, n.sender_username, n.message, n.status, n.created_at, " +
            "o.status AS order_status, o.total_amount, o.user_id, u.username AS customer_username, " +
            "(SELECT COUNT(*) FROM order_items oi WHERE oi.order_id = o.id) AS item_count " +
            "FROM notifications n " +
            "JOIN orders o ON n.order_id = o.id " +
            "JOIN users u ON o.user_id = u.id " +
            "WHERE o.status != 'DELIVERED' " +     
            "AND n.id IN (SELECT MAX(id) FROM notifications GROUP BY order_id )";

        return jdbc.queryForList(sql);
    }

    @Override
    public int insertNotification(int orderId, String senderUsername, String message, String status) {
        String sql = 
            "INSERT INTO notifications (order_id, sender_username, message, status, created_at) " +
            "VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)";
        
        logger.info(String.format("Inserting notification: orderId=%d, sender=%s, status=%s", 
            orderId, senderUsername, status));
        
        return jdbc.update(sql, orderId, senderUsername, message, status);
    }

    @Override
    public List<Map<String, Object>> findNotificationsByOrderId(int orderId) {
        String sql = 
            "SELECT id, order_id, sender_username, message, status, created_at " +
            "FROM notifications " +
            "WHERE order_id = ? " +
            "ORDER BY created_at ASC";
        
        return jdbc.queryForList(sql, orderId);
    }

    // =========================
    // Permissions
    // =========================

    @Override
    public Map<String, Object> findUserPermission(String username) {
        String sql = 
            "SELECT username, permission_type, allowed_step, can_update_any " +
            "FROM user_permissions " +
            "WHERE LOWER(username) = LOWER(?)";
        
        List<Map<String, Object>> results = jdbc.queryForList(sql, username);
        return results.isEmpty() ? null : results.get(0);
    }

    @Override
    public boolean canUserUpdateStep(String username, String currentStatus) {
        if (username == null || currentStatus == null) {
            return false;
        }
        
        Map<String, Object> perm = findUserPermission(username);
        
        if (perm == null) {
            logger.info("No permission found for username: " + username);
            return false;
        }

        // Check if user is admin (can_update_any = 1 or true)
        Object canUpdateAnyObj = perm.get("can_update_any");
        boolean canUpdateAny = false;
        
        if (canUpdateAnyObj instanceof Boolean) {
            canUpdateAny = ((Boolean) canUpdateAnyObj).booleanValue();
        } else if (canUpdateAnyObj instanceof Number) {
            canUpdateAny = ((Number) canUpdateAnyObj).intValue() == 1;
        }

        if (canUpdateAny) {
            logger.info("User '" + username + "' is admin - can update any step");
            return true;
        }

        // Check if allowed_step matches current status
        String allowedStep = perm.get("allowed_step") == null ? null : perm.get("allowed_step").toString();
        
        if (allowedStep != null && allowedStep.equalsIgnoreCase(currentStatus)) {
            logger.info("User '" + username + "' can update step: " + currentStatus);
            return true;
        }
        
        logger.info("User '" + username + "' cannot update step: " + currentStatus + " (allowed: " + allowedStep + ")");
        return false;
    }
    @Override
    public int runRawSqlDelete(String sql, int orderId) {
        return jdbc.update(sql, orderId);
    }
    @Override
    public int deleteOldNotificationsExceptLatest(int orderId) {
        String sql =
            "DELETE FROM notifications WHERE order_id = ? " +
            "AND id NOT IN (SELECT TOP 1 id FROM notifications WHERE order_id = ? ORDER BY created_at DESC)";
        return jdbc.update(sql, orderId, orderId);
    }


}