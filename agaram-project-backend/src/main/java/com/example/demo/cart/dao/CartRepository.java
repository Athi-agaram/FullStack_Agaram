package com.example.demo.cart.dao;

import java.util.List;
import java.util.Map;

public interface CartRepository {
    List<Map<String, Object>> findByUserId(int userId);
    int addOrIncrease(int userId, int productId, int qty);
    int updateQtyByCartId(int cartId, int qty);
    int deleteByCartId(int cartId);
    int clearByUserId(int userId); // only clears non-saved items
    int markAsSaved(int cartId, boolean isSaved); // new
}
