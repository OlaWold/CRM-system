package com.example.crmproject.CustomerProduct;

import com.example.crmproject.Customer.Customer;
import com.example.crmproject.Product.Product;
import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;

@Entity
@Table(
        name = "CustomerProduct",
        uniqueConstraints = @UniqueConstraint(columnNames = {"customer_id", "product_id"})
)
public class CustomerProduct {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "customer_id", nullable = false)
    private Customer customer;

    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @CreationTimestamp
    @Column(name = "added_at", nullable = false, updatable = false)
    private Instant addedAt;

    protected CustomerProduct() {
    }

    public CustomerProduct(Customer customer, Product product) {
        this.customer = customer;
        this.product = product;
    }

    public record AssignProductRequest(Long productId) {}

    public Long getId() { return id; }

    public Customer getCustomer() { return customer; }
    public void setCustomer(Customer customer) { this.customer = customer; }

    public Product getProduct() { return product; }
    public void setProduct(Product product) { this.product = product; }

    public Instant getAddedAt() { return addedAt; }
}
