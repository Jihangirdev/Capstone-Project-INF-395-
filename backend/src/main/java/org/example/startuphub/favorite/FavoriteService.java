package org.example.startuphub.favorite;

import lombok.RequiredArgsConstructor;
import org.example.startuphub.startup.Startup;
import org.example.startuphub.startup.StartupRepository;
import org.example.startuphub.startup.dto.StartupResponse;
import org.example.startuphub.startup.StartupService;
import org.example.startuphub.user.User;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class FavoriteService {

    private final FavoriteRepository favoriteRepository;
    private final StartupRepository startupRepository;
    private final StartupService startupService;

    public String toggle(Long startupId, User currentUser) {
        if (favoriteRepository.existsByUser_IdAndStartup_Id(currentUser.getId(), startupId)) {
            favoriteRepository.findByUser_IdAndStartup_Id(currentUser.getId(), startupId)
                    .ifPresent(favoriteRepository::delete);
            return "Removed from favorites";
        } else {
            Startup startup = startupRepository.findById(startupId)
                    .orElseThrow(() -> new RuntimeException("Startup not found "));
            Favorite favorite = new Favorite();
            favorite.setUser(currentUser);
            favorite.setStartup(startup);
            favoriteRepository.save(favorite);
            return "Added to favorite";
        }
    }

    public List<StartupResponse> getMyFavorites(User currentUser) {
        return favoriteRepository.findByUser_Id(currentUser.getId())
                .stream()
                .map(f -> startupService.toResponse(f.getStartup()))
                .toList();
    }
}