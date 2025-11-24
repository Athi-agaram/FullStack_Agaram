package com.example.demo.order.service;

import com.example.demo.order.dao.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

@Service
public class OrderServiceImpl implements OrderService {

    @Autowired
    private OrderRepository repo;

    @Override
    @Transactional
    public int checkout(int userId) {
        // 1. Get cart items (only non-saved items)
        List<Map<String, Object>> cart = repo.findCartByUserId(userId);

        if (cart == null || cart.isEmpty()) {
            throw new RuntimeException("Cart is empty");
        }

        // 2. Calculate total
        double total = 0.0;
        for (Map<String, Object> item : cart) {
            double price = ((Number) item.get("price")).doubleValue();
            int qty = ((Number) item.get("qty")).intValue();
            total += price * qty;
        }

        // 3. Create order
        int orderId = repo.createOrder(userId, total);

        // 4. Insert order items and decrement stock
        for (Map<String, Object> item : cart) {
            int productId = ((Number) item.get("product_id")).intValue();
            int qty = ((Number) item.get("qty")).intValue();
            double price = ((Number) item.get("price")).doubleValue();

            repo.insertOrderItem(orderId, productId, qty, price);
            repo.decrementStock(productId, qty);
        }

        // 5. Clear cart (only non-saved items)
        repo.clearCart(userId);

        return orderId;
    }

    @Override
    public List<Map<String, Object>> getOrders(int userId) {
        return repo.findOrdersByUserId(userId);
    }

    @Override
    public List<Map<String, Object>> getOrdersForAdmin() {
        return repo.findAllOrders();
    }

    @Override
    public int updateOrderStatus(int orderId, String status) {
        return repo.updateStatus(orderId, status);
    }

    @Override
    public List<Map<String, Object>> getCartForUser(int userId) {
        return repo.findCartByUserId(userId);
    }
}