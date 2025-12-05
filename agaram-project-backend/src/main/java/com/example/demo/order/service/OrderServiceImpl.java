//package com.example.demo.order.service;
//
//import com.example.demo.order.dao.OrderRepository;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.stereotype.Service;
//import org.springframework.transaction.annotation.Transactional;
//import java.util.List;
//import java.util.Map;
//import java.util.logging.Logger;
//
//@Service
//public class OrderServiceImpl implements OrderService {
//
//    @Autowired
//    private OrderRepository repo;
//    
//    private static final Logger logger = Logger.getLogger(OrderServiceImpl.class.getName());
//
//    @Override
//    @Transactional
//    public int checkout(int userId) {
//        List<Map<String, Object>> cart = repo.findCartByUserId(userId);
//        if (cart == null || cart.isEmpty()) {
//            throw new RuntimeException("Cart is empty");
//        }
//
//        double total = cart.stream()
//                .mapToDouble(item -> ((Number) item.get("price")).doubleValue() *
//                                     ((Number) item.get("qty")).intValue())
//                .sum();
//
//        int orderId = repo.createOrder(userId, total);
//
//        for (Map<String, Object> item : cart) {
//            int productId = ((Number) item.get("product_id")).intValue();
//            int qty = ((Number) item.get("qty")).intValue();
//            double price = ((Number) item.get("price")).doubleValue();
//
//            repo.insertOrderItem(orderId, productId, qty, price);
//            repo.decrementStock(productId, qty);
//        }
//
//        repo.clearCart(userId);
//        return orderId;
//    }
//
//    @Override
//    public List<Map<String, Object>> getOrders(int userId) {
//        return repo.findOrdersByUserId(userId);
//    }
//
//    @Override
//    public List<Map<String, Object>> getOrdersForAdmin() {
//        return repo.findAllOrders();
//    }
//
//    @Override
//    public List<Map<String, Object>> getOrdersForRoles() {
//        // Role users (warehouse, distributor, agent, courier) see all orders
//        return repo.findAllOrders();
//    }
//
//    @Override
//    public List<Map<String, Object>> getCartForUser(int userId) {
//        return repo.findCartByUserId(userId);
//    }
//
//    @Override
//    public List<Map<String, Object>> getNotificationsByUsername(String username) {
//        return repo.findNotificationsByUsername(username);
//    }
//
//    @Override
//    public int sendNotification(int orderId, String username, String message, String status) {
//        return repo.insertNotification(orderId, username, message, status);
//    }
//
//    @Override
//    public boolean canUserUpdateStep(String username, String currentStatus) {
//        return repo.canUserUpdateStep(username, currentStatus);
//    }
//
//    @Override
//    public Map<String, Object> getUserPermission(String username) {
//        return repo.findUserPermission(username);
//    }
//
//    @Override
//    public String getUserRole(String username) {
//        if (username == null) return "USER";
//        
//        Map<String, Object> perm = getUserPermission(username);
//        if (perm == null) return "USER";
//        
//        Object ptype = perm.get("permission_type");
//        return ptype == null ? "USER" : ptype.toString();
//    }
//    @Override
//    @Transactional
//    public int updateOrderStatus(int orderId, String status) {
//
//        int rows = repo.updateStatus(orderId, status);
//
//        if (rows <= 0) return rows;
//
//        // =============================
//        // AUTO-MESSAGE FOR NEXT PERSON
//        // =============================
//        String nextMessage = "";
//        String nextStatus = status;
//
//        switch (status.toUpperCase()) {
//
//            case "PROCESSING":
//                nextMessage = "Warehouse has confirmed and processed the order";
//                break;
//
//            case "PACKED":
//                nextMessage = "Distributor has packed and prepared the order for shipment";
//                break;
//
//            case "DISPATCHED":
//                nextMessage = "Agent has dispatched the product to the courier";
//                break;
//
//            case "OUT_FOR_DELIVERY":
//                nextMessage = "Courier is out for delivery";
//                break;
//
//            case "DELIVERED":
//                nextMessage = "Your order has been delivered";
//                break;
//        }
//
//        if (!nextMessage.isEmpty()) {
//            repo.insertNotification(orderId, "system", nextMessage, nextStatus);
//        }
//
//        // =========================================
//        // ⭐ FIX: DELETE ALL OLD NOTIFICATIONS
//        // Keep only the newest one
//        // =========================================
//        repo.deleteOldNotificationsExceptLatest(orderId);
//
//        return rows;
//    }
//
//}


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
    

    @Override
    @Transactional
    public int checkout(int userId) {
        List<Map<String, Object>> cart = repo.findCartByUserId(userId);
        if (cart == null || cart.isEmpty()) {
            throw new RuntimeException("Cart is empty");
        }

        double total = cart.stream()
                .mapToDouble(item -> ((Number) item.get("price")).doubleValue() *
                                     ((Number) item.get("qty")).intValue())
                .sum();

        int orderId = repo.createOrder(userId, total);
        

        for (Map<String, Object> item : cart) {
            int productId = ((Number) item.get("product_id")).intValue();
            int qty = ((Number) item.get("qty")).intValue();
            double price = ((Number) item.get("price")).doubleValue();

            repo.insertOrderItem(orderId, productId, qty, price);
            repo.decrementStock(productId, qty);
        }

        repo.clearCart(userId);

        // Get username for the notification message
        String username = repo.getUsernameById(userId);
        int itemCount = cart.size();

        // IMPORTANT: Only create ONE notification from system
        // Do NOT create notification with username as sender
        String message = String.format("New order placed by %s with %d item%s", 
            username, itemCount, itemCount == 1 ? "" : "s");
        
        // Only use "system" as sender, never use the actual username
        int notifResult = repo.insertNotification(orderId, "system", message, "PLACED");
        


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
    public List<Map<String, Object>> getOrdersForRoles() {
        return repo.findAllOrders();
    }

    @Override
    public List<Map<String, Object>> getCartForUser(int userId) {
        return repo.findCartByUserId(userId);
    }

    @Override
    public List<Map<String, Object>> getNotificationsByUsername(String username) {
        return repo.findNotificationsByUsername(username);
    }

    @Override
    public boolean canUserUpdateStep(String username, String currentStatus) {
        return repo.canUserUpdateStep(username, currentStatus);
    }

    @Override
    public Map<String, Object> getUserPermission(String username) {
        return repo.findUserPermission(username);
    }

    @Override
    public String getUserRole(String username) {
        if (username == null) return "USER";
        
        Map<String, Object> perm = getUserPermission(username);
        if (perm == null) return "USER";
        
        Object ptype = perm.get("permission_type");
        return ptype == null ? "USER" : ptype.toString();
    }

    @Override
    @Transactional
    public int updateOrderStatus(int orderId, String status) {
        
        int rows = repo.updateStatus(orderId, status);


        String systemMessage = "";
        String senderUsername = "system"; // Always use "system" as sender

        switch (status.toUpperCase()) {
            case "PLACED":
                systemMessage = "Order has been placed successfully.";
                break;

            case "PROCESSING":
                systemMessage = "Warehouse has confirmed and processed the order.";
                break;

            case "SHIPPED":
               
                return rows; // Exit early, no notification created

            case "OUT_FOR_DELIVERY":
                systemMessage = "Courier is out for delivery.";
                break;

            case "DELIVERED":
                systemMessage = "Your order has been delivered successfully.";
                break;
            default:
                systemMessage = "Order status updated to " + status;
                break;
        }

        // Insert notification ONLY if message is not empty
        if (!systemMessage.isEmpty()) {
            int notifResult = repo.insertNotification(orderId, senderUsername, systemMessage, status);
            
            if (notifResult > 0) {
            } else {
            }
        }

        
        return rows;
    }

    @Override
    public int sendNotification(int orderId, String username, String message, String status) {
        
        // For Agent's custom message on SHIPPED status
        // We don't need to delete any previous notifications
        // Just insert the Agent's custom message
        
        return repo.insertNotification(orderId, username, message, status);
    }
}