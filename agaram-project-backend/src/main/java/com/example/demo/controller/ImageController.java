package com.example.demo.controller;

import com.example.demo.Image.service.*;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@CrossOrigin(origins = "*") // allow your frontend origin
@RequestMapping("/api/images")
public class ImageController {

    @Autowired
    private ImageService imageService;

    @PostMapping("/upload")
    public ResponseEntity<Map<String, Object>> uploadImage(@RequestParam("file") MultipartFile file) {
        try {
            imageService.saveImage(file);

            Map<String, Object> resp = new HashMap<>();
            resp.put("success", true);
            resp.put("filename", file.getOriginalFilename());

            return ResponseEntity.ok(resp);

        } catch (Exception e) {
            e.printStackTrace();
            Map<String, Object> resp = new HashMap<>();
            resp.put("success", false);
            resp.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(resp);
        }
    }



    @GetMapping("/{id}")
    public ResponseEntity<byte[]> getImage(@PathVariable int id) {

        // Fetch record as a Map instead of model object
        var image = imageService.getImage(id);

        if (image == null) {
            return ResponseEntity.notFound().build();
        }

        byte[] data = (byte[]) image.get("data");
        String contentType = (String) image.get("type");

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.parseMediaType(contentType));

        return new ResponseEntity<>(data, headers, HttpStatus.OK);
    }
}
