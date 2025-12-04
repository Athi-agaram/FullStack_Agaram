package com.example.demo.returnexchange.service;

import java.util.List;
import java.util.Map;

public interface ReturnExchangeService {
    
    int createReturnExchangeRequest(Map<String, Object> requestData);
    
    List<Map<String, Object>> getAllReturnExchanges();
    
    List<Map<String, Object>> getReturnExchangesByUserId(int userId);
    
    Map<String, Object> getReturnExchangeById(int returnExchangeId);
    
    int reviewReturnExchange(int returnExchangeId, String status, String reviewedBy, String adminNotes);
    
    int updateReturnExchangeProgress(int returnExchangeId, String status, String updatedBy, String message);
}