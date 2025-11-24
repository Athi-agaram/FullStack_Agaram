package com.example.demo.wishlist.service;


import java.util.List;
import java.util.Map;
import com.example.demo.wishlist.dao.WishlistRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class WishlistServiceImpl implements WishlistService {

    @Autowired
    private WishlistRepository wishlistRepository;

    @Override
    public List<Map<String, Object>> getWishlistByUser(int userId) {
        return wishlistRepository.getWishlistByUser(userId);
    }

    @Override
    public int addToWishlist(int userId, int productId, int qty) {
        return wishlistRepository.addToWishlist(userId, productId, qty);
    }

    @Override
    public int removeFromWishlist(int userId, int wishlistId) {
        return wishlistRepository.removeFromWishlist(userId, wishlistId);
    }
}

