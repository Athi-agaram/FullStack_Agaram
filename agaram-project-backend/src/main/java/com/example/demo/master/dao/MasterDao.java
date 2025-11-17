package com.example.demo.master.dao;

import java.util.List;
import java.util.Map;

public interface MasterDao {
    List<Map<String, Object>> getEmployees(String teamName);
    String addEmployee(Map<String, Object> body);
    String deleteEmployee(int id);

    List<Map<String, Object>> getProducts(String teamName);
    List<Map<String, Object>> addProduct(Map<String, Object> body);
    List<Map<String, Object>> updateProduct(int id, Map<String, Object> body);
    String deleteProduct(int id);

    List<Map<String, Object>> getRevenue(String teamName);
    Map<String, Object> getRevenueSummary();
    List<Map<String, Object>> getTeamRevenue();
    List<Map<String, Object>> getMonthlyRevenue();
    List<Map<String, Object>> getEmployeeRevenue();
    List<Map<String, Object>> getRevenueDashboard();

    List<Map<String, Object>> getTeams();
}
