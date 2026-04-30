package com.example.crmproject.CustomerProduct;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/customers/{customerId}/products")
public class CustomerProductController {

    private final CustomerProductService service;

    public CustomerProductController(CustomerProductService service) {
        this.service = service;
    }

    @GetMapping
    public List<CustomerProduct> list(@PathVariable Long customerId) {
        return service.getByCustomerId(customerId);
    }

    @PostMapping
    public CustomerProduct assign(
            @PathVariable Long customerId,
            @RequestBody CustomerProduct.AssignProductRequest req
    ) {
        return service.assign(customerId, req.productId());
    }

    @DeleteMapping("/{linkId}")
    public void remove(@PathVariable Long customerId, @PathVariable Long linkId) {
        service.remove(customerId, linkId);
    }
}
