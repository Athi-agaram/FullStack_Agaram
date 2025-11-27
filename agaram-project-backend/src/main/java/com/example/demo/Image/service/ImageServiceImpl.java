package com.example.demo.Image.service;


import com.example.demo.Image.dao.ImageRepository;
import com.example.demo.Image.service.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@Service
public class ImageServiceImpl implements ImageService {

    @Autowired
    private ImageRepository imageRepository;

    @Override
    public void saveImage(MultipartFile file) throws IOException {
        imageRepository.save(
                file.getOriginalFilename(),
                file.getContentType(),
                file.getBytes()
        );
    }

    @Override
    public Map<String, Object> getImage(int id) {
        return imageRepository.findById(id);
    }
}
