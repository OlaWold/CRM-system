package com.example.crmproject.Customer;

import com.example.crmproject.Tickets.Tickets;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.RequestParam;


@Service
public class CustomerService {

    private final CustomerRepository repo;

    public CustomerService(CustomerRepository repo) {
        this.repo = repo;
    }

    public List<Customer> getAllCustomers() {
        return repo.findAllByOrderByIdDesc();
    }


    public Customer create(Customer.CreateCustomerRequest req) {
        Customer c = new Customer();
        Long nextCustomerNo = repo.findMaxCustomerNo() + 1;
        c.setCustomerNo(nextCustomerNo);
        c.setCompanyName(req.companyName());
        c.setOrgNumber(req.orgNumber());
        c.setFirstName(req.firstName());
        c.setLastName(req.lastName());
        c.setEmail(req.email());
        c.setPhone(req.phone());

        return repo.save(c);
    }


    public List<Customer> searchCustomers(String q) {
        try {
            Long customerNo = Long.parseLong(q);
            return repo.findByCompanyNameContainingIgnoreCaseOrCustomerNo(q, customerNo);
        } catch (NumberFormatException e) {
            return repo.findByCompanyNameContainingIgnoreCase(q);
        }
    }

    public Customer getById(Long id) {
        return repo.findById(id).orElseThrow();
    }

    public Customer update(Long id, Customer input) {
        Customer existing = repo.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Fant ikke kunde med id " + id));

        existing.setCustomerNo(input.getCustomerNo());
        existing.setCompanyName(input.getCompanyName());
        existing.setFirstName(input.getFirstName());
        existing.setLastName(input.getLastName());
        existing.setEmail(input.getEmail());
        existing.setPhone(input.getPhone());

        return repo.save(existing);
    }

    public long countCustomers() {
        return repo.count();
    }


}
