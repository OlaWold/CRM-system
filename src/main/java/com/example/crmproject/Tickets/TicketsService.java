package com.example.crmproject.Tickets;

import com.example.crmproject.Customer.Customer;
import com.example.crmproject.Customer.CustomerRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import java.util.List;

@Service
public class TicketsService {
    private final TicketsRepository repo;
    private final CustomerRepository customerRepo;

    public TicketsService(TicketsRepository repo, CustomerRepository customerRepo) {
        this.repo = repo;
        this.customerRepo = customerRepo;
    }
}