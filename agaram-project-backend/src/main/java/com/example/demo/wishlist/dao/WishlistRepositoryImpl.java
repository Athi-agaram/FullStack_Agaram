package com.example.demo.wishlist.dao;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

@Repository
public class WishlistRepositoryImpl implements WishlistRepository {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Override
    public List<Map<String, Object>> getWishlistByUser(int userId) {
        String sql = "SELECT w.id, w.user_id, w.product_id, w.qty, w.created_at, " +
                     "sp.name AS product_name, sp.price AS product_price, sp.image " +
                     "FROM wishlist w " +
                     "LEFT JOIN storeproducts sp ON w.product_id = sp.id " +
                     "WHERE w.user_id = ? " +
                     "ORDER BY w.created_at DESC";
        return jdbcTemplate.queryForList(sql, userId);
    }

    @Override
    public int addToWishlist(int userId, int productId, int qty) {
        // Check if already exists
        String checkSql = "SELECT COUNT(*) FROM wishlist WHERE user_id = ? AND product_id = ?";
        Integer count = jdbcTemplate.queryForObject(checkSql, Integer.class, userId, productId);

        if (count != null && count > 0) {
            // Optional: update qty
            String updateSql = "UPDATE wishlist SET qty = qty + ? WHERE user_id = ? AND product_id = ?";
            return jdbcTemplate.update(updateSql, qty, userId, productId);
        }

        String sql = "INSERT INTO wishlist (user_id, product_id, qty) VALUES (?, ?, ?)";
        return jdbcTemplate.update(sql, userId, productId, qty);
    }

    @Override
    public int removeFromWishlist(int userId, int wishlistId) {
        String sql = "DELETE FROM wishlist WHERE id = ? AND user_id = ?";
        return jdbcTemplate.update(sql, wishlistId, userId);
    }
}
