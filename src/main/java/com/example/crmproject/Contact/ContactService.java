package com.example.crmproject.Contact;

import com.example.crmproject.Customer.Customer;
import com.example.crmproject.Customer.CustomerRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ContactService {

    private final ContactRepository repo;
    private final CustomerRepository customerRepo;

    public ContactService(ContactRepository repo, CustomerRepository customerRepo) {
        this.repo = repo;
        this.customerRepo = customerRepo;
    }

    public List<Contact> getAll() {
        return repo.findAllByOrderByIdDesc();
    }

    public Contact getById(Long id) {
        return repo.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Fant ikke kontakt med id " + id));
    }

    public List<Contact> getByCustomerId(Long customerId) {
        return repo.findByCustomerId(customerId);
    }

    public List<Contact> search(String q) {
        if (q == null || q.isBlank()) {
            return getAll();
        }
        return repo.findByLastNameContainingIgnoreCaseOrFirstNameContainingIgnoreCase(q, q);
    }

    public Contact create(Contact.CreateContactRequest req) {
        Customer customer = customerRepo.findById(req.customerId())
                .orElseThrow(() -> new IllegalArgumentException("Fant ikke kunde med id " + req.customerId()));

        Contact c = new Contact();
        c.setContactNo(repo.findMaxContactNo() + 1);
        c.setFirstName(req.firstName());
        c.setLastName(req.lastName());
        c.setEmail(req.email());
        c.setPhone(req.phone());
        c.setRole(req.role());
        c.setCustomer(customer);

        return repo.save(c);
    }

    public Contact update(Long id, Contact.UpdateContactRequest req) {
        Contact existing = getById(id);
        existing.setFirstName(req.firstName());
        existing.setLastName(req.lastName());
        existing.setEmail(req.email());
        existing.setPhone(req.phone());
        existing.setRole(req.role());
        return repo.save(existing);
    }

    public long count() {
        return repo.count();
    }
}
