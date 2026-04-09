package org.example.startuphub.user.dto;

import lombok.Data;
import org.example.startuphub.user.UserRole;

import java.time.LocalDateTime;

@Data
public class UserResponse {
    private Long id;
    private String email;
    private String name;
    private UserRole role;
    private String bio;
    private String skills;
    private LocalDateTime createdAt;
}