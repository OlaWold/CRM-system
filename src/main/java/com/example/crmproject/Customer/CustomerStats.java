package com.example.crmproject.Customer;

public record CustomerStats(
        long totalCount,
        long last30Days,
        long last60Days,
        Double growthThirtyDays,
        Double growthQuarter,
        Double growthHalfYear,
        Double growthYear
) {}
