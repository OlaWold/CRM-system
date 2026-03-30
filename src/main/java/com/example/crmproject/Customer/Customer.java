package com.example.crmproject.Customer;

import com.example.crmproject.Tickets.Tickets;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table (name = "Customer")
public class Customer {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "customer_no", nullable = false, unique = true)
    public Long customerNo;

    @Column(name = "company_name", nullable = false)
    private String companyName;

    @Column(name = "first_name", nullable = false)
    private String firstName;

    @Column(name = "last_name", nullable = false)
    private String lastName;

    @Column(name = "email", nullable = false, unique = true)
    private String email;

    @Column(name = "phone", nullable = false, unique = true)
    private String phone;

    @Column(name = "orgNumber", nullable = false, unique = true)
    private String orgNumber;

    @OneToMany(mappedBy = "customer")
    private List<Tickets> tickets = new ArrayList<>();

    protected Customer() {

    }

    public record CreateCustomerRequest(
            @NotBlank String orgNumber,
            @NotBlank String firstName,
            @NotBlank String lastName,
            @NotBlank String companyName,
            @NotBlank @Email String email,
            @NotBlank String phone
    ){}

    public Customer(Long customerNo, String orgNumber, String companyName, String firstName, String lastName, String email, String phone) {
        this.customerNo = customerNo;
        this.orgNumber = orgNumber;
        this.companyName = companyName;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.phone = phone;
    }

    public Long getId() {return id;}
    public Long getCustomerNo() {return customerNo;}
    public void setCustomerNo(Long customerNo) {this.customerNo = customerNo;}

    public String getCompanyName() {return companyName;}
    public void setCompanyName(String companyName) {this.companyName = companyName;}

    public String getFirstName() {return firstName;}
    public void setFirstName(String firstName) {this.firstName = firstName;}

    public String getLastName() {return lastName;}
    public void setLastName(String lastName) {this.lastName = lastName;}

    public String getEmail() {return email;}
    public void setEmail(String email) {this.email = email;}

    public String getPhone() {return phone;}
    public void setPhone(String phone) {this.phone = phone;}

    public String getOrgNumber() {
        return orgNumber;
    }

    public void setOrgNumber(String orgNumber) {
        this.orgNumber = orgNumber;
    }
}

