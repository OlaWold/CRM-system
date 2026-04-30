package com.example.crmproject.Customer;

import com.example.crmproject.Tickets.Tickets;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
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

    public CustomerStats stats() {
        Instant now = Instant.now();
        Instant t30 = now.minus(30, ChronoUnit.DAYS);
        Instant t60 = now.minus(60, ChronoUnit.DAYS);
        Instant t90 = now.minus(90, ChronoUnit.DAYS);
        Instant t180 = now.minus(180, ChronoUnit.DAYS);
        Instant t365 = now.minus(365, ChronoUnit.DAYS);
        Instant t730 = now.minus(730, ChronoUnit.DAYS);

        long last30 = repo.countByCreatedAfter(t30);
        long last60 = repo.countByCreatedAfter(t60);

        long prev30 = repo.countByCreatedBetween(t60, t30);
        long curr90 = repo.countByCreatedAfter(t90);
        long prev90 = repo.countByCreatedBetween(t180, t90);
        long curr180 = repo.countByCreatedAfter(t180);
        long prev180 = repo.countByCreatedBetween(t365, t180);
        long curr365 = repo.countByCreatedAfter(t365);
        long prev365 = repo.countByCreatedBetween(t730, t365);

        return new CustomerStats(
                repo.count(),
                last30,
                last60,
                growth(last30, prev30),
                growth(curr90, prev90),
                growth(curr180, prev180),
                growth(curr365, prev365)
        );
    }

    private Double growth(long current, long previous) {
        if (previous == 0) return null;
        return ((double) (current - previous) / previous) * 100.0;
    }
}
