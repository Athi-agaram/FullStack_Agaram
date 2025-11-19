package com.example.demo.order.service;

import java.util.List;
import java.util.Map;

public interface OrderService {
    int checkout(int userId) throws RuntimeException;
    List<Map<String, Object>> getOrders(int userId);
}
