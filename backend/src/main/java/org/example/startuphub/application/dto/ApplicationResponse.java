package org.example.startuphub.application.dto;

import lombok.Data;
import org.example.startuphub.application.ApplicationStatus;
import org.example.startuphub.application.ApplicationType;

import java.time.LocalDateTime;

@Data
public class ApplicationResponse {
    private Long id;
    private Long userId;
    private String userName;
    private Long startupId;
    private String startupTitle;
    private ApplicationType type;
    private ApplicationStatus status;
    private String message;
    private LocalDateTime createdAt;
}