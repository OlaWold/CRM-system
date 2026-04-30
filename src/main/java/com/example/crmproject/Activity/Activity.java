package com.example.crmproject.Activity;

import com.example.crmproject.Contact.Contact;
import com.example.crmproject.Customer.Customer;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;

@Entity
@Table(name = "Activity")
public class Activity {

    public enum ActivityType {
        MEETING, CALL, EMAIL, TASK, OTHER
    }

    public enum ActivityStatus {
        PLANNED, DONE, CANCELLED
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "activity_no", nullable = false, unique = true)
    private Long activityNo;

    @Column(name = "title", nullable = false)
    private String title;

    @Column(name = "description", length = 2000)
    private String description;

    @Column(name = "scheduled_at", nullable = false)
    private Instant scheduledAt;

    @Column(name = "duration_minutes", nullable = false)
    private Integer durationMinutes = 30;

    @Enumerated(EnumType.STRING)
    @Column(name = "type", nullable = false)
    private ActivityType type = ActivityType.MEETING;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private ActivityStatus status = ActivityStatus.PLANNED;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "customer_id", nullable = false)
    private Customer customer;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "contact_id")
    private Contact contact;

    @CreationTimestamp
    @Column(name = "created", updatable = false)
    private Instant created;

    protected Activity() {
    }

    public record CreateActivityRequest(
            @NotBlank String title,
            String description,
            @NotNull Instant scheduledAt,
            @Positive Integer durationMinutes,
            ActivityType type,
            @NotNull Long customerId,
            Long contactId
    ) {}

    public record UpdateActivityRequest(
            @NotBlank String title,
            String description,
            @NotNull Instant scheduledAt,
            @Positive Integer durationMinutes,
            ActivityType type,
            Long contactId
    ) {}

    public record UpdateStatusRequest(@NotNull ActivityStatus status) {}

    public Long getId() { return id; }

    public Long getActivityNo() { return activityNo; }
    public void setActivityNo(Long activityNo) { this.activityNo = activityNo; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Instant getScheduledAt() { return scheduledAt; }
    public void setScheduledAt(Instant scheduledAt) { this.scheduledAt = scheduledAt; }

    public Integer getDurationMinutes() { return durationMinutes; }
    public void setDurationMinutes(Integer durationMinutes) {
        this.durationMinutes = durationMinutes != null ? durationMinutes : 30;
    }

    public ActivityType getType() { return type; }
    public void setType(ActivityType type) { this.type = type != null ? type : ActivityType.MEETING; }

    public ActivityStatus getStatus() { return status; }
    public void setStatus(ActivityStatus status) {
        this.status = status != null ? status : ActivityStatus.PLANNED;
    }

    public Customer getCustomer() { return customer; }
    public void setCustomer(Customer customer) { this.customer = customer; }

    public Contact getContact() { return contact; }
    public void setContact(Contact contact) { this.contact = contact; }

    public Instant getCreated() { return created; }
}
