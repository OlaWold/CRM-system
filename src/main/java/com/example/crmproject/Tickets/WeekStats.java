package com.example.crmproject.Tickets;

import java.time.LocalDate;

public record WeekStats(
        LocalDate weekStart,
        long newTickets,
        long closedTickets
) {}
