package org.example.startuphub.application;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ApplicationRepository extends JpaRepository<Application, Long> {

    List<Application> findByStartup_Id(Long startupId);

    List<Application> findByUser_Id(Long userId);

    boolean existsByUser_IdAndStartup_Id(Long userId, Long startupId);

    @Query("SELECT a FROM Application a WHERE a.startup.owner.id = :ownerId")
    List<Application> findByStartupOwnerId(@Param("ownerId") Long ownerId);

    void deleteByStartup_Id(Long id);
}