package com.example.demo.Image.service;


import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

public interface ImageService {
    void saveImage(MultipartFile file) throws IOException;
    Map<String, Object> getImage(int id);
}
