package com.example.demo.cart.dao;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

@Repository
public class CartRepositoryImpl implements CartRepository {

    @Autowired
    private JdbcTemplate jdbc;

    @Override
    public int addOrIncrease(int userId, int productId, int qty) {
        // Try update existing
        int updated = jdbc.update("UPDATE cart SET qty = qty + ? WHERE user_id = ? AND product_id = ?", qty, userId, productId);
        if (updated > 0) return updated;
        return jdbc.update("INSERT INTO cart (user_id, product_id, qty) VALUES (?, ?, ?)", userId, productId, qty);
    }

    @Override
    public int updateQtyByCartId(int cartId, int qty) {
        return jdbc.update("UPDATE cart SET qty = ? WHERE id = ?", qty, cartId);
    }

    @Override
    public int deleteByCartId(int cartId) {
        return jdbc.update("DELETE FROM cart WHERE id = ?", cartId);
    }


    @Override
    public List<Map<String, Object>> findByUserId(int userId) {
        return jdbc.queryForList(
            "SELECT c.id AS cart_id, c.user_id, c.product_id, c.qty, c.is_saved, " +
            "p.name, p.price, p.image, p.rating_stars AS rating " +
            "FROM cart c JOIN storeproducts p ON c.product_id = p.id " +
            "WHERE c.user_id = ?",
            userId
        );
    }

    @Override
    public int clearByUserId(int userId) {
        return jdbc.update("DELETE FROM cart WHERE user_id = ? AND is_saved = 0", userId);
    }

    @Override
    public int markAsSaved(int cartId, boolean isSaved) {
        return jdbc.update("UPDATE cart SET is_saved = ? WHERE id = ?", isSaved ? 1 : 0, cartId);
    }

}
