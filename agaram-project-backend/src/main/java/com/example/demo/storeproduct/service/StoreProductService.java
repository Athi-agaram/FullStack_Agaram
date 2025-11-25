//package com.example.demo.storeproduct.service;
//
//import java.util.List;
//import java.util.Map;
//
//public interface StoreProductService {
//    List<Map<String, Object>> getByCategory(int categoryId);
//    List<Map<String, Object>> getAll();
//    Map<String, Object> getById(int id);
//    boolean create(int id, String name, double price, String category,
//            String subcategory, String image, double ratingStars,
//            int ratingCount, String description, String keywords,
//            int categoryId);
//    boolean updateProduct(int id, String name, double price, int categoryId, String image, int stock); // new
//    boolean deleteProduct(int id); // new
//    boolean decreaseStockIfAvailable(int productId, int qty);
//}



package com.example.demo.storeproduct.service;

import java.util.List;
import java.util.Map;

public interface StoreProductService {
    List<Map<String, Object>> getByCategory(int categoryId);
    List<Map<String, Object>> getAll();
    Map<String, Object> getById(int id);

    boolean create( String name, double price, String category,
                   String subcategory, String image, double ratingStars,
                   int ratingCount, String description, String keywords,
                   int categoryId, int stock);

    boolean updateProduct(int id, String name, double price, int categoryId, String image, int stock);
    boolean deleteProduct(int id);
    boolean decreaseStockIfAvailable(int productId, int qty);
}
