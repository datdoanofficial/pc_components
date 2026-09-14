package com.pccomponents.backend.config;

import com.pccomponents.backend.entity.Product;
import com.pccomponents.backend.repository.ProductRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataSeeder implements CommandLineRunner {

    private final ProductRepository productRepository;

    public DataSeeder(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    @Override
    public void run(String... args) {
        // Chỉ seed nếu database đang trống, tránh tạo trùng mỗi lần restart app
        if (productRepository.count() > 0) {
            return;
        }

        productRepository.save(new Product(
                "GIGABYTE AORUS GeForce RTX 4070 12GB ELITE",
                "GPU",
                799.00,
                15,
                "https://placehold.co/500x400/1a1a1a/eb7e63?text=RTX+4070",
                "Card đồ họa AORUS RTX 4070 với công nghệ WINDFORCE 3X, hiệu năng vượt trội cho gaming 1440p/4K.",
                "{\"VRAM\":\"12GB GDDR6X\",\"Boost Clock\":\"2550 MHz\",\"Interface\":\"PCIe 4.0\",\"Power\":\"200W\"}"
        ));

        productRepository.save(new Product(
                "Intel Core i7-14700K",
                "CPU",
                419.00,
                25,
                "https://placehold.co/500x400/1a1a1a/eb7e63?text=i7-14700K",
                "CPU thế hệ 14 của Intel, 20 nhân 28 luồng, hiệu năng đa nhiệm và gaming hàng đầu.",
                "{\"Cores\":\"20 (8P+12E)\",\"Threads\":\"28\",\"Base Clock\":\"3.4GHz\",\"Boost Clock\":\"5.6GHz\",\"Socket\":\"LGA1700\"}"
        ));

        productRepository.save(new Product(
                "ASUS ROG Strix Z790-E Gaming WiFi",
                "Mainboard",
                469.00,
                10,
                "https://placehold.co/500x400/1a1a1a/eb7e63?text=Z790-E",
                "Bo mạch chủ cao cấp hỗ trợ CPU Intel thế hệ 12-14, WiFi 6E, PCIe 5.0.",
                "{\"Chipset\":\"Z790\",\"Socket\":\"LGA1700\",\"RAM Slots\":\"4 x DDR5\",\"Max RAM\":\"128GB\",\"WiFi\":\"WiFi 6E\"}"
        ));

        productRepository.save(new Product(
                "Corsair Vengeance DDR5 32GB (2x16GB) 6000MHz",
                "RAM",
                129.00,
                40,
                "https://placehold.co/500x400/1a1a1a/eb7e63?text=Vengeance+DDR5",
                "Bộ nhớ RAM DDR5 hiệu năng cao, tản nhiệt nhôm, hỗ trợ Intel XMP 3.0.",
                "{\"Capacity\":\"32GB (2x16GB)\",\"Speed\":\"6000MHz\",\"Latency\":\"CL36\",\"Type\":\"DDR5\"}"
        ));

        productRepository.save(new Product(
                "Samsung 990 PRO 2TB NVMe SSD",
                "SSD",
                179.00,
                30,
                "https://placehold.co/500x400/1a1a1a/eb7e63?text=990+PRO+2TB",
                "Ổ cứng SSD NVMe PCIe 4.0 tốc độ cao, lý tưởng cho gaming và làm việc nặng.",
                "{\"Capacity\":\"2TB\",\"Interface\":\"PCIe 4.0 NVMe\",\"Read Speed\":\"7450 MB/s\",\"Write Speed\":\"6900 MB/s\"}"
        ));

        productRepository.save(new Product(
                "Corsair RM850x 850W 80+ Gold",
                "PSU",
                139.00,
                20,
                "https://placehold.co/500x400/1a1a1a/eb7e63?text=RM850x",
                "Nguồn máy tính 850W chuẩn 80+ Gold, full modular, hoạt động êm ái.",
                "{\"Wattage\":\"850W\",\"Efficiency\":\"80+ Gold\",\"Modular\":\"Full Modular\",\"Fan\":\"135mm Fluid Dynamic\"}"
        ));

        productRepository.save(new Product(
                "NZXT H510 Flow Mid Tower Case",
                "Case",
                89.00,
                18,
                "https://placehold.co/500x400/1a1a1a/eb7e63?text=H510+Flow",
                "Case máy tính mid-tower thiết kế tối giản, luồng khí lưu thông tốt.",
                "{\"Form Factor\":\"Mid Tower\",\"Motherboard Support\":\"ATX, mATX, ITX\",\"Front Panel\":\"Mesh Airflow\"}"
        ));

        productRepository.save(new Product(
                "Corsair iCUE H150i Elite Capellix 360mm AIO",
                "Cooling",
                219.00,
                12,
                "https://placehold.co/500x400/1a1a1a/eb7e63?text=H150i+Elite",
                "Tản nhiệt nước AIO 360mm với đèn LED Capellix, hiệu năng tản nhiệt xuất sắc cho CPU cao cấp.",
                "{\"Radiator Size\":\"360mm\",\"Fans\":\"3 x 120mm ML RGB\",\"Socket Support\":\"LGA1700/AM5 và nhiều loại khác\"}"
        ));
    }
}