package com.example.demo.cart.dao;

import java.util.List;
import java.util.Map;

public interface CartRepository {

    List<Map<String, Object>> findByUserId(int userId);

    int addOrIncrease(int userId, int productId, int qty);

    int updateCart(int cartId, int qty, Boolean isSaved);

    int deleteByCartId(int cartId);

    int clearByUserId(int userId);

    int markAsSaved(int cartId, boolean isSaved);
}
