package com.example.crmproject.CustomerProduct;

import com.example.crmproject.Customer.Customer;
import com.example.crmproject.Customer.CustomerRepository;
import com.example.crmproject.Product.Product;
import com.example.crmproject.Product.ProductRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CustomerProductService {

    private final CustomerProductRepository repo;
    private final CustomerRepository customerRepo;
    private final ProductRepository productRepo;

    public CustomerProductService(
            CustomerProductRepository repo,
            CustomerRepository customerRepo,
            ProductRepository productRepo
    ) {
        this.repo = repo;
        this.customerRepo = customerRepo;
        this.productRepo = productRepo;
    }

    public List<CustomerProduct> getByCustomerId(Long customerId) {
        return repo.findByCustomerIdOrderByAddedAtDesc(customerId);
    }

    public CustomerProduct assign(Long customerId, Long productId) {
        if (repo.existsByCustomerIdAndProductId(customerId, productId)) {
            throw new IllegalArgumentException("Produktet er allerede knyttet til kunden");
        }
        Customer customer = customerRepo.findById(customerId)
                .orElseThrow(() -> new IllegalArgumentException("Fant ikke kunde med id " + customerId));
        Product product = productRepo.findById(productId)
                .orElseThrow(() -> new IllegalArgumentException("Fant ikke produkt med id " + productId));

        return repo.save(new CustomerProduct(customer, product));
    }

    public void remove(Long customerId, Long linkId) {
        CustomerProduct link = repo.findById(linkId)
                .orElseThrow(() -> new IllegalArgumentException("Fant ikke kobling med id " + linkId));
        if (!link.getCustomer().getId().equals(customerId)) {
            throw new IllegalArgumentException("Koblingen tilhører ikke kunden");
        }
        repo.delete(link);
    }
}
