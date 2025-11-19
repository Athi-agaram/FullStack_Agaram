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
    @Transactional(rollbackFor = Exception.class)
    public int checkout(int userId) throws RuntimeException {
        // Load cart items
        List<Map<String, Object>> cart = repo.findCartByUserId(userId);
        if (cart == null || cart.isEmpty()) {
            throw new RuntimeException("Cart is empty");
        }

        // Calculate total
        double total = 0d;
        for (Map<String, Object> item : cart) {
            int qty = (int) item.get("qty");
            Number priceNum = (Number) item.get("price");
            total += priceNum.doubleValue() * qty;
        }

        // Create order
        int orderId = repo.createOrder(userId, total);

        // Insert items and decrement stock
        for (Map<String, Object> item : cart) {
            int pid = (int) item.get("product_id");
            int qty = (int) item.get("qty");
            Number priceNum = (Number) item.get("price");
            double price = priceNum.doubleValue();

            int dec = repo.decrementProductStockIfAvailable(pid, qty);
            if (dec == 0) {
                throw new RuntimeException("Insufficient stock for product ID: " + pid);
            }

            repo.insertOrderItem(orderId, pid, qty, price);
        }

        // Clear cart
        repo.clearCartByUserId(userId);

        return orderId;
    }

    @Override
    public List<Map<String, Object>> getOrders(int userId) {
        return repo.findOrdersByUserId(userId);
    }
}
