package com.pccomponents.backend.repository;

import com.pccomponents.backend.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> {

    // Lọc sản phẩm theo category (không phân biệt hoa/thường)
    List<Product> findByCategoryIgnoreCase(String category);

    // Tìm kiếm sản phẩm theo tên (chứa từ khóa, không phân biệt hoa/thường)
    List<Product> findByNameContainingIgnoreCase(String name);

    // Kết hợp lọc theo category + tìm theo tên (dùng cho trang Store có filter)
    List<Product> findByCategoryIgnoreCaseAndNameContainingIgnoreCase(String category, String name);
}