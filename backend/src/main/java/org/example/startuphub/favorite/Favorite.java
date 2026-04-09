package org.example.startuphub.favorite;

import jakarta.persistence.*;
import lombok.Data;
import org.example.startuphub.startup.Startup;
import org.example.startuphub.user.User;

import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "favorites",
        uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "startup_id"}))
public class Favorite {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "startup_id", nullable = false)
    private Startup startup;

    @Column(updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
}