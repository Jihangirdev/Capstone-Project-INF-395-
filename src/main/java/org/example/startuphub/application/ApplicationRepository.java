package org.example.startuphub.application;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ApplicationRepository extends JpaRepository<Application, Long> {

    List<Application> findByStartup_Id(Long startupId);

    List<Application> findByUser_Id(Long userId);

    boolean existsByUser_IdAndStartup_Id(Long userId, Long startupId);
}