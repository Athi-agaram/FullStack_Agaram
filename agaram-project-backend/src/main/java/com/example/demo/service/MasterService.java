//package com.example.demo.service;
//
//import com.example.demo.repository.MasterRepository;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.stereotype.Service;
//import java.util.List;
//import java.util.Map;
//
//@Service
//public class MasterService {
//
//    @Autowired
//    private MasterRepository repo;
//
//    // ==================== Employees ====================
//    public List<Map<String, Object>> getEmployees(String teamName) {
//        return repo.getEmployees(teamName);
//    }
//
//    public String addEmployee(Map<String, Object> body) {
//        return repo.addEmployee(body);
//    }
//
//    public String deleteEmployee(int id) {
//        return repo.deleteEmployee(id);
//    }
//
//    // ==================== Products ====================
//    public List<Map<String, Object>> getProducts(String teamName) {
//        return repo.getProducts(teamName);
//    }
//
//    public List<Map<String, Object>> addProduct(Map<String, Object> body) {
//        return repo.addProduct(body);
//    }
//
//    public List<Map<String, Object>> updateProduct(int id, Map<String, Object> body) {
//        return repo.updateProduct(id, body);
//    }
//
//    public String deleteProduct(int id) {
//        return repo.deleteProduct(id);
//    }
//
//    // ==================== Revenue ====================
//    public List<Map<String, Object>> getRevenue(String teamName) {
//        return repo.getRevenue(teamName);
//    }
//
//    public Map<String, Object> getRevenueSummary() {
//        return repo.getRevenueSummary();
//    }
//
//    public List<Map<String, Object>> getTeamRevenue() {
//        return repo.getTeamRevenue();
//    }
//
//    public List<Map<String, Object>> getMonthlyRevenue() {
//        return repo.getMonthlyRevenue();
//    }
//
//    public List<Map<String, Object>> getEmployeeRevenue() {
//        return repo.getEmployeeRevenue();
//    }
// // ==================== Revenue Dashboard ====================
//    public List<Map<String, Object>> getRevenueDashboard() {
//        return repo.getRevenueDashboard();
//    }
//
//    // ==================== Teams ====================
//    public List<Map<String, Object>> getTeams() {
//        return repo.getTeams();
//    }
//}
