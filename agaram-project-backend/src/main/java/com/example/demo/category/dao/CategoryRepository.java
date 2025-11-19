package com.example.demo.category.dao;

import java.util.List;
import java.util.Map;

public interface CategoryRepository {
    List<Map<String, Object>> findAll();
    int insert(String name, String description);
}
