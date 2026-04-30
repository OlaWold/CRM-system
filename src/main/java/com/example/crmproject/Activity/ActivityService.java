package com.example.crmproject.Activity;

import com.example.crmproject.Contact.Contact;
import com.example.crmproject.Contact.ContactRepository;
import com.example.crmproject.Customer.Customer;
import com.example.crmproject.Customer.CustomerRepository;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;

@Service
public class ActivityService {

    private final ActivityRepository repo;
    private final CustomerRepository customerRepo;
    private final ContactRepository contactRepo;

    public ActivityService(
            ActivityRepository repo,
            CustomerRepository customerRepo,
            ContactRepository contactRepo
    ) {
        this.repo = repo;
        this.customerRepo = customerRepo;
        this.contactRepo = contactRepo;
    }

    public List<Activity> getAll() {
        return repo.findAllByOrderByScheduledAtAsc();
    }

    public Activity getById(Long id) {
        return repo.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Fant ikke aktivitet med id " + id));
    }

    public List<Activity> getByCustomerId(Long customerId) {
        return repo.findByCustomerIdOrderByScheduledAtDesc(customerId);
    }

    public List<Activity> getInRange(Instant from, Instant to) {
        return repo.findByScheduledAtBetweenOrderByScheduledAtAsc(from, to);
    }

    public List<Activity> getUpcoming() {
        return repo.findByStatusAndScheduledAtAfterOrderByScheduledAtAsc(
                Activity.ActivityStatus.PLANNED, Instant.now()
        );
    }

    public Activity create(Activity.CreateActivityRequest req) {
        Customer customer = customerRepo.findById(req.customerId())
                .orElseThrow(() -> new IllegalArgumentException("Fant ikke kunde med id " + req.customerId()));

        Contact contact = null;
        if (req.contactId() != null) {
            contact = contactRepo.findById(req.contactId())
                    .orElseThrow(() -> new IllegalArgumentException(
                            "Fant ikke kontakt med id " + req.contactId()));
        }

        Activity a = new Activity();
        a.setActivityNo(repo.findMaxActivityNo() + 1);
        a.setTitle(req.title());
        a.setDescription(req.description());
        a.setScheduledAt(req.scheduledAt());
        a.setDurationMinutes(req.durationMinutes());
        a.setType(req.type());
        a.setCustomer(customer);
        a.setContact(contact);

        return repo.save(a);
    }

    public Activity update(Long id, Activity.UpdateActivityRequest req) {
        Activity existing = getById(id);
        Contact contact = null;
        if (req.contactId() != null) {
            contact = contactRepo.findById(req.contactId())
                    .orElseThrow(() -> new IllegalArgumentException(
                            "Fant ikke kontakt med id " + req.contactId()));
        }
        existing.setTitle(req.title());
        existing.setDescription(req.description());
        existing.setScheduledAt(req.scheduledAt());
        existing.setDurationMinutes(req.durationMinutes());
        existing.setType(req.type());
        existing.setContact(contact);
        return repo.save(existing);
    }

    public Activity updateStatus(Long id, Activity.ActivityStatus status) {
        Activity existing = getById(id);
        existing.setStatus(status);
        return repo.save(existing);
    }

    public void delete(Long id) {
        repo.deleteById(id);
    }
}
