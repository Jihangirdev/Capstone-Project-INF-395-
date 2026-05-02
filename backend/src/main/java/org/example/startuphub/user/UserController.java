package org.example.startuphub.user;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.startuphub.startup.StartupService;
import org.example.startuphub.startup.dto.StartupResponse;
import org.example.startuphub.user.dto.UpdateProfileRequest;
import org.example.startuphub.user.dto.UserResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final StartupService startupService;

    @GetMapping("/{id}")
    public ResponseEntity<UserResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(userService.getById(id));
    }

    @GetMapping("/me")
    public ResponseEntity<UserResponse> getMe(@AuthenticationPrincipal User currentUser) {
        return ResponseEntity.ok(userService.toResponse(currentUser));
    }

    @PutMapping("/me")
    public ResponseEntity<UserResponse> updateMe(
            @Valid @RequestBody UpdateProfileRequest dto,
            @AuthenticationPrincipal User currentUser
    ) {
        return ResponseEntity.ok(userService.updateProfile(dto, currentUser));
    }

    @GetMapping("/{id}/startups")
    public ResponseEntity<List<StartupResponse>> getUserStartups(@PathVariable Long id) {
        return ResponseEntity.ok(startupService.getByUser(id));
    }
}