package org.example.startuphub.application.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;
import org.example.startuphub.application.ApplicationType;

@Data
public class ApplicationRequest {

    @NotNull
    private ApplicationType type;

    private String message;
}