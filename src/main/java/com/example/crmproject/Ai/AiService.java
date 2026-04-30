package com.example.crmproject.Ai;

import com.example.crmproject.Activity.Activity;
import com.example.crmproject.Activity.ActivityRepository;
import com.example.crmproject.Contact.Contact;
import com.example.crmproject.Contact.ContactRepository;
import com.example.crmproject.Customer.Customer;
import com.example.crmproject.Customer.CustomerRepository;
import com.example.crmproject.CustomerProduct.CustomerProduct;
import com.example.crmproject.CustomerProduct.CustomerProductRepository;
import com.example.crmproject.Notes.Notes;
import com.example.crmproject.Notes.NotesRepository;
import com.example.crmproject.Tickets.Tickets;
import com.example.crmproject.Tickets.TicketsRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.ResourceAccessException;

import java.time.Duration;
import java.time.LocalDate;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;

import org.springframework.http.client.SimpleClientHttpRequestFactory;

@Service
public class AiService {

    private static final DateTimeFormatter DATE_FMT = DateTimeFormatter.ofPattern("dd.MM.yyyy");

    private final CustomerRepository customerRepo;
    private final TicketsRepository ticketRepo;
    private final ContactRepository contactRepo;
    private final ActivityRepository activityRepo;
    private final CustomerProductRepository customerProductRepo;
    private final NotesRepository notesRepo;

    @Value("${ollama.base-url:http://localhost:11434}")
    private String baseUrl;

    @Value("${ollama.model:llama3.2}")
    private String model;

    private RestClient restClient;

    public AiService(
            CustomerRepository customerRepo,
            TicketsRepository ticketRepo,
            ContactRepository contactRepo,
            ActivityRepository activityRepo,
            CustomerProductRepository customerProductRepo,
            NotesRepository notesRepo
    ) {
        this.customerRepo = customerRepo;
        this.ticketRepo = ticketRepo;
        this.contactRepo = contactRepo;
        this.activityRepo = activityRepo;
        this.customerProductRepo = customerProductRepo;
        this.notesRepo = notesRepo;
    }

    @PostConstruct
    void init() {
        SimpleClientHttpRequestFactory factory = new SimpleClientHttpRequestFactory();
        factory.setConnectTimeout((int) Duration.ofSeconds(5).toMillis());
        factory.setReadTimeout((int) Duration.ofSeconds(120).toMillis());
        this.restClient = RestClient.builder()
                .baseUrl(baseUrl)
                .requestFactory(factory)
                .build();
    }

    public String summarizeTicket(Long ticketId) {
        Tickets ticket = ticketRepo.findById(ticketId)
                .orElseThrow(() -> new IllegalArgumentException("Fant ikke ticket med id " + ticketId));
        List<Notes> notes = notesRepo.findAllByTicketId(ticketId).stream()
                .sorted((a, b) -> a.getCreatedAt().compareTo(b.getCreatedAt()))
                .toList();
        return callOllama(buildTicketSummaryPrompt(ticket, notes));
    }

    public String suggestTicketReply(Long ticketId) {
        Tickets ticket = ticketRepo.findById(ticketId)
                .orElseThrow(() -> new IllegalArgumentException("Fant ikke ticket med id " + ticketId));
        if (ticket.getStatus() == Tickets.TicketStatus.CLOSED) {
            throw new IllegalArgumentException("Saken er lukket — kan ikke foreslå svar.");
        }
        List<Notes> notes = notesRepo.findAllByTicketId(ticketId).stream()
                .sorted((a, b) -> a.getCreatedAt().compareTo(b.getCreatedAt()))
                .toList();
        return callOllama(buildTicketReplyPrompt(ticket, notes));
    }

