//package com.example.demo.storeproduct.dao;
//
//import java.util.List;
//import java.util.Map;
//
//public interface StoreProductRepository {
//    List<Map<String, Object>> findByCategoryId(int categoryId);
//    List<Map<String, Object>> findAll();
//    Map<String, Object> findById(int id);
//    int insert(
//    	    int id,
//    	    String name,
//    	    double price,
//    	    String category,
//    	    String subcategory,
//    	    String image,
//    	    double ratingStars,
//    	    int ratingCount,
//    	    String description,
//    	    String keywords,
//    	    int categoryId
//    	);
//    int update(int id, String name, double price, int categoryId, String image, int stock);  // new
//    int delete(int id);  // new
//    int decrementStockIfAvailable(int productId, int qty);
//}


package com.example.demo.storeproduct.dao;

import java.util.List;
import java.util.Map;

public interface StoreProductRepository {
    List<Map<String, Object>> findByCategoryId(int categoryId);
    List<Map<String, Object>> findAll();
    Map<String, Object> findById(int id);

    int insert(

            String name,
            double price,
            String category,
            String subcategory,
            String image,
            double ratingStars,
            int ratingCount,
            String description,
            String keywords,
            int categoryId,
            int stock
    );

    int update(int id, String name, double price, int categoryId, String image, int stock);
    int delete(int id);
    int decrementStockIfAvailable(int productId, int qty);
}
