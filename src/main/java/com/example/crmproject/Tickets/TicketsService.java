package com.example.crmproject.Tickets;


import com.example.crmproject.Customer.CustomerRepository;
import org.springframework.stereotype.Service;
import java.time.Instant;
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
        Tickets t = new Tickets();
        long nextTicketNo = repo.findMaxTicketNo() + 1;
        t.setDescription(req.description());
        t.setCompanyName(req.companyName());
        t.setContactName(req.contactName());
        t.setSubject(req.subject());
        t.setEmail(req.email());
        t.setPhone(req.phone());
        t.setTicketNo(nextTicketNo);
        t.setCreated(Instant.now() );
        t.setStatus(req.status());

        return repo.save(t);
    }

    public List<Tickets> findAll() {
        return repo.findAll();
    }

    public Tickets getByTicketNo(Long ticketNo) {
        return repo.findByTicketNo(ticketNo)
                .orElseThrow(() -> new RuntimeException("Ticket not found"));
    }

    public Tickets updateStatus(Long ticketNo, Tickets.TicketStatus status) {
        Tickets ticket = repo.findByTicketNo(ticketNo)
                .orElseThrow(() -> new RuntimeException("Ticket not found"));
        ticket.setStatus(status);
        ticket.setUpdatedLast(Instant.now());
        return repo.save(ticket);
    }
}