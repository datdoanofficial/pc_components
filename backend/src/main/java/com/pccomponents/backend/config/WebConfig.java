package com.pccomponents.backend.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * Cấu hình CORS toàn cục, áp dụng cho mọi Controller trong ứng dụng
 * (không cần khai báo @CrossOrigin lặp lại ở từng Controller).
 * Nếu ProductController đã có @CrossOrigin riêng, cấu hình này vẫn hoạt động
 * song song và không xung đột.
 */
@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOrigins("http://localhost:4200")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true);
    }
}