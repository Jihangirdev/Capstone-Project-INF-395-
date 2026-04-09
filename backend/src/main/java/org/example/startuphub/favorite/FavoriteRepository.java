package org.example.startuphub.favorite;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface FavoriteRepository extends JpaRepository<Favorite, Long> {
    List<Favorite> findByUser_Id(Long userId);
    Optional<Favorite> findByUser_IdAndStartup_Id(Long userId, Long startupId);
    boolean existsByUser_IdAndStartup_Id(Long userId, Long startupId);
}