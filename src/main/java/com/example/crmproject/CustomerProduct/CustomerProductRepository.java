package com.example.crmproject.CustomerProduct;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CustomerProductRepository extends JpaRepository<CustomerProduct, Long> {

    List<CustomerProduct> findByCustomerIdOrderByAddedAtDesc(Long customerId);

    Optional<CustomerProduct> findByCustomerIdAndProductId(Long customerId, Long productId);

    boolean existsByCustomerIdAndProductId(Long customerId, Long productId);
}
