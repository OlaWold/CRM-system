package com.example.crmproject.Email;

import com.example.crmproject.Tickets.Tickets;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/emails")
public class EmailController {

    private final EmailService service;

    public EmailController(EmailService service) {
        this.service = service;
    }

    @PostMapping("/import")
    public Tickets importEmail(@Valid @RequestBody IncomingEmailRequest req) {
        return service.processIncoming(req);
    }
}
