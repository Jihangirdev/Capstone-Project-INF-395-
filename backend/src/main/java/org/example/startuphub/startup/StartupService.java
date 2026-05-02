package org.example.startuphub.startup;

import lombok.RequiredArgsConstructor;
import org.example.startuphub.application.ApplicationRepository;
import org.example.startuphub.favorite.FavoriteRepository;
import org.example.startuphub.startup.dto.StartupDto;
import org.example.startuphub.startup.dto.StartupResponse;
import org.example.startuphub.startup.dto.UpdateStartupDto;
import org.example.startuphub.user.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class StartupService {

    private final StartupRepository startupRepository;
    private final StartupViewRepository startupViewRepository;
    private final FavoriteRepository favoriteRepository;
    private final ApplicationRepository applicationRepository;

    public StartupResponse create(StartupDto dto, User owner) {
        Startup startup = new Startup();
        startup.setTitle(dto.getTitle());
        startup.setDescription(dto.getDescription());
        startup.setCategory(dto.getCategory());
        startup.setStage(dto.getStage());
        startup.setFundingGoal(dto.getFundingGoal());
        startup.setOwner(owner);
        return toResponse(startupRepository.save(startup));
    }

    public Page<StartupResponse> getAll(String category, StartupStage stage, String search, Pageable pageable) {
        String searchParam = (search == null || search.isBlank()) ? null : search;
        String categoryParam = (category == null || category.isBlank()) ? null : category;
        return startupRepository.search(categoryParam, stage, searchParam, pageable)
                .map(this::toResponse);
    }

    public StartupResponse getById(Long id, User currentUser) {
        Startup startup = findById(id);

                if (!startupViewRepository.existsByStartup_IdAndUser_Id(id, currentUser.getId())) {
            StartupView view = new StartupView();
            view.setStartup(startup);
            view.setUser(currentUser);
            startupViewRepository.save(view);

            startup.setViews(startup.getViews() + 1);
            startupRepository.save(startup);
        }

        return toResponse(startup);
    }

    public StartupResponse update(Long id, UpdateStartupDto dto, User currentUser) {
        Startup startup = findById(id);
        checkOwner(startup, currentUser);

        if (dto.getTitle() != null) startup.setTitle(dto.getTitle());
        if (dto.getDescription() != null) startup.setDescription(dto.getDescription());
        if (dto.getCategory() != null) startup.setCategory(dto.getCategory());
        if (dto.getStage() != null) startup.setStage(dto.getStage());
        if (dto.getFundingGoal() != null) startup.setFundingGoal(dto.getFundingGoal());
        if (dto.getCurrentFunding() != null) startup.setCurrentFunding(dto.getCurrentFunding());

        return toResponse(startupRepository.save(startup));
    }

    @Transactional
    public void delete(Long id, User currentUser) {
        Startup startup = findById(id);
        checkOwner(startup, currentUser);

        startupViewRepository.deleteByStartup_Id(id);
        favoriteRepository.deleteByStartup_Id(id);
        applicationRepository.deleteByStartup_Id(id);
        startupRepository.delete(startup);
    }

    public List<StartupResponse> getByUser(Long userId) {
        return startupRepository.findByOwner_Id(userId)
                .stream().map(this::toResponse).toList();
    }

    private Startup findById(Long id) {
        return startupRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Startup not found"));
    }

    private void checkOwner(Startup startup, User currentUser) {
        if (!startup.getOwner().getId().equals(currentUser.getId())) {
            throw new RuntimeException("No Access");
        }
    }

    public StartupResponse toResponse(Startup s) {
        StartupResponse r = new StartupResponse();
        r.setId(s.getId());
        r.setTitle(s.getTitle());
        r.setDescription(s.getDescription());
        r.setCategory(s.getCategory());
        r.setStage(s.getStage());
        r.setFundingGoal(s.getFundingGoal());
        r.setCurrentFunding(s.getCurrentFunding());
        r.setOwnerName(s.getOwner().getName());
        r.setOwnerId(s.getOwner().getId());
        r.setCreatedAt(s.getCreatedAt());
        r.setViews(s.getViews());
        return r;
    }
}