package com.example.demo.controller;

import com.example.demo.cart.service.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import org.springframework.http.ResponseEntity;

@RestController
@RequestMapping("/api/cart")
@CrossOrigin(origins = "*")
public class CartController {

    @Autowired
    private CartService service;

    @GetMapping("/{userId}")
    public ResponseEntity<Object> getCart(@PathVariable int userId) {
        try {
            return ResponseEntity.ok(service.getCart(userId));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("success", false, "error", e.getMessage()));
        }
    }

    @PostMapping("/add")
    public ResponseEntity<Object> addToCart(@RequestBody Map<String, Object> body) {
        if (body.get("userId") == null || body.get("productId") == null || body.get("qty") == null) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "error", "Missing required fields: userId, productId, qty"));
        }

        try {
            int userId = Integer.parseInt(body.get("userId").toString());
            int productId = Integer.parseInt(body.get("productId").toString());
            int qty = Integer.parseInt(body.get("qty").toString());
            service.addToCart(userId, productId, qty);
            return ResponseEntity.ok(Map.of("success", true));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("success", false, "error", "Failed to add item to cart: " + e.getMessage()));
        }
    }

    @PutMapping("/update")
    public ResponseEntity<Object> updateQty(@RequestBody Map<String, Object> body) {
        if (body.get("cartId") == null || body.get("qty") == null) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "error", "Missing required fields: cartId, qty"));
        }

        try {
            int cartId = Integer.parseInt(body.get("cartId").toString());
            int qty = Integer.parseInt(body.get("qty").toString());
            service.updateQty(cartId, qty);
            return ResponseEntity.ok(Map.of("success", true));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("success", false, "error", "Failed to update quantity: " + e.getMessage()));
        }
    }

    @DeleteMapping("/delete/{cartId}")
    public ResponseEntity<Object> deleteCartItem(@PathVariable int cartId) {
        try {
            service.removeCartItem(cartId);
            return ResponseEntity.ok(Map.of("success", true));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("success", false, "error", "Failed to delete item: " + e.getMessage()));
        }
    }

    @PostMapping("/save/{cartId}")
    public ResponseEntity<Object> saveForLater(@PathVariable int cartId) {
        try {
            service.saveForLater(cartId);
            return ResponseEntity.ok(Map.of("success", true));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("success", false, "error", "Failed to save item for later: " + e.getMessage()));
        }
    }

    @PostMapping("/move/{cartId}")
    public ResponseEntity<Object> moveToCart(@PathVariable int cartId) {
        try {
            service.moveToCart(cartId);
            return ResponseEntity.ok(Map.of("success", true));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("success", false, "error", "Failed to move item to cart: " + e.getMessage()));
        }
    }
}
