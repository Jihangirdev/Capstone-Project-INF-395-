package org.example.startuphub.auth;

import lombok.RequiredArgsConstructor;
import org.example.startuphub.auth.dto.AuthResponse;
import org.example.startuphub.auth.dto.LoginRequest;
import org.example.startuphub.auth.dto.RegisterRequest;
import org.example.startuphub.security.JwtUtil;
import org.example.startuphub.user.User;
import org.example.startuphub.user.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email уже используется");
        }

        User user = new User();
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setName(request.getName());
        user.setRole(request.getRole());

        userRepository.save(user);

        String token = jwtUtil.generateToken(user.getEmail());
        return new AuthResponse(user.getId(), token, user.getEmail(), user.getRole().name());
    }

    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Пользователь не найден"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Неверный пароль");
        }

        String token = jwtUtil.generateToken(user.getEmail());
        return new AuthResponse(user.getId(), token, user.getEmail(), user.getRole().name());
    }
}