package org.example.startuphub.startup.dto;

import lombok.Data;
import org.example.startuphub.startup.StartupStage;
import java.math.BigDecimal;

@Data
public class UpdateStartupDto {
    private String title;
    private String description;
    private String category;
    private StartupStage stage;
    private BigDecimal fundingGoal;
    private BigDecimal currentFunding; // ← новое поле
}