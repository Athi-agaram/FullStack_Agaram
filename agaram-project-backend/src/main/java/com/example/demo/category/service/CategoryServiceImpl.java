package com.example.demo.category.service;

import com.example.demo.category.dao.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class CategoryServiceImpl implements CategoryService {

    @Autowired
    private CategoryRepository repo;

    @Override
    public List<Map<String, Object>> getAll() {
        return repo.findAll();
    }

    @Override
    public boolean create(String name, String description) {
        return repo.insert(name, description) > 0;
    }
}
