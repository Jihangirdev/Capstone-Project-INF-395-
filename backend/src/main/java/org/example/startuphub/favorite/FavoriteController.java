package org.example.startuphub.favorite;

import lombok.RequiredArgsConstructor;
import org.example.startuphub.startup.dto.StartupResponse;
import org.example.startuphub.user.User;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/favorites")
@RequiredArgsConstructor
public class FavoriteController {

    private final FavoriteService favoriteService;

    @PostMapping("/{startupId}")
    public ResponseEntity<String> toggle(
            @PathVariable Long startupId,
            @AuthenticationPrincipal User currentUser
    ) {
        return ResponseEntity.ok(favoriteService.toggle(startupId, currentUser));
    }

    @GetMapping
    public ResponseEntity<List<StartupResponse>> getMyFavorites(
            @AuthenticationPrincipal User currentUser
    ) {
        return ResponseEntity.ok(favoriteService.getMyFavorites(currentUser));
    }
}