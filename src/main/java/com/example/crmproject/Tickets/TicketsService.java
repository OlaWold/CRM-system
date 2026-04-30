package com.example.crmproject.Tickets;

import com.example.crmproject.Customer.Customer;
import com.example.crmproject.Customer.CustomerRepository;
import org.springframework.stereotype.Service;

import java.time.DayOfWeek;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
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

    public List<Tickets> getIncomingTickets() {
        return repo.findByCustomerIsNullOrderByCreatedDesc();
    }

    public Tickets assignCustomer(Long ticketId, Long customerId) {
        Tickets ticket = repo.findById(ticketId)
                .orElseThrow(() -> new RuntimeException("Ticket not found"));
        Customer customer = customerRepo.findById(customerId)
                .orElseThrow(() -> new RuntimeException("Customer not found"));
        ticket.setCustomer(customer);
        ticket.setCompanyName(customer.getCompanyName());
        if ("(ukjent)".equals(ticket.getContactName())) {
            ticket.setContactName(customer.getFirstName() + " " + customer.getLastName());
        }
        if ("(ukjent)".equals(ticket.getPhone())) {
            ticket.setPhone(customer.getPhone());
        }
        ticket.setUpdatedLast(Instant.now());
        return repo.save(ticket);
    }

    public List<WeekStats> weeklyStats(int weeks) {
        if (weeks <= 0 || weeks > 52) weeks = 8;
        ZoneId zone = ZoneId.systemDefault();
        LocalDate currentMonday = LocalDate.now(zone).with(DayOfWeek.MONDAY);

        List<WeekStats> result = new ArrayList<>();
        for (int i = weeks - 1; i >= 0; i--) {
            LocalDate weekStart = currentMonday.minusWeeks(i);
            LocalDate weekEnd = weekStart.plusWeeks(1);

            Instant from = weekStart.atStartOfDay(zone).toInstant();
            Instant to = weekEnd.atStartOfDay(zone).toInstant();

            long newCount = repo.countByCreatedBetween(from, to);
            long closedCount = repo.countByStatusAndUpdatedLastBetween(
                    Tickets.TicketStatus.CLOSED, from, to
            );

            result.add(new WeekStats(weekStart, newCount, closedCount));
        }
        return result;
    }
}