//package com.example.demo.controller;
//
//import com.example.demo.storeproduct.service.StoreProductService;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.web.bind.annotation.*;
//
//import java.util.List;
//import java.util.Map;
//
//@RestController
//@RequestMapping("/api/storeproducts")
//@CrossOrigin(origins = "*")
//public class StoreProductController {
//
//    @Autowired
//    private StoreProductService service;
//
//    // Get products by category
//    @GetMapping("/category/{id}")
//    public List<Map<String, Object>> getByCategory(@PathVariable int id) {
//        return service.getByCategory(id);
//    }
//
//    // Get all store products
//    @GetMapping
//    public List<Map<String, Object>> getAll() {
//        return service.getAll();
//    }
//
//    // Get single product by id
//    @GetMapping("/{id}")
//    public Map<String, Object> getById(@PathVariable int id) {
//        return service.getById(id);
//    }
//
//    // Create new store product
//    @PostMapping
//    public Object create(@RequestBody Map<String, Object> body) {
//
//        int id = Integer.parseInt(body.get("id").toString());
//        String name = body.get("name").toString();
//        double price = Double.parseDouble(body.get("price").toString());
//        String category = body.get("category").toString();
//        String subcategory = body.get("subcategory").toString();
//        String image = body.get("image").toString();
//        double ratingStars = Double.parseDouble(body.get("rating_stars").toString());
//        int ratingCount = Integer.parseInt(body.get("rating_count").toString());
//        String description = body.get("description").toString();
//        String keywords = body.get("keywords").toString();
//        int categoryId = Integer.parseInt(body.get("category_id").toString());
//
//        boolean ok = service.create(
//                id, name, price, category, subcategory, image,
//                ratingStars, ratingCount, description, keywords, categoryId);
//
//        return Map.of("success", ok);
//    }
//
//
//    // Optional: Update existing product
//    @PutMapping("/{id}")
//    public Object update(@PathVariable int id, @RequestBody Map<String, Object> body) {
//        String name = body.get("name").toString();
//        double price = Double.parseDouble(body.get("price").toString());
//        int categoryId = Integer.parseInt(body.get("category_id").toString());
//        String image = body.getOrDefault("image", "").toString();
//        int stock = body.get("stock") != null ? Integer.parseInt(body.get("stock").toString()) : 0;
//
//        boolean ok = service.updateProduct(id, name, price, categoryId, image, stock);
//        return Map.of("success", ok);
//    }
//
//    // Optional: Delete product
//    @DeleteMapping("/{id}")
//    public Object delete(@PathVariable int id) {
//        boolean ok = service.deleteProduct(id);
//        return Map.of("success", ok);
//    }
//}



package com.example.demo.controller;

import com.example.demo.storeproduct.service.StoreProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/storeproducts")
//@CrossOrigin(origins = "*")
public class StoreProductController {

    @Autowired
    private StoreProductService service;

    @GetMapping("/category/{id}")
    public List<Map<String, Object>> getByCategory(@PathVariable int id) {
        return service.getByCategory(id);
    }

    @GetMapping
    public List<Map<String, Object>> getAll() {
        return service.getAll();
    }

    @GetMapping("/{id}")
    public Map<String, Object> getById(@PathVariable int id) {
        return service.getById(id);
    }

    @PostMapping
    public Object create(@RequestBody Map<String, Object> body) {
        try {
//            int id = Integer.parseInt(body.get("id").toString());
            String name = body.get("name").toString();
            double price = Double.parseDouble(body.get("price").toString());
            String category = body.get("category").toString();
            String subcategory = body.getOrDefault("subcategory", "").toString();
            String image = body.get("image").toString();
            double ratingStars = Double.parseDouble(body.getOrDefault("rating_stars", 4.5).toString());
            int ratingCount = Integer.parseInt(body.getOrDefault("rating_count", 10).toString());
            String description = body.getOrDefault("description", "").toString();
            String keywords = body.getOrDefault("keywords", "").toString();
            int categoryId = Integer.parseInt(body.getOrDefault("category_id", 1).toString());
            int stock = Integer.parseInt(body.getOrDefault("stock", 50).toString());

            boolean ok = service.create( name, price, category, subcategory, image,
                    ratingStars, ratingCount, description, keywords, categoryId, stock);

            return Map.of("success", ok);

        } catch (Exception e) {
            e.printStackTrace();
            return Map.of("success", false, "error", e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public Object update(@PathVariable int id, @RequestBody Map<String, Object> body) {
        String name = body.get("name").toString();
        double price = Double.parseDouble(body.get("price").toString());
        int categoryId = Integer.parseInt(body.get("category_id").toString());
        String image = body.getOrDefault("image", "").toString();
        int stock = Integer.parseInt(body.getOrDefault("stock", "50").toString());

        boolean ok = service.updateProduct(id, name, price, categoryId, image, stock);
        return Map.of("success", ok);
    }

    @DeleteMapping("/{id}")
    public Object delete(@PathVariable int id) {
        boolean ok = service.deleteProduct(id);
        return Map.of("success", ok);
    }
}
