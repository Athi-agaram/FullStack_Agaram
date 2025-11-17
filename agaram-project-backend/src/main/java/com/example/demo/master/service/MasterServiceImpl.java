package com.example.demo.master.service;

import com.example.demo.master.dao.MasterDao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class MasterServiceImpl implements MasterService {

    @Autowired
    private MasterDao repo;

    @Override
    public List<Map<String, Object>> getEmployees(String teamName) {
        return repo.getEmployees(teamName);
    }

    @Override
    public String addEmployee(Map<String, Object> body) {
        return repo.addEmployee(body);
    }

    @Override
    public String deleteEmployee(int id) {
        return repo.deleteEmployee(id);
    }

    @Override
    public List<Map<String, Object>> getProducts(String teamName) {
        return repo.getProducts(teamName);
    }

    @Override
    public List<Map<String, Object>> addProduct(Map<String, Object> body) {
        return repo.addProduct(body);
    }

    @Override
    public List<Map<String, Object>> updateProduct(int id, Map<String, Object> body) {
        return repo.updateProduct(id, body);
    }

    @Override
    public String deleteProduct(int id) {
        return repo.deleteProduct(id);
    }

    @Override
    public List<Map<String, Object>> getRevenue(String teamName) {
        return repo.getRevenue(teamName);
    }

    @Override
    public Map<String, Object> getRevenueSummary() {
        return repo.getRevenueSummary();
    }

    @Override
    public List<Map<String, Object>> getTeamRevenue() {
        return repo.getTeamRevenue();
    }

    @Override
    public List<Map<String, Object>> getMonthlyRevenue() {
        return repo.getMonthlyRevenue();
    }

    @Override
    public List<Map<String, Object>> getEmployeeRevenue() {
        return repo.getEmployeeRevenue();
    }

    @Override
    public List<Map<String, Object>> getRevenueDashboard() {
        return repo.getRevenueDashboard();
    }

    @Override
    public List<Map<String, Object>> getTeams() {
        return repo.getTeams();
    }
}
