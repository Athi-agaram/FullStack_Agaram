package com.example.demo.returnexchange.dao;

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
public class ReturnExchangeRepositoryImpl implements ReturnExchangeRepository {

    @Autowired
    private JdbcTemplate jdbc;
    
    private static final Logger logger = Logger.getLogger(ReturnExchangeRepositoryImpl.class.getName());

    @Override
    public int createReturnExchange(int orderId, int userId, String username, String type, String reason) {
        String sql = 
            "INSERT INTO returns_exchanges (order_id, user_id, username, type, status, reason, created_at, updated_at) " +
            "VALUES (?, ?, ?, ?, 'PENDING', ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)";

        KeyHolder keyHolder = new GeneratedKeyHolder();

        jdbc.update(conn -> {
            PreparedStatement ps = conn.prepareStatement(sql, new String[]{"id"});
            ps.setInt(1, orderId);
            ps.setInt(2, userId);
            ps.setString(3, username);
            ps.setString(4, type);
            ps.setString(5, reason);
            return ps;
        }, keyHolder);

        int returnExchangeId = keyHolder.getKey().intValue();
        logger.info("Created return/exchange with ID: " + returnExchangeId);
        
        return returnExchangeId;
    }

    @Override
    public int insertReturnExchangeItem(int returnExchangeId, int orderItemId, int productId, 
                                        String productName, int qty, double price, 
                                        Integer exchangeProductId, String exchangeProductName) {
        String sql = 
            "INSERT INTO return_exchange_items " +
            "(return_exchange_id, order_item_id, product_id, product_name, qty, price, exchange_product_id, exchange_product_name) " +
            "VALUES (?, ?, ?, ?, ?, ?, ?, ?)";

        return jdbc.update(sql, returnExchangeId, orderItemId, productId, productName, qty, price, 
                          exchangeProductId, exchangeProductName);
    }

    @Override
    public int insertReturnExchangeImage(int returnExchangeId, String imageData) {
        String sql = "INSERT INTO return_exchange_images (return_exchange_id, image_data, uploaded_at) " +
                     "VALUES (?, ?, CURRENT_TIMESTAMP)";
        return jdbc.update(sql, returnExchangeId, imageData);
    }

    @Override
    public int insertReturnExchangeNotification(int returnExchangeId, String senderUsername, 
                                                String message, String status) {
        String sql = 
            "INSERT INTO return_exchange_notifications " +
            "(return_exchange_id, sender_username, message, status, created_at) " +
            "VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)";
        
        return jdbc.update(sql, returnExchangeId, senderUsername, message, status);
    }

    @Override
    public List<Map<String, Object>> findAllReturnExchanges() {
        String sql = 
            "SELECT re.id, re.order_id, re.user_id, re.username, re.type, re.status, " +
            "re.reason, re.admin_notes, re.reviewed_by, re.reviewed_at, re.created_at, re.updated_at " +
            "FROM returns_exchanges re " +
            "ORDER BY re.created_at DESC";
        
        List<Map<String, Object>> returnExchanges = jdbc.queryForList(sql);
        
        for (Map<String, Object> re : returnExchanges) {
            int reId = ((Number) re.get("id")).intValue();
            re.put("items", findReturnExchangeItems(reId));
            re.put("images", findReturnExchangeImages(reId));
            re.put("notifications", findReturnExchangeNotifications(reId));
        }
        
        return returnExchanges;
    }

    @Override
    public List<Map<String, Object>> findReturnExchangesByUserId(int userId) {
        String sql = 
            "SELECT re.id, re.order_id, re.user_id, re.username, re.type, re.status, " +
            "re.reason, re.admin_notes, re.reviewed_by, re.reviewed_at, re.created_at, re.updated_at " +
            "FROM returns_exchanges re " +
            "WHERE re.user_id = ? " +
            "ORDER BY re.created_at DESC";
        
        List<Map<String, Object>> returnExchanges = jdbc.queryForList(sql, userId);
        
        for (Map<String, Object> re : returnExchanges) {
            int reId = ((Number) re.get("id")).intValue();
            re.put("items", findReturnExchangeItems(reId));
            re.put("images", findReturnExchangeImages(reId));
            re.put("notifications", findReturnExchangeNotifications(reId));
        }
        
        return returnExchanges;
    }

    @Override
    public List<Map<String, Object>> findReturnExchangeItems(int returnExchangeId) {
        String sql = 
            "SELECT id, return_exchange_id, order_item_id, product_id, product_name, " +
            "qty, price, exchange_product_id, exchange_product_name " +
            "FROM return_exchange_items " +
            "WHERE return_exchange_id = ?";
        
        return jdbc.queryForList(sql, returnExchangeId);
    }

    @Override
    public List<Map<String, Object>> findReturnExchangeImages(int returnExchangeId) {
        String sql = 
            "SELECT id, return_exchange_id, image_data, uploaded_at " +
            "FROM return_exchange_images " +
            "WHERE return_exchange_id = ?";
        
        return jdbc.queryForList(sql, returnExchangeId);
    }

    @Override
    public List<Map<String, Object>> findReturnExchangeNotifications(int returnExchangeId) {
        String sql = 
            "SELECT id, return_exchange_id, sender_username, message, status, created_at " +
            "FROM return_exchange_notifications " +
            "WHERE return_exchange_id = ? " +
            "ORDER BY created_at ASC";
        
        return jdbc.queryForList(sql, returnExchangeId);
    }

    @Override
    public int updateReturnExchangeStatus(int returnExchangeId, String status, String reviewedBy, String adminNotes) {
        String sql = 
            "UPDATE returns_exchanges " +
            "SET status = ?, reviewed_by = ?, admin_notes = ?, reviewed_at = CURRENT_TIMESTAMP, " +
            "updated_at = CURRENT_TIMESTAMP " +
            "WHERE id = ?";
        
        return jdbc.update(sql, status, reviewedBy, adminNotes, returnExchangeId);
    }

    @Override
    public Map<String, Object> findReturnExchangeById(int returnExchangeId) {
        String sql = 
            "SELECT re.id, re.order_id, re.user_id, re.username, re.type, re.status, " +
            "re.reason, re.admin_notes, re.reviewed_by, re.reviewed_at, re.created_at, re.updated_at " +
            "FROM returns_exchanges re " +
            "WHERE re.id = ?";
        
        List<Map<String, Object>> results = jdbc.queryForList(sql, returnExchangeId);
        
        if (results.isEmpty()) {
            return null;
        }
        
        Map<String, Object> re = results.get(0);
        re.put("items", findReturnExchangeItems(returnExchangeId));
        re.put("images", findReturnExchangeImages(returnExchangeId));
        re.put("notifications", findReturnExchangeNotifications(returnExchangeId));
        
        return re;
    }
}