package org.example.startuphub.startup;

import lombok.RequiredArgsConstructor;
import org.example.startuphub.startup.dto.StartupDto;
import org.example.startuphub.startup.dto.StartupResponse;
import org.example.startuphub.user.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class StartupService {

    private final StartupRepository startupRepository;

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
        return startupRepository.search(category, stage, search, pageable)
                .map(this::toResponse);
    }

    public StartupResponse getById(Long id) {
        Startup startup = findById(id);
        startup.setViews(startup.getViews() + 1);
        startupRepository.save(startup);
        return toResponse(startup);
    }

    public StartupResponse update(Long id, StartupDto dto, User currentUser) {
        Startup startup = findById(id);
        checkOwner(startup, currentUser);

        startup.setTitle(dto.getTitle());
        startup.setDescription(dto.getDescription());
        startup.setCategory(dto.getCategory());
        startup.setStage(dto.getStage());
        startup.setFundingGoal(dto.getFundingGoal());

        return toResponse(startupRepository.save(startup));
    }

    public void delete(Long id, User currentUser) {
        Startup startup = findById(id);
        checkOwner(startup, currentUser);
        startupRepository.delete(startup);
    }

    public List<StartupResponse> getByUser(Long userId) {
        return startupRepository.findByOwner_Id(userId)
                .stream().map(this::toResponse).toList();
    }

    private Startup findById(Long id) {
        return startupRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Стартап не найден"));
    }

    private void checkOwner(Startup startup, User currentUser) {
        if (!startup.getOwner().getId().equals(currentUser.getId())) {
            throw new RuntimeException("Нет доступа");
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