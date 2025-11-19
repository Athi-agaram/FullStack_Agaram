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
        return repo.findByUserId(userId);
    }

    @Override
    public void addToCart(int userId, int productId, int qty) {
        repo.addOrIncrease(userId, productId, qty);
    }

    @Override
    public void updateQty(int cartId, int qty) {
        repo.updateQtyByCartId(cartId, qty);
    }

    @Override
    public void removeCartItem(int cartId) {
        repo.deleteByCartId(cartId);
    }

    @Override
    public void clearCart(int userId) {
        repo.clearByUserId(userId);
    }
    @Override
    public void saveForLater(int cartId) {
        repo.markAsSaved(cartId, true);
    }

    @Override
    public void moveToCart(int cartId) {
        repo.markAsSaved(cartId, false);
    }

}
