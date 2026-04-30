package com.example.crmproject.Product;

import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/products")
public class ProductController {

    private final ProductService service;

    public ProductController(ProductService service) {
        this.service = service;
    }

    @GetMapping
    public List<Product> getAll() {
        return service.getAll();
    }

    @GetMapping("/search")
    public List<Product> search(@RequestParam(required = false) String q) {
        return service.search(q);
    }

    @GetMapping("/count")
    public long count() {
        return service.count();
    }

    @GetMapping("/{id}")
    public Product getById(@PathVariable Long id) {
        return service.getById(id);
    }

    @PostMapping
    public Product create(@Valid @RequestBody Product.CreateProductRequest req) {
        return service.create(req);
    }

    @PutMapping("/{id}")
    public Product update(@PathVariable Long id, @Valid @RequestBody Product.UpdateProductRequest req) {
        return service.update(id, req);
    }
}
