package com.example.crmproject.Tickets;

import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;


import java.util.List;

@RestController
@RequestMapping("/api/v1/tickets")
public class TicketController {

    private final TicketsService service;

    public TicketController(TicketsService service) {
        this.service = service;
    };

    @GetMapping
    public List<Tickets> getAllSortedByTicketNoAsc() {
        return service.getAllSortedByTicketNoAsc();
    }

    @GetMapping("/{id}")
    public Tickets getById(@PathVariable Long id) {
        return service.getById(id);
    }

    @GetMapping("/count")
    public long countTicketsByStatus(@RequestParam Tickets.TicketStatus status) {
        return service.countTicketsByStatus(status);
    }

    @GetMapping("/customers/{customerId}")
    public List<Tickets> getTicketsByCustomerId(@PathVariable Long customerId) {
        return service.getByCustomerId(customerId);
    };

    @GetMapping("/previous-30-days")
    public long getPrevious30DaysTickets() {
        return service.getPrevious30DaysTickets();
    }

    @GetMapping("/previous-30-days/closed")
    public long countClosedTickets() {
        return service.countClosedLast30Days();
    }

    @GetMapping("/count/not-closed")
    public long countNotClosed() {
        return service.countNotClosedTickets();
    }

    @PostMapping
    public Tickets create(@Valid @RequestBody Tickets.CreateTicketRequest req) {
        return service.create(req);
    }

    public record UpdateTicketStatusRequest(Tickets.TicketStatus status) {
    }

    @PutMapping("/{id}")
    public Tickets updateStatus(@PathVariable Long id, @RequestBody UpdateTicketStatusRequest request) {
        return service.updateStatus(id, request.status());
    }


}

