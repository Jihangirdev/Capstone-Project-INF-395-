package org.example.startuphub.auth;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.startuphub.auth.dto.AuthResponse;
import org.example.startuphub.auth.dto.LoginRequest;
import org.example.startuphub.auth.dto.RegisterRequest;
import org.example.startuphub.user.User;
import org.example.startuphub.user.dto.UserResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        return ResponseEntity.ok(authService.register(request));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @GetMapping("/me")
    public ResponseEntity<UserResponse> me(@AuthenticationPrincipal User currentUser) {
        UserResponse response = new UserResponse();
        response.setId(currentUser.getId());
        response.setEmail(currentUser.getEmail());
        response.setName(currentUser.getName());
        response.setRole(currentUser.getRole());
        response.setBio(currentUser.getBio());
        response.setSkills(currentUser.getSkills());
        response.setCreatedAt(currentUser.getCreatedAt());
        return ResponseEntity.ok(response);
    }
}