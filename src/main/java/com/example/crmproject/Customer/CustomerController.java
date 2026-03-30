package com.example.crmproject.Customer;

import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/v1/customers")
@CrossOrigin(origins = "http://localhost:5173", methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT})
public class CustomerController {

    private final CustomerService service;
    private final CustomerRepository repo;

    public CustomerController(CustomerService service, CustomerRepository repo) {
        this.service = service;
        this.repo = repo;
    }

    @GetMapping("/count")
    public long countCustomers() {
        return service.countCustomers();
    }

    @GetMapping
    public List<Customer> getAllCustomers() {
        return service.getAllCustomers();
    }

    @GetMapping("/search")
    public List<Customer> searchCustomers(@RequestParam(required = false) String q) {
       return service.searchCustomers(q);
    }


    @GetMapping("/exists")
    public boolean exists(@RequestParam String companyName) {
        return repo.existsByCompanyNameIgnoreCase(companyName);
    }

    @GetMapping("/{id}")
    public Customer getbyId(@PathVariable Long id) {
        return service.getById(id);
    }

    @PostMapping
    public Customer create(@RequestBody Customer customer) {
        return service.create(customer);
    }

    @PutMapping("/{id}")
    public Customer update(@PathVariable Long id, @RequestBody Customer customer) {
        return service.update(id, customer);
    }
}
