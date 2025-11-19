package com.example.demo.controller;

import com.example.demo.cart.service.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/cart")
@CrossOrigin(origins = "*")
public class CartController {

    @Autowired
    private CartService service;

    @GetMapping("/{userId}")
    public List<Map<String, Object>> getCart(@PathVariable int userId) {
        return service.getCart(userId);
    }

    @PostMapping("/add")
    public Object addToCart(@RequestBody Map<String, Object> body) {
        int userId = Integer.parseInt(body.get("userId").toString());
        int productId = Integer.parseInt(body.get("productId").toString());
        int qty = Integer.parseInt(body.get("qty").toString());
        service.addToCart(userId, productId, qty);
        return Map.of("success", true);
    }

    @PutMapping("/update")
    public Object updateQty(@RequestBody Map<String, Object> body) {
        int cartId = Integer.parseInt(body.get("cartId").toString());
        int qty = Integer.parseInt(body.get("qty").toString());
        service.updateQty(cartId, qty);
        return Map.of("success", true);
    }

    @DeleteMapping("/delete/{cartId}")
    public Object deleteCartItem(@PathVariable int cartId) {
        service.removeCartItem(cartId);
        return Map.of("success", true);
    }
    @PostMapping("/save/{cartId}")
    public Object saveForLater(@PathVariable int cartId) {
        service.saveForLater(cartId);
        return Map.of("success", true);
    }

    @PostMapping("/move/{cartId}")
    public Object moveToCart(@PathVariable int cartId) {
        service.moveToCart(cartId);
        return Map.of("success", true);
    }
    
}
