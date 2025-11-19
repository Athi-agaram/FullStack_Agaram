package com.example.demo.controller;

import com.example.demo.order.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.List;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "*")
public class OrderController {

    @Autowired
    private OrderService service;

    @PostMapping("/checkout/{userId}")
    public Object checkout(@PathVariable int userId) {
        try {
            int orderId = service.checkout(userId);
            return Map.of("success", true, "orderId", orderId);
        } catch (Exception ex) {
            return Map.of("success", false, "message", ex.getMessage());
        }
    }

    @GetMapping("/{userId}")
    public List<Map<String, Object>> getOrders(@PathVariable int userId) {
        return service.getOrders(userId);
    }
}
