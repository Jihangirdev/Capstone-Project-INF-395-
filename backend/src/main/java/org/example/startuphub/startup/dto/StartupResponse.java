package org.example.startuphub.startup.dto;

import lombok.Data;
import org.example.startuphub.startup.StartupStage;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class StartupResponse {
    private Long id;
    private String title;
    private String description;
    private String category;
    private StartupStage stage;
    private BigDecimal fundingGoal;
    private BigDecimal currentFunding;
    private String ownerName;
    private Long ownerId;
    private LocalDateTime createdAt;
    private Long views;
}