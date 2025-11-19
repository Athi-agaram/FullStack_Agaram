package com.example.demo.cart.service;

import java.util.List;
import java.util.Map;

public interface CartService {
    List<Map<String, Object>> getCart(int userId);
    void addToCart(int userId, int productId, int qty);
    void updateQty(int cartId, int qty);
    void removeCartItem(int cartId);
    void clearCart(int userId);
    void saveForLater(int cartId);
    void moveToCart(int cartId);

}
