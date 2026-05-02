package org.example.startuphub.startup;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface StartupRepository extends JpaRepository<Startup, Long> {

    List<Startup> findByOwner_Id(Long ownerId);

    @Query("""
    SELECT s FROM Startup s
    WHERE (:category IS NULL OR s.category = :category)
      AND (:stage IS NULL OR s.stage = :stage)
      AND (:search IS NULL OR :search = '' OR LOWER(s.title) LIKE LOWER(CONCAT('%', :search, '%')))
    ORDER BY s.createdAt DESC
""")
    Page<Startup> search(
            @Param("category") String category,
            @Param("stage") StartupStage stage,
            @Param("search") String search,
            Pageable pageable
    );
}