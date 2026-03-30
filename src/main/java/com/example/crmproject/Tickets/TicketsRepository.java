package com.example.crmproject.Tickets;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

public interface TicketsRepository extends JpaRepository<Tickets, Long> {
    Optional<Tickets> findById(Long id);
    List<Tickets> findByCustomerId(Long customerId);
    List<Tickets> findAllByOrderByTicketNoAsc();
    long countFindByCreatedBetween(Instant to, Instant from);

    long countByStatus(Tickets.TicketStatus status);
    long countByStatusNot(Tickets.TicketStatus status);

    @Query("select coalesce(max(t.ticketNo), 0) from Tickets t")
    long findMaxTicketNo();

    long countByStatusAndUpdatedLastAfter(Tickets.TicketStatus ticketStatus, Instant thirtyDaysAgo);



}
