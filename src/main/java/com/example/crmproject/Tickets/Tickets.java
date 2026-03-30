package com.example.crmproject.Tickets;

import com.example.crmproject.Customer.Customer;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.Instant;

@Entity
@Table(name = "Tickets")
public class Tickets {
        @Id
        @GeneratedValue(strategy =
                GenerationType.IDENTITY)
        private Long id;

        @Column(name =
                "ticket_no",
                nullable = false,
                unique = true)
        private Long ticketNo;

        @Column(name =
                "subject",
                nullable = false)
        private String subject;

        @Column(name =
                "description",
                nullable = false)
        private String description;

        @Column(name = "contact_name", nullable = false)
        private String contactName;

        @Column(name =
                "company_Name",
                nullable = false)
        private String companyName;

        @Column(name =
                "email",
                nullable = false)
        private String email;

        @Column(name =
                "phone",
                nullable = false)
        private String phone;

        @ManyToOne(fetch = FetchType.LAZY)
        @JoinColumn(name = "customer_id")
        private Customer customer;


        @CreationTimestamp
        @Column(name =
                "created")
        private Instant created;

        @UpdateTimestamp
        @Column(name =
                "updated_last")
        private Instant updatedLast;

        public enum TicketStatus {
                OPEN, IN_PROGRESS, WAITING, CLOSED
        }

        @Enumerated(EnumType.STRING)
        @Column(name = "status", nullable = false)
        private TicketStatus status = TicketStatus.OPEN;

        protected Tickets(){
        }

        public Tickets(
                Long ticketNo,
                Customer customer,
                String subject,
                String description,
                String contactName,
                String companyName,
                String email,
                String phone,
                Instant updatedLast,
                Instant created,
                TicketStatus status ){
            this.ticketNo = ticketNo;
            this.setCustomer( customer );
            this.description = description;
            this.subject = subject;
            this.contactName = contactName;
            this.companyName = companyName;
            this.email = email;
            this.phone = phone;
            this.updatedLast = updatedLast;
            this.created = created;
            this.setStatus(status);
        }

        public Long getId() { return id; }

        public Long getTicketNo() {return ticketNo;}
        public void setTicketNo(Long ticketNo)
        {this.ticketNo = ticketNo;}

        public String getSubject() { return subject; }
        public void setSubject(String subject)
        {this.subject = subject;}

        public String getDescription() {return description;}
        public void setDescription(String description)
        {this.description = description;}

        public String getCompanyName() {return companyName;}
        public void setCompanyName(String company_Name)
        {this.companyName = company_Name;}

        public String getEmail() {return email;}
        public void setEmail(String email)
        {this.email = email;}

        public String getPhone() {return phone;}
        public void setPhone(String phone)
        {this.phone = phone;}

        public record CreateTicketRequest(
                Long customerId,
                @NotBlank String description,
                @NotBlank String subject,
                @NotBlank String contactName,
                @NotBlank String companyName,
                @NotBlank @Email String email,
                @NotBlank String phone,
                TicketStatus status
        ){}

        public String getContactName() {
                return contactName;
        }

        public void setContactName(String contactName) {
                this.contactName = contactName;
        }

        public Instant getUpdatedLast() {return updatedLast;}
        public void setUpdatedLast(Instant updatedLast)
        {this.updatedLast = updatedLast;}

        public Instant getCreated() {return created;}
        public void setCreated(Instant created)
        {this.created = created;}

        public TicketStatus getStatus() {return status;}
        public void setStatus(TicketStatus status) {
                if (status == null) {
                        this.status = TicketStatus.OPEN;
                        return;
                }
                this.status = status;
        }

        public Customer getCustomer() {
                return customer;
        }

        public void setCustomer(Customer customer) {
                this.customer = customer;
        }
}

