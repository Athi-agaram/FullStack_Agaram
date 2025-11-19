package com.example.demo.controller;

import com.example.demo.storeproduct.service.StoreProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/storeproducts")
@CrossOrigin(origins = "*")
public class StoreProductController {

    @Autowired
    private StoreProductService service;

    // Get products by category
    @GetMapping("/category/{id}")
    public List<Map<String, Object>> getByCategory(@PathVariable int id) {
        return service.getByCategory(id);
    }

    // Get all store products
    @GetMapping
    public List<Map<String, Object>> getAll() {
        return service.getAll();
    }

    // Get single product by id
    @GetMapping("/{id}")
    public Map<String, Object> getById(@PathVariable int id) {
        return service.getById(id);
    }

    // Create new store product
    @PostMapping
    public Object create(@RequestBody Map<String, Object> body) {

        int id = Integer.parseInt(body.get("id").toString());
        String name = body.get("name").toString();
        double price = Double.parseDouble(body.get("price").toString());
        String category = body.get("category").toString();
        String subcategory = body.get("subcategory").toString();
        String image = body.get("image").toString();
        double ratingStars = Double.parseDouble(body.get("rating_stars").toString());
        int ratingCount = Integer.parseInt(body.get("rating_count").toString());
        String description = body.get("description").toString();
        String keywords = body.get("keywords").toString();
        int categoryId = Integer.parseInt(body.get("category_id").toString());

        boolean ok = service.create(
                id, name, price, category, subcategory, image,
                ratingStars, ratingCount, description, keywords, categoryId);

        return Map.of("success", ok);
    }


    // Optional: Update existing product
    @PutMapping("/{id}")
    public Object update(@PathVariable int id, @RequestBody Map<String, Object> body) {
        String name = body.get("name").toString();
        double price = Double.parseDouble(body.get("price").toString());
        int categoryId = Integer.parseInt(body.get("category_id").toString());
        String image = body.getOrDefault("image", "").toString();
        int stock = body.get("stock") != null ? Integer.parseInt(body.get("stock").toString()) : 0;

        boolean ok = service.updateProduct(id, name, price, categoryId, image, stock);
        return Map.of("success", ok);
    }

    // Optional: Delete product
    @DeleteMapping("/{id}")
    public Object delete(@PathVariable int id) {
        boolean ok = service.deleteProduct(id);
        return Map.of("success", ok);
    }
}
