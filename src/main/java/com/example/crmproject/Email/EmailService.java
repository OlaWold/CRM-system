package com.example.crmproject.Email;

import com.example.crmproject.Contact.Contact;
import com.example.crmproject.Contact.ContactRepository;
import com.example.crmproject.Customer.Customer;
import com.example.crmproject.Customer.CustomerRepository;
import com.example.crmproject.Tickets.Tickets;
import com.example.crmproject.Tickets.TicketsRepository;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Optional;

@Service
public class EmailService {

    private final CustomerRepository customerRepo;
    private final ContactRepository contactRepo;
    private final TicketsRepository ticketRepo;

    public EmailService(
            CustomerRepository customerRepo,
            ContactRepository contactRepo,
            TicketsRepository ticketRepo
    ) {
        this.customerRepo = customerRepo;
        this.contactRepo = contactRepo;
        this.ticketRepo = ticketRepo;
    }

    public Tickets processIncoming(IncomingEmailRequest req) {
        if (req.fromEmail() == null || req.fromEmail().isBlank()) {
            throw new IllegalArgumentException("fromEmail må være satt");
        }
        if (req.subject() == null || req.subject().isBlank()) {
            throw new IllegalArgumentException("subject må være satt");
        }

        String email = req.fromEmail().trim();

        Optional<Contact> contactMatch = contactRepo.findFirstByEmailIgnoreCase(email);
        Optional<Customer> customerMatch = contactMatch.isPresent()
                ? Optional.of(contactMatch.get().getCustomer())
                : customerRepo.findByEmailIgnoreCase(email);

        Tickets t = new Tickets();
        long nextTicketNo = ticketRepo.findMaxTicketNo() + 1;
        t.setTicketNo(nextTicketNo);
        t.setSubject(req.subject().trim());
        t.setDescription(req.body() != null ? req.body() : "");
        t.setEmail(email);
        t.setCreated(Instant.now());
        t.setStatus(Tickets.TicketStatus.OPEN);

        if (customerMatch.isPresent()) {
            Customer c = customerMatch.get();
            t.setCustomer(c);
            t.setCompanyName(c.getCompanyName());
            t.setPhone(unknownIfBlank(
                    contactMatch.map(Contact::getPhone).orElse(c.getPhone())
            ));
            String contactName = contactMatch
                    .map(ct -> ct.getFirstName() + " " + ct.getLastName())
                    .orElseGet(() -> c.getFirstName() + " " + c.getLastName());
            t.setContactName(contactName);
        } else {
            t.setCustomer(null);
            t.setCompanyName(unknownIfBlank(extractDomain(email)));
            t.setContactName(unknownIfBlank(
                    req.fromName() != null && !req.fromName().isBlank()
                            ? req.fromName().trim()
                            : email
            ));
            t.setPhone("(ukjent)");
        }

        return ticketRepo.save(t);
    }

    private static String unknownIfBlank(String value) {
        return value == null || value.isBlank() ? "(ukjent)" : value;
    }

    private static String extractDomain(String email) {
        int at = email.indexOf('@');
        if (at < 0 || at == email.length() - 1) return null;
        return email.substring(at + 1);
    }
}
