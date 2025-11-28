package com.example.demo.controller;

import java.util.List;
import java.util.Map;
import com.example.demo.wishlist.service.WishlistService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/wishlist")
public class WishlistController {

    @Autowired
    private WishlistService wishlistService;

    // Get wishlist for a user
    @GetMapping
    public List<Map<String, Object>> getWishlist(@RequestParam int userId) {
        return wishlistService.getWishlistByUser(userId);
    }

    // Add product to wishlist
    @PostMapping
    public String addToWishlist(@RequestParam int userId,
                                @RequestParam int productId,
                                @RequestParam(defaultValue = "1") int qty) {
        wishlistService.addToWishlist(userId, productId, qty);
        return "Product added to wishlist!";
    }

    // Remove product from wishlist
    @DeleteMapping("/{wishlistId}")
    public String removeFromWishlist(@RequestParam int userId,
                                     @PathVariable int wishlistId) {
        wishlistService.removeFromWishlist(userId, wishlistId);
        return "Product removed from wishlist!";
    }
}
