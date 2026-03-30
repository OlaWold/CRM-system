package com.example.crmproject.Customer;

import com.example.crmproject.Tickets.Tickets;
import jakarta.validation.Valid;
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

    @PostMapping
    public Customer create(@Valid @RequestBody Customer.CreateCustomerRequest req) {
        return service.create(req);
    }

    @GetMapping("/{id}")
    public Customer getbyId(@PathVariable Long id) {
        return service.getById(id);
    }


    @PutMapping("/{id}")
    public Customer update(@PathVariable Long id, @RequestBody Customer customer) {
        return service.update(id, customer);
    }
}
