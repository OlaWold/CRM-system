package com.example.crmproject.Customer;

import com.example.crmproject.Ai.AiService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/customers")
@CrossOrigin(origins = "http://localhost:5173", methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT})
public class CustomerController {

    private final CustomerService service;
    private final CustomerRepository repo;
    private final AiService aiService;

    public CustomerController(CustomerService service, CustomerRepository repo, AiService aiService) {
        this.service = service;
        this.repo = repo;
        this.aiService = aiService;
    }

    @GetMapping("/count")
    public long countCustomers() {
        return service.countCustomers();
    }

    @GetMapping("/stats")
    public CustomerStats stats() {
        return service.stats();
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

    @PostMapping("/{id}/ai-summary")
    public Map<String, String> aiSummary(@PathVariable Long id) {
        return Map.of("summary", aiService.summarizeCustomer(id));
    }
}
