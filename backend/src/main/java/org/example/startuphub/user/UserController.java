package org.example.startuphub.user;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.startuphub.user.dto.UpdateProfileRequest;
import org.example.startuphub.user.dto.UserResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    // Профиль любого пользователя
    @GetMapping("/{id}")
    public ResponseEntity<UserResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(userService.getById(id));
    }

    // Мой профиль
    @GetMapping("/me")
    public ResponseEntity<UserResponse> getMe(@AuthenticationPrincipal User currentUser) {
        return ResponseEntity.ok(userService.toResponse(currentUser));
    }

    // Редактировать свой профиль
    @PutMapping("/me")
    public ResponseEntity<UserResponse> updateMe(
            @Valid @RequestBody UpdateProfileRequest dto,
            @AuthenticationPrincipal User currentUser
    ) {
        return ResponseEntity.ok(userService.updateProfile(dto, currentUser));
    }
}