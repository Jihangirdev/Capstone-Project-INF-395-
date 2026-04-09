package org.example.startuphub.startup.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import org.example.startuphub.startup.StartupStage;

import java.math.BigDecimal;

@Data
public class StartupDto {

    @NotBlank
    private String title;

    private String description;
    private String category;
    private StartupStage stage;
    private BigDecimal fundingGoal;
}