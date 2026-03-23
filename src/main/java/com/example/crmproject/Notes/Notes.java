package com.example.crmproject.Notes;

import com.example.crmproject.Tickets.Tickets;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;

import java.time.Instant;

@Entity
@Table(name = "Notes")
public class Notes {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @Column(name = "text", columnDefinition = "TEXT", nullable = false)
    private String text;

    @Column(name = "createdAt", nullable = false)
    private Instant createdAt;

    @Column(name = "created_by")
    private String createdBy;

    @ManyToOne
    @JoinColumn(name = "ticket_id")
    private Tickets ticket;

    protected Notes() {};

    public Notes(
        String text,
        Instant createdAt,
        String createdBy,
        Tickets ticket) {
        this.text = text;
        this.createdAt = createdAt;
        this.createdBy = createdBy;
        this.ticket = ticket;
        }

    public record CreateNotesRequest(
            @NotBlank String text,
            String createdBy
    ){};

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }

    public String getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(String createdBy) {
        this.createdBy = createdBy;
    }

    public Tickets getTicket() {
        return ticket;
    }

    public void setTicket(Tickets ticket) {
        this.ticket = ticket;
    }
}
