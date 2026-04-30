package com.example.crmproject.Activity;

import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.List;

@RestController
@RequestMapping("/api/v1/activities")
public class ActivityController {

    private final ActivityService service;

    public ActivityController(ActivityService service) {
        this.service = service;
    }

    @GetMapping
    public List<Activity> getAll() {
        return service.getAll();
    }

    @GetMapping("/{id}")
    public Activity getById(@PathVariable Long id) {
        return service.getById(id);
    }

    @GetMapping("/customers/{customerId}")
    public List<Activity> getByCustomerId(@PathVariable Long customerId) {
        return service.getByCustomerId(customerId);
    }

    @GetMapping("/range")
    public List<Activity> getInRange(
            @RequestParam Instant from,
            @RequestParam Instant to
    ) {
        return service.getInRange(from, to);
    }

    @GetMapping("/upcoming")
    public List<Activity> getUpcoming() {
        return service.getUpcoming();
    }

    @GetMapping("/recent")
    public List<Activity> getRecent() {
        return service.getRecent();
    }

    @PostMapping
    public Activity create(@Valid @RequestBody Activity.CreateActivityRequest req) {
        return service.create(req);
    }

    @PutMapping("/{id}")
    public Activity update(@PathVariable Long id, @Valid @RequestBody Activity.UpdateActivityRequest req) {
        return service.update(id, req);
    }

    @PutMapping("/{id}/status")
    public Activity updateStatus(
            @PathVariable Long id,
            @Valid @RequestBody Activity.UpdateStatusRequest req
    ) {
        return service.updateStatus(id, req.status());
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}
