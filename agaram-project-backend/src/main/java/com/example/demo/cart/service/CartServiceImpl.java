package com.example.demo.cart.service;

import com.example.demo.cart.dao.CartRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class CartServiceImpl implements CartService {

    @Autowired
    private CartRepository repo;

    @Override
    public List<Map<String, Object>> getCart(int userId) {
        // Fetch the cart items for the user
        return repo.findByUserId(userId);
    }

    @Override
    public void addToCart(int userId, int productId, int qty) {
        // Add or update the cart item
        repo.addOrIncrease(userId, productId, qty);
    }

    @Override
    public void updateQty(int cartId, int qty) {
        // Update the quantity of the cart item
        repo.updateQtyByCartId(cartId, qty);
    }

    @Override
    public void removeCartItem(int cartId) {
        // Validate cartId is greater than 0
        if (cartId <= 0) {
            throw new IllegalArgumentException("Invalid cart ID");
        }
        // Remove the cart item from the database
        repo.deleteByCartId(cartId);
    }

    @Override
    public void clearCart(int userId) {
        // Clear all items from the user's cart
        repo.clearByUserId(userId);
    }

    @Override
    public void saveForLater(int cartId) {
        // Mark the cart item as saved for later
        repo.markAsSaved(cartId, true);
    }

    @Override
    public void moveToCart(int cartId) {
        // Mark the cart item to be moved back to cart
        repo.markAsSaved(cartId, false);
    }
}
