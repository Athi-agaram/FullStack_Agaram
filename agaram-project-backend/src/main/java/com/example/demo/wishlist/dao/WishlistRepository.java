package com.example.demo.wishlist.dao;

import java.util.List;
import java.util.Map;

public interface WishlistRepository {

    List<Map<String, Object>> getWishlistByUser(int userId);

    int addToWishlist(int userId, int productId, int qty);

    int removeFromWishlist(int userId, int wishlistId);
}
