package org.example.startuphub.application.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;
import org.example.startuphub.application.ApplicationStatus;

@Data
public class ApplicationStatusRequest {

    @NotNull
    private ApplicationStatus status;
}