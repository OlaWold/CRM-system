package com.example.crmproject.Product;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductService {

    private final ProductRepository repo;

    public ProductService(ProductRepository repo) {
        this.repo = repo;
    }

    public List<Product> getAll() {
        return repo.findAllByOrderByIdDesc();
    }

    public Product getById(Long id) {
        return repo.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Fant ikke produkt med id " + id));
    }

    public List<Product> search(String q) {
        if (q == null || q.isBlank()) {
            return getAll();
        }
        return repo.findByNameContainingIgnoreCase(q);
    }

    public Product create(Product.CreateProductRequest req) {
        Product p = new Product();
        p.setProductNo(repo.findMaxProductNo() + 1);
        p.setName(req.name());
        p.setDescription(req.description());
        p.setPrice(req.price());
        return repo.save(p);
    }

    public Product update(Long id, Product.UpdateProductRequest req) {
        Product existing = getById(id);
        existing.setName(req.name());
        existing.setDescription(req.description());
        existing.setPrice(req.price());
        return repo.save(existing);
    }

    public long count() {
        return repo.count();
    }
}
