package com.example.demo.returnexchange.dao;

import java.util.List;
import java.util.Map;

public interface ReturnExchangeRepository {
    
    int createReturnExchange(int orderId, int userId, String username, String type, String reason);
    
    int insertReturnExchangeItem(int returnExchangeId, int orderItemId, int productId, 
                                String productName, int qty, double price, 
                                Integer exchangeProductId, String exchangeProductName);
    
    int insertReturnExchangeImage(int returnExchangeId, String imageData);
    
    int insertReturnExchangeNotification(int returnExchangeId, String senderUsername, 
                                        String message, String status);
    
    List<Map<String, Object>> findAllReturnExchanges();
    
    List<Map<String, Object>> findReturnExchangesByUserId(int userId);
    
    Map<String, Object> findReturnExchangeById(int returnExchangeId);
    
    List<Map<String, Object>> findReturnExchangeItems(int returnExchangeId);
    
    List<Map<String, Object>> findReturnExchangeImages(int returnExchangeId);
    
    List<Map<String, Object>> findReturnExchangeNotifications(int returnExchangeId);
    
    int updateReturnExchangeStatus(int returnExchangeId, String status, String reviewedBy, String adminNotes);
}