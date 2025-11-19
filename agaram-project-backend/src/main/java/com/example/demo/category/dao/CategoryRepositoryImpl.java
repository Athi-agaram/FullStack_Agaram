package com.example.demo.category.dao;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

@Repository
public class CategoryRepositoryImpl implements CategoryRepository {

    @Autowired
    private JdbcTemplate jdbc;

    @Override
    public List<Map<String, Object>> findAll() {
        return jdbc.queryForList("SELECT id, name, description FROM categories ORDER BY id");
    }

    @Override
    public int insert(String name, String description) {
        return jdbc.update("INSERT INTO categories (name, description) VALUES (?, ?)", name, description);
    }
}
