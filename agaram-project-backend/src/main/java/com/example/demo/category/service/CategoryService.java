package com.example.demo.category.service;

import java.util.List;
import java.util.Map;

public interface CategoryService {
    List<Map<String, Object>> getAll();
    boolean create(String name, String description);
}
