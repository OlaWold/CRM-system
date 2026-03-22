package com.example.crmproject.Tickets;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface TicketsRepository extends JpaRepository<Tickets, Long> {

    Optional<Tickets> findById(Long id);

    Optional<Tickets> findByTicketNo(Long ticketNo);

    @Query("select coalesce(max(t.ticketNo), 0) from Tickets t")
    long findMaxTicketNo();
}
