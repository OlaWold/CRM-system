package com.example.crmproject.Product;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    List<Product> findAllByOrderByIdDesc();

    List<Product> findByNameContainingIgnoreCase(String name);

    @Query("select coalesce(max(p.productNo), 0) from Product p")
    long findMaxProductNo();
}
