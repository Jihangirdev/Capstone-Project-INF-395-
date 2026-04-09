package org.example.startuphub.startup;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.startuphub.startup.dto.StartupDto;
import org.example.startuphub.startup.dto.StartupResponse;
import org.example.startuphub.user.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/startups")
@RequiredArgsConstructor
public class StartupController {

    private final StartupService startupService;

    @GetMapping
    public ResponseEntity<Page<StartupResponse>> getAll(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) StartupStage stage,
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        return ResponseEntity.ok(startupService.getAll(category, stage, search, pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<StartupResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(startupService.getById(id));
    }

    @PostMapping
    @PreAuthorize("hasRole('FOUNDER')")
    public ResponseEntity<StartupResponse> create(
            @Valid @RequestBody StartupDto dto,
            @AuthenticationPrincipal User currentUser
    ) {
        return ResponseEntity.ok(startupService.create(dto, currentUser));
    }

    @PutMapping("/{id}")
    public ResponseEntity<StartupResponse> update(
            @PathVariable Long id,
            @Valid @RequestBody StartupDto dto,
            @AuthenticationPrincipal User currentUser
    ) {
        return ResponseEntity.ok(startupService.update(id, dto, currentUser));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(
            @PathVariable Long id,
            @AuthenticationPrincipal User currentUser
    ) {
        startupService.delete(id, currentUser);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}/startups")
    public ResponseEntity<List<StartupResponse>> getUserStartups(@PathVariable Long id) {
        return ResponseEntity.ok(startupService.getByUser(id));
    }
}