package com.example.demo.order.service;

import com.example.demo.order.dao.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Map;
import java.util.logging.Logger;

@Service
public class OrderServiceImpl implements OrderService {

    @Autowired
    private OrderRepository repo;

    private static final Logger logger = Logger.getLogger(OrderServiceImpl.class.getName());

    @Override
    @Transactional(rollbackFor = Exception.class)
    public int checkout(int userId) {
        List<Map<String, Object>> cart = repo.findCartByUserId(userId);
        if (cart == null || cart.isEmpty()) {
            throw new RuntimeException("Cart is empty");
        }

        double total = 0;
        for (Map<String, Object> item : cart) {
            int qty = (int) item.get("qty");
            double price = ((Number) item.get("price")).doubleValue();
            total += qty * price;
        }

        int orderId = repo.createOrder(userId, total);

        for (Map<String, Object> item : cart) {
            int pid = (int) item.get("product_id");
            int qty = (int) item.get("qty");
            double price = ((Number) item.get("price")).doubleValue();

            if (repo.decrementStock(pid, qty) == 0) {
                throw new RuntimeException("Not enough stock for product: " + pid);
            }

            repo.insertOrderItem(orderId, pid, qty, price);
        }

        repo.clearCart(userId);
        return orderId;
    }

    @Override
    public List<Map<String, Object>> getOrders(int userId) {
        return repo.findOrdersByUserId(userId); // Regular users' orders
    }

    @Override
    public List<Map<String, Object>> getOrdersForAdmin() {
        try {
            logger.info("Fetching all orders for admin...");
            List<Map<String, Object>> orders = repo.findAllOrders();
            if (orders == null || orders.isEmpty()) {
                logger.warning("No orders found for admin.");
            }
            return orders;
        } catch (Exception ex) {
            logger.severe("Error fetching orders for admin: " + ex.getMessage());
            return null;
        }
    }

    @Override
    public int updateOrderStatus(int orderId, String status) {
        return repo.updateStatus(orderId, status);
    }

    @Override
    public List<Map<String, Object>> getCartForUser(int userId) {
        return repo.findCartByUserId(userId);
    }

    // Optional, you can call this in controller if you want to keep this separate (since it duplicates getOrdersForAdmin)
    @Override
    public List<Map<String, Object>> getAllOrdersWithUsernames() {
        return getOrdersForAdmin(); // Essentially same as getOrdersForAdmin, you can remove it if redundant
    }
}
