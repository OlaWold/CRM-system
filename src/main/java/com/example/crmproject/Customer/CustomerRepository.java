package com.example.crmproject.Customer;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface CustomerRepository extends JpaRepository<Customer, Long> {

    Optional<Customer> findByCustomerNo(String customerNo);
    List<Customer> findAllByOrderByIdDesc();

    List<Customer> findByCompanyNameContainingIgnoreCase(String companyName);

    List<Customer> findByCompanyNameContainingIgnoreCaseOrCustomerNo(String companyName, Long customerNo);

    boolean existsByCompanyNameIgnoreCase(String companyName);

    @Query("select coalesce(max(c.customerNo), 0) from Customer c")
    long findMaxCustomerNo();

}
