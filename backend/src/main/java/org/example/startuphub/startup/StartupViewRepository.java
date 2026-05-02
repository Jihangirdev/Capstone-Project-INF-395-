package org.example.startuphub.startup;

import org.springframework.data.jpa.repository.JpaRepository;

public interface StartupViewRepository extends JpaRepository<StartupView, Long> {
    boolean existsByStartup_IdAndUser_Id(Long startupId, Long userId);

    void deleteByStartup_Id(Long id);
}