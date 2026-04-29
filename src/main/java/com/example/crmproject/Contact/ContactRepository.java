package com.example.crmproject.Contact;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ContactRepository extends JpaRepository<Contact, Long> {

    List<Contact> findAllByOrderByIdDesc();

    List<Contact> findByCustomerId(Long customerId);

    List<Contact> findByLastNameContainingIgnoreCaseOrFirstNameContainingIgnoreCase(String lastName, String firstName);

    @Query("select coalesce(max(c.contactNo), 0) from Contact c")
    long findMaxContactNo();
}
