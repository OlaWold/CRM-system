package com.example.crmproject.Tickets;

import com.example.crmproject.Customer.Customer;
import com.example.crmproject.Customer.CustomerRepository;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
public class TicketsService {
    private final TicketsRepository repo;
    private final CustomerRepository customerRepo;

    public TicketsService(TicketsRepository repo, CustomerRepository customerRepo) {
        this.repo = repo;
        this.customerRepo = customerRepo;
    }

    public Tickets create(Tickets.CreateTicketRequest req) {
        Customer customer = customerRepo.findById(req.customerId())
                .orElseThrow(() -> new RuntimeException("Customer not found"));

        Tickets t = new Tickets();
        long nextTicketNo = repo.findMaxTicketNo() + 1;
        t.setDescription(req.description());
        t.setCompanyName(req.companyName());
        t.setContactName(req.contactName());
        t.setSubject(req.subject());
        t.setEmail(req.email());
        t.setPhone(req.phone());
        t.setTicketNo(nextTicketNo);
        t.setCreated(Instant.now());
        t.setStatus(req.status());
        t.setCustomer(customer);


        return repo.save(t);
    }

    public List<Tickets> getAllSortedByTicketNoAsc() {
        return repo.findAllByOrderByTicketNoAsc();
    }

    public Tickets getById(Long id) {
        return repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Ticket not found"));
    }

    public List<Tickets> getByCustomerId(Long customerId) {
       return repo.findByCustomerId(customerId);
    }

    public Tickets updateStatus(Long id, Tickets.TicketStatus status) {
        Tickets ticket = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Ticket not found"));
        ticket.setStatus(status);
        ticket.setUpdatedLast(Instant.now());
        return repo.save(ticket);
    }

    public long getPrevious30DaysTickets() {
        Instant to = Instant.now();
        Instant from = Instant.now().minus(30, ChronoUnit.DAYS);

        return repo.countFindByCreatedBetween(from, to);
    }

    public long countClosedLast30Days() {
        Instant thirtyDaysAgo = Instant.now().minus(30, ChronoUnit.DAYS);

        return repo.countByStatusAndUpdatedLastAfter(
                Tickets.TicketStatus.CLOSED,
                thirtyDaysAgo
        );
    }

    public long countTicketsByStatus(Tickets.TicketStatus status) {
        return repo.countByStatus(status);
    }

    public long countNotClosedTickets() {
        return repo.countByStatusNot(Tickets.TicketStatus.CLOSED);
    }

}