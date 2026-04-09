package org.example.startuphub.application;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.startuphub.application.dto.ApplicationRequest;
import org.example.startuphub.application.dto.ApplicationResponse;
import org.example.startuphub.application.dto.ApplicationStatusRequest;
import org.example.startuphub.user.User;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class ApplicationController {

    private final ApplicationService applicationService;

    // Подать заявку на стартап
    @PostMapping("/startups/{startupId}/apply")
    public ResponseEntity<ApplicationResponse> apply(
            @PathVariable Long startupId,
            @Valid @RequestBody ApplicationRequest dto,
            @AuthenticationPrincipal User currentUser
    ) {
        return ResponseEntity.ok(applicationService.apply(startupId, dto, currentUser));
    }

    // Список заявок на мой стартап (только owner)
    @GetMapping("/startups/{startupId}/applications")
    public ResponseEntity<List<ApplicationResponse>> getByStartup(
            @PathVariable Long startupId,
            @AuthenticationPrincipal User currentUser
    ) {
        return ResponseEntity.ok(applicationService.getByStartup(startupId, currentUser));
    }

    // Мои заявки
    @GetMapping("/applications/my")
    public ResponseEntity<List<ApplicationResponse>> getMyApplications(
            @AuthenticationPrincipal User currentUser
    ) {
        return ResponseEntity.ok(applicationService.getMyApplications(currentUser));
    }

    // Принять / отклонить заявку
    @PutMapping("/applications/{applicationId}")
    public ResponseEntity<ApplicationResponse> updateStatus(
            @PathVariable Long applicationId,
            @Valid @RequestBody ApplicationStatusRequest dto,
            @AuthenticationPrincipal User currentUser
    ) {
        return ResponseEntity.ok(applicationService.updateStatus(applicationId, dto, currentUser));
    }
}