    private String buildTicketSummaryPrompt(Tickets ticket, List<Notes> notes) {
        StringBuilder sb = new StringBuilder();
        sb.append("Du lager korte sammendrag av support-saker i et CRM-system. Skriv på norsk.\n\n");
        sb.append("Sak #").append(ticket.getTicketNo()).append("\n");
        sb.append("Emne: ").append(ticket.getSubject()).append("\n");
        sb.append("Status: ").append(ticket.getStatus()).append("\n");
        sb.append("Bedrift: ").append(ticket.getCompanyName()).append("\n");
        sb.append("Kontaktperson: ").append(ticket.getContactName()).append("\n");
        if (ticket.getCreated() != null) {
            sb.append("Opprettet: ").append(
                    DATE_FMT.format(ticket.getCreated().atZone(ZoneId.systemDefault()))
            ).append("\n");
        }
        if (ticket.getUpdatedLast() != null) {
            sb.append("Sist oppdatert: ").append(
                    DATE_FMT.format(ticket.getUpdatedLast().atZone(ZoneId.systemDefault()))
            ).append("\n");
        }
        sb.append("\nBeskrivelse fra kunde:\n").append(ticket.getDescription()).append("\n\n");

        sb.append("Notater (").append(notes.size()).append("):\n");
        if (notes.isEmpty()) {
            sb.append("- ingen\n");
        } else {
            for (Notes n : notes) {
                String date = n.getCreatedAt() != null
                        ? DATE_FMT.format(n.getCreatedAt().atZone(ZoneId.systemDefault()))
                        : "";
                sb.append("- [").append(date).append("] ").append(n.getText()).append("\n");
            }
        }

        sb.append("\nLag et kort sammendrag (2-4 setninger) som beskriver: hva saken handler om, ");
        sb.append("hva som er gjort, og hva som mangler eller står åpent. ");
        sb.append("Skriv naturlig og konkret. Svar med kun selve sammendraget — ingen overskrift, ingen innledning.");
        return sb.toString();
    }

    private String buildTicketReplyPrompt(Tickets ticket, List<Notes> notes) {
        StringBuilder sb = new StringBuilder();
        sb.append("Du er en kundeservice-medarbeider og skal foreslå et svar til en kunde. Skriv på norsk.\n\n");
        sb.append("Sak: ").append(ticket.getSubject()).append("\n");
        sb.append("Status: ").append(ticket.getStatus()).append("\n");
        sb.append("Bedrift: ").append(ticket.getCompanyName()).append("\n");
        sb.append("Kontaktperson: ").append(ticket.getContactName()).append("\n\n");
        sb.append("Beskrivelse fra kunden:\n").append(ticket.getDescription()).append("\n\n");

        sb.append("Interne notater (").append(notes.size()).append("):\n");
        if (notes.isEmpty()) {
            sb.append("- ingen\n");
        } else {
            for (Notes n : notes) {
                String date = n.getCreatedAt() != null
                        ? DATE_FMT.format(n.getCreatedAt().atZone(ZoneId.systemDefault()))
                        : "";
                sb.append("- [").append(date).append("] ").append(n.getText()).append("\n");
            }
        }

        sb.append("\nSkriv et høflig og profesjonelt svarforslag på 3-5 setninger til kunden. ");
        sb.append("Adresser problemet, gi en oppdatering basert på notatene, og foreslå neste steg. ");
        sb.append("Bruk kontaktpersonens fornavn som tiltale. Ikke bruk overskrift eller signatur — ");
        sb.append("kun selve meldingsteksten klar til å limes inn i en e-post.");
        return sb.toString();
    }

    public String summarizeCustomer(Long customerId) {
        Customer customer = customerRepo.findById(customerId)
                .orElseThrow(() -> new IllegalArgumentException("Fant ikke kunde med id " + customerId));

        List<Tickets> tickets = ticketRepo.findByCustomerId(customerId);
        List<Contact> contacts = contactRepo.findByCustomerId(customerId);
        List<Activity> activities = activityRepo.findByCustomerIdOrderByScheduledAtDesc(customerId);
        List<CustomerProduct> products = customerProductRepo.findByCustomerIdOrderByAddedAtDesc(customerId);

        String prompt = buildPrompt(customer, tickets, contacts, activities, products);
        return callOllama(prompt);
    }

    private String buildPrompt(
            Customer customer,
            List<Tickets> tickets,
            List<Contact> contacts,
            List<Activity> activities,
            List<CustomerProduct> products
    ) {
        StringBuilder sb = new StringBuilder();
        sb.append("Du lager korte sammendrag av kundeaktivitet i et CRM-system. Skriv på norsk.\n\n");
        sb.append("Kunde: ").append(customer.getCompanyName())
                .append(" (kundenr ").append(customer.getCustomerNo()).append(")\n");
        sb.append("Org.nr: ").append(customer.getOrgNumber()).append("\n");
        sb.append("Hovedkontakt: ").append(customer.getFirstName()).append(" ")
                .append(customer.getLastName())
                .append(" - ").append(customer.getEmail())
                .append(" - ").append(customer.getPhone()).append("\n\n");

        sb.append("Kontakter (").append(contacts.size()).append("):\n");
        if (contacts.isEmpty()) {
            sb.append("- ingen\n");
        } else {
            for (Contact c : contacts) {
                sb.append("- ").append(c.getFirstName()).append(" ").append(c.getLastName());
                if (c.getRole() != null && !c.getRole().isBlank()) {
                    sb.append(", ").append(c.getRole());
                }
                sb.append("\n");
            }
        }
        sb.append("\n");

        long open = tickets.stream().filter(t -> t.getStatus() == Tickets.TicketStatus.OPEN).count();
        long inProgress = tickets.stream().filter(t -> t.getStatus() == Tickets.TicketStatus.IN_PROGRESS).count();
        long waiting = tickets.stream().filter(t -> t.getStatus() == Tickets.TicketStatus.WAITING).count();
        long closed = tickets.stream().filter(t -> t.getStatus() == Tickets.TicketStatus.CLOSED).count();

        sb.append("Tickets (").append(tickets.size()).append(" totalt - ")
                .append(open).append(" åpne, ")
                .append(inProgress).append(" pågår, ")
                .append(waiting).append(" venter, ")
                .append(closed).append(" lukket):\n");
        if (tickets.isEmpty()) {
            sb.append("- ingen\n");
        } else {
            for (Tickets t : tickets.stream().limit(15).toList()) {
                sb.append("- #").append(t.getTicketNo())
                        .append(" \"").append(t.getSubject()).append("\"")
                        .append(" [").append(t.getStatus()).append("]");
                if (t.getUpdatedLast() != null) {
                    sb.append(" sist oppdatert ")
                            .append(DATE_FMT.format(t.getUpdatedLast().atZone(ZoneId.systemDefault())));
                }
                sb.append("\n");
            }
        }
        sb.append("\n");

        sb.append("Avtaler (").append(activities.size()).append("):\n");
        if (activities.isEmpty()) {
            sb.append("- ingen\n");
        } else {
            for (Activity a : activities.stream().limit(15).toList()) {
                sb.append("- ").append(DATE_FMT.format(a.getScheduledAt().atZone(ZoneId.systemDefault())))
                        .append(" ").append(a.getType())
                        .append(" \"").append(a.getTitle()).append("\"")
                        .append(" [").append(a.getStatus()).append("]\n");
            }
        }
        sb.append("\n");

        sb.append("Produkter (").append(products.size()).append("):\n");
        if (products.isEmpty()) {
            sb.append("- ingen\n");
        } else {
            for (CustomerProduct cp : products) {
                sb.append("- ").append(cp.getProduct().getName());
                if (cp.getAddedAt() != null) {
                    sb.append(" (lagt til ").append(
                            DATE_FMT.format(cp.getAddedAt().atZone(ZoneId.systemDefault()))
                    ).append(")");
                }
                sb.append("\n");
            }
        }
        sb.append("\n");

        sb.append("Dato i dag: ").append(LocalDate.now()).append("\n\n");

        sb.append("Lag et kort sammendrag (3-5 setninger) som hjelper en saksbehandler raskt forstå kunderelasjonen. ");
        sb.append("Inkluder aktivitetsnivå, status på saker, og eventuelle oppmerksomhetspunkter (mange åpne tickets, ");
        sb.append("kommende avtaler som krever oppfølging, e.l.). Hvis kunden er ny eller passiv, påpek det. ");
        sb.append("Skriv naturlig og konkret. Ikke list opp data — sammendrag, ikke gjengivelse. ");
        sb.append("Svar med kun selve sammendraget, ingen overskrift eller innledning.");

        return sb.toString();
    }

    @SuppressWarnings("unchecked")
    private String callOllama(String prompt) {
        Map<String, Object> body = Map.of(
                "model", model,
                "prompt", prompt,
                "stream", false
        );

        Map<String, Object> response;
        try {
            response = restClient.post()
                    .uri("/api/generate")
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(body)
                    .retrieve()
                    .body(Map.class);
        } catch (ResourceAccessException e) {
            throw new RuntimeException(
                    "Klarte ikke å nå Ollama på " + baseUrl +
                            ". Sjekk at Ollama kjører ('ollama serve') og at modellen '" + model +
                            "' er lastet ned ('ollama pull " + model + "').",
                    e
            );
        } catch (Exception e) {
            throw new RuntimeException("Feil fra Ollama: " + e.getMessage(), e);
        }

        if (response == null) {
            throw new RuntimeException("Tom respons fra Ollama");
        }

        Object text = response.get("response");
        if (text == null) {
            throw new RuntimeException("Ollama-respons mangler 'response'-felt");
        }

        return ((String) text).trim();
    }
}
