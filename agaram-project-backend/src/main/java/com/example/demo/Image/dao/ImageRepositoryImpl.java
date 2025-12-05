//package com.example.demo.Image.dao;
//
//
//import com.example.demo.Image.dao.ImageRepository;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.jdbc.core.JdbcTemplate;
//import org.springframework.stereotype.Repository;
//
//import java.util.Map;
//
//@Repository
//public class ImageRepositoryImpl implements ImageRepository {
//
//    @Autowired
//    private JdbcTemplate jdbcTemplate;
//
//    @Override
//    public void save(String name, String type, byte[] data) {
//        String sql = "INSERT INTO images (name, type, data) VALUES (?, ?, ?)";
//        jdbcTemplate.update(sql, ps -> {
//            ps.setString(1, name);
//            ps.setString(2, type);
//            ps.setBytes(3, data);  // ensure MSSQL knows this is a BLOB
//        });
//    }
//
//    @Override
//    public Map<String, Object> findById(int id) {
//        String sql = "SELECT * FROM images WHERE id = ?";
//        try {
//            return jdbcTemplate.queryForMap(sql, id);
//        } catch (Exception e) {
//            return null;
//        }
//    }
//}
//
