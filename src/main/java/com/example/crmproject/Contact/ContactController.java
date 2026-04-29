package com.example.crmproject.Contact;

import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/contacts")
public class ContactController {

    private final ContactService service;

    public ContactController(ContactService service) {
        this.service = service;
    }

    @GetMapping
    public List<Contact> getAll() {
        return service.getAll();
    }

    @GetMapping("/count")
    public long count() {
        return service.count();
    }

    @GetMapping("/search")
    public List<Contact> search(@RequestParam(required = false) String q) {
        return service.search(q);
    }

    @GetMapping("/{id}")
    public Contact getById(@PathVariable Long id) {
        return service.getById(id);
    }

    @GetMapping("/customers/{customerId}")
    public List<Contact> getByCustomerId(@PathVariable Long customerId) {
        return service.getByCustomerId(customerId);
    }

    @PostMapping
    public Contact create(@Valid @RequestBody Contact.CreateContactRequest req) {
        return service.create(req);
    }

    @PutMapping("/{id}")
    public Contact update(@PathVariable Long id, @Valid @RequestBody Contact.UpdateContactRequest req) {
        return service.update(id, req);
    }
}
