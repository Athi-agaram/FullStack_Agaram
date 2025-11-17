package com.example.demo.controller;

import com.example.demo.master.service.MasterService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/master")
@CrossOrigin(origins = "http://localhost:3000")
public class MasterController {

    @Autowired
    private MasterService masterService;

    // ... (methods unchanged, they call masterService.*)
    @GetMapping("/employee")
    public List<Map<String, Object>> getEmployees(@RequestParam(required = false) String teamName) {
        return masterService.getEmployees(teamName);
    }

    @PostMapping("/employee")
    public String addEmployee(@RequestBody Map<String, Object> body) {
        return masterService.addEmployee(body);
    }

    @DeleteMapping("/employee/{id}")
    public String deleteEmployee(@PathVariable int id) {
        return masterService.deleteEmployee(id);
    }

    @GetMapping("/products")
    public List<Map<String, Object>> getProducts(@RequestParam(required = false) String teamName) {
        return masterService.getProducts(teamName);
    }

    @PostMapping("/products")
    public List<Map<String, Object>> addProduct(@RequestBody Map<String, Object> body) {
        return masterService.addProduct(body);
    }

    @PutMapping("/products/{id}")
    public List<Map<String, Object>> updateProduct(@PathVariable int id, @RequestBody Map<String, Object> body) {
        return masterService.updateProduct(id, body);
    }

    @DeleteMapping("/products/{id}")
    public String deleteProduct(@PathVariable int id) {
        return masterService.deleteProduct(id);
    }

    @GetMapping("/revenue")
    public List<Map<String, Object>> getRevenue(@RequestParam(required = false) String teamName) {
        return masterService.getRevenue(teamName);
    }

    @GetMapping("/revenue/summary")
    public Map<String, Object> getRevenueSummary() {
        return masterService.getRevenueSummary();
    }

    @GetMapping("/revenue/team-wise")
    public List<Map<String, Object>> getTeamRevenue() {
        return masterService.getTeamRevenue();
    }

    @GetMapping("/revenue/month-wise")
    public List<Map<String, Object>> getMonthlyRevenue() {
        return masterService.getMonthlyRevenue();
    }

    @GetMapping("/revenue/employee-wise")
    public List<Map<String, Object>> getEmployeeRevenue() {
        return masterService.getEmployeeRevenue();
    }

    @GetMapping("/revenue/dashboard")
    public List<Map<String, Object>> getRevenueDashboard() {
        return masterService.getRevenueDashboard();
    }

    @GetMapping("/teams")
    public List<Map<String, Object>> getTeams() {
        return masterService.getTeams();
    }
}
