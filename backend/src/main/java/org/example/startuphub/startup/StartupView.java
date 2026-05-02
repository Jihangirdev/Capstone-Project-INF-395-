package org.example.startuphub.startup;

import jakarta.persistence.*;
import lombok.Data;
import org.example.startuphub.user.User;

@Data
@Entity
@Table(name = "startup_views",
        uniqueConstraints = @UniqueConstraint(columnNames = {"startup_id", "user_id"}))
public class StartupView {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "startup_id")
    private Startup startup;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;
}