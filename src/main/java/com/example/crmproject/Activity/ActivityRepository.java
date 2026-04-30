package com.example.crmproject.Activity;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.List;

@Repository
public interface ActivityRepository extends JpaRepository<Activity, Long> {

    List<Activity> findAllByOrderByScheduledAtAsc();

    List<Activity> findByCustomerIdOrderByScheduledAtDesc(Long customerId);

    List<Activity> findByScheduledAtBetweenOrderByScheduledAtAsc(Instant from, Instant to);

    List<Activity> findByStatusAndScheduledAtAfterOrderByScheduledAtAsc(
            Activity.ActivityStatus status, Instant after
    );

    @Query("select coalesce(max(a.activityNo), 0) from Activity a")
    long findMaxActivityNo();
}
