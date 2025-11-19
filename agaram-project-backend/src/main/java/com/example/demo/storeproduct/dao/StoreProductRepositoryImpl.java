package com.example.demo.storeproduct.dao;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

@Repository
public class StoreProductRepositoryImpl implements StoreProductRepository {

    @Autowired
    private JdbcTemplate jdbc;

    @Override
    public List<Map<String, Object>> findByCategoryId(int categoryId) {
        return jdbc.queryForList(
            "SELECT id, name, price, category_id, image, stock FROM storeproducts WHERE category_id = ? ORDER BY id",
            categoryId
        );
    }

    @Override
    public List<Map<String, Object>> findAll() {
        return jdbc.queryForList(
            "SELECT id, name, price, category_id, image, stock FROM storeproducts ORDER BY id"
        );
    }

    @Override
    public Map<String, Object> findById(int id) {
        return jdbc.queryForMap(
            "SELECT id, name, price, category_id, image, stock FROM storeproducts WHERE id = ?",
            id
        );
    }

    @Override
    public int insert(int id, String name, double price, String category,
                      String subcategory, String image, double ratingStars,
                      int ratingCount, String description, String keywords,
                      int categoryId) {

        String sql = "INSERT INTO storeproducts " +
                "(id, name, price, category, subcategory, image, rating_stars, rating_count, description, keywords, category_id) " +
                "VALUES (" + id + ", '" + name + "', " + price + ", '" + category + "', '" +
                subcategory + "', '" + image + "', " + ratingStars + ", " + ratingCount +
                ", '" + description + "', '" + keywords + "', " + categoryId + ")";

        return jdbc.update(sql);
    }

    @Override
    public int update(int id, String name, double price, int categoryId, String image, int stock) {
        return jdbc.update(
            "UPDATE storeproducts SET name = ?, price = ?, category_id = ?, image = ?, stock = ? WHERE id = ?",
            name, price, categoryId, image, stock, id
        );
    }

    @Override
    public int delete(int id) {
        return jdbc.update("DELETE FROM storeproducts WHERE id = ?", id);
    }

    @Override
    public int decrementStockIfAvailable(int productId, int qty) {
        return jdbc.update(
            "UPDATE storeproducts SET stock = stock - ? WHERE id = ? AND stock >= ?",
            qty, productId, qty
        );
    }
}
