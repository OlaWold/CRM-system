package com.example.crmproject.Email;

import jakarta.validation.constraints.NotBlank;

public record IncomingEmailRequest(
        @NotBlank String fromEmail,
        String fromName,
        @NotBlank String subject,
        String body
) {}
