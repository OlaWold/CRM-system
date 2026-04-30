package com.example.crmproject.Tickets;

import com.example.crmproject.Ai.AiService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;


import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/tickets")
public class TicketController {

    private final TicketsService service;
    private final AiService aiService;

    public TicketController(TicketsService service, AiService aiService) {
        this.service = service;
        this.aiService = aiService;
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

    @GetMapping("/incoming")
    public List<Tickets> getIncomingTickets() {
        return service.getIncomingTickets();
    }

    public record AssignCustomerRequest(Long customerId) {}

    @PutMapping("/{id}/assign-customer")
    public Tickets assignCustomer(@PathVariable Long id, @RequestBody AssignCustomerRequest req) {
        return service.assignCustomer(id, req.customerId());
    }

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

    @GetMapping("/weekly-stats")
    public List<WeekStats> weeklyStats(@RequestParam(defaultValue = "8") int weeks) {
        return service.weeklyStats(weeks);
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

    @PostMapping("/{id}/ai-summary")
    public Map<String, String> aiSummary(@PathVariable Long id) {
        return Map.of("summary", aiService.summarizeTicket(id));
    }

    @PostMapping("/{id}/ai-reply")
    public Map<String, String> aiReply(@PathVariable Long id) {
        return Map.of("reply", aiService.suggestTicketReply(id));
    }
}

