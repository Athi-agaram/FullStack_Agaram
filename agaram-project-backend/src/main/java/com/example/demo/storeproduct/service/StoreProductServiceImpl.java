//package com.example.demo.storeproduct.service;
//
//import com.example.demo.storeproduct.dao.StoreProductRepository;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.stereotype.Service;
//
//import java.util.List;
//import java.util.Map;
//
//@Service
//public class StoreProductServiceImpl implements StoreProductService {
//
//    @Autowired
//    private StoreProductRepository repo;
//
//    @Override
//    public List<Map<String, Object>> getByCategory(int categoryId) {
//        return repo.findByCategoryId(categoryId);
//    }
//
//    @Override
//    public List<Map<String, Object>> getAll() {
//        return repo.findAll();
//    }
//
//    @Override
//    public Map<String, Object> getById(int id) {
//        return repo.findById(id);
//    }
//
//    @Override
//    public boolean create(int id, String name, double price, String category,
//                          String subcategory, String image, double ratingStars,
//                          int ratingCount, String description, String keywords,
//                          int categoryId) {
//
//        return repo.insert(id, name, price, category, subcategory, image,
//                ratingStars, ratingCount, description, keywords, categoryId) > 0;
//    }
//
//
//    @Override
//    public boolean updateProduct(int id, String name, double price, int categoryId, String image, int stock) {
//        return repo.update(id, name, price, categoryId, image, stock) > 0;
//    }
//
//    @Override
//    public boolean deleteProduct(int id) {
//        return repo.delete(id) > 0;
//    }
//
//    @Override
//    public boolean decreaseStockIfAvailable(int productId, int qty) {
//        return repo.decrementStockIfAvailable(productId, qty) > 0;
//    }
//}




package com.example.demo.storeproduct.service;

import com.example.demo.storeproduct.dao.StoreProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class StoreProductServiceImpl implements StoreProductService {

    @Autowired
    private StoreProductRepository repo;

    @Override
    public List<Map<String, Object>> getByCategory(int categoryId) {
        return repo.findByCategoryId(categoryId);
    }

    @Override
    public List<Map<String, Object>> getAll() {
        return repo.findAll();
    }

    @Override
    public Map<String, Object> getById(int id) {
        return repo.findById(id);
    }

    @Override
    public boolean create(String name, double price, String category,
                          String subcategory, String image, double ratingStars,
                          int ratingCount, String description, String keywords,
                          int categoryId, int stock) {
        // Pass stock first, then categoryId
    	return repo.insert(name, price, category, subcategory, image,
    	        ratingStars, ratingCount, description, keywords, categoryId, stock) > 0;
    }


    @Override
    public boolean updateProduct(int id, String name, double price, int categoryId, String image, int stock) {
        return repo.update(id, name, price, categoryId, image, stock) > 0;
    }

    @Override
    public boolean deleteProduct(int id) {
    	return repo.delete(id) > 0; 
    	}

    @Override
    public boolean decreaseStockIfAvailable(int productId, int qty) {
        return repo.decrementStockIfAvailable(productId, qty) > 0;
    }
}
