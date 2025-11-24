package com.example.demo.wishlist.service;

import java.util.List;
import java.util.Map;

public interface WishlistService {

    List<Map<String, Object>> getWishlistByUser(int userId);

    int addToWishlist(int userId, int productId, int qty);

    int removeFromWishlist(int userId, int wishlistId);
}
