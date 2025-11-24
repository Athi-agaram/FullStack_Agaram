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
    public ResponseEntity<?> getCart(@PathVariable int userId) {
        return ResponseEntity.ok(service.getCart(userId));
    }

    @PostMapping("/add")
    public ResponseEntity<?> addToCart(@RequestBody Map<String, Object> body) {
        try {
            int userId = Integer.parseInt(body.get("userId").toString());
            int productId = Integer.parseInt(body.get("productId").toString());
            int qty = Integer.parseInt(body.get("qty").toString());

            service.addToCart(userId, productId, qty);

            return ResponseEntity.ok(Map.of("success", true));

        } catch (Exception e) {
            return ResponseEntity.status(400).body(Map.of("success", false, "error", e.getMessage()));
        }
    }

    // ⭐ FIXED UPDATE ENDPOINT – NOW WORKS
    @PutMapping("/update/{cartId}")
    public ResponseEntity<?> updateCart(@PathVariable int cartId, @RequestBody Map<String, Object> body) {

        int qty = ((Number) body.get("qty")).intValue();
        Boolean isSaved = (body.containsKey("is_saved")) ? (Boolean) body.get("is_saved") : null;

        service.updateCart(cartId, qty, isSaved);

        return ResponseEntity.ok(Map.of("success", true));
    }

    @DeleteMapping("/{cartId}")
    public ResponseEntity<?> deleteCartItem(@PathVariable int cartId) {
        try {
            service.removeCartItem(cartId);
            return ResponseEntity.ok(Map.of("success", true));
        } catch (Exception e) {
            return ResponseEntity.status(400).body(Map.of("success", false, "error", e.getMessage()));
        }
    }

    @PostMapping("/save/{cartId}")
    public ResponseEntity<?> saveForLater(@PathVariable int cartId) {
        service.saveForLater(cartId);
        return ResponseEntity.ok(Map.of("success", true));
    }

    @PostMapping("/move/{cartId}")
    public ResponseEntity<?> moveToCart(@PathVariable int cartId) {
        service.moveToCart(cartId);
        return ResponseEntity.ok(Map.of("success", true));
    }
}
