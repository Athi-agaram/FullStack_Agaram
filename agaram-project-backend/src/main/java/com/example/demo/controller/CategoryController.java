package com.example.demo.controller;

import com.example.demo.category.service.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/categories")
//@CrossOrigin(origins = "*")
public class CategoryController {

    @Autowired
    private CategoryService service;

    @GetMapping
    public List<Map<String, Object>> getAll() {
        return service.getAll();
    }

    @PostMapping
    public Object create(@RequestBody Map<String, Object> body) {
        String name = (String) body.get("name");
        String description = body.getOrDefault("description", "").toString();
        return Map.of("success", service.create(name, description));
    }
}
