package org.example.startuphub.user;

import lombok.RequiredArgsConstructor;
import org.example.startuphub.user.dto.UpdateProfileRequest;
import org.example.startuphub.user.dto.UserResponse;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    public UserResponse getById(Long id) {
        return toResponse(userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Пользователь не найден")));
    }

    public UserResponse updateProfile(UpdateProfileRequest dto, User currentUser) {
        currentUser.setName(dto.getName());
        currentUser.setBio(dto.getBio());
        currentUser.setSkills(dto.getSkills());
        return toResponse(userRepository.save(currentUser));
    }

    public UserResponse toResponse(User u) {
        UserResponse r = new UserResponse();
        r.setId(u.getId());
        r.setEmail(u.getEmail());
        r.setName(u.getName());
        r.setRole(u.getRole());
        r.setBio(u.getBio());
        r.setSkills(u.getSkills());
        r.setCreatedAt(u.getCreatedAt());
        return r;
    }
}