package org.example.startuphub.application;

import lombok.RequiredArgsConstructor;
import org.example.startuphub.application.dto.ApplicationRequest;
import org.example.startuphub.application.dto.ApplicationResponse;
import org.example.startuphub.application.dto.ApplicationStatusRequest;
import org.example.startuphub.startup.Startup;
import org.example.startuphub.startup.StartupRepository;
import org.example.startuphub.user.User;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ApplicationService {

    private final ApplicationRepository applicationRepository;
    private final StartupRepository startupRepository;

    public ApplicationResponse apply(Long startupId, ApplicationRequest dto, User currentUser) {
        Startup startup = startupRepository.findById(startupId)
                .orElseThrow(() -> new RuntimeException("Стартап не найден"));

        if (startup.getOwner().getId().equals(currentUser.getId())) {
            throw new RuntimeException("Нельзя подать заявку на свой стартап");
        }

        if (applicationRepository.existsByUser_IdAndStartup_Id(currentUser.getId(), startupId)) {
            throw new RuntimeException("Вы уже подали заявку на этот стартап");
        }

        Application application = new Application();
        application.setUser(currentUser);
        application.setStartup(startup);
        application.setType(dto.getType());
        application.setMessage(dto.getMessage());

        return toResponse(applicationRepository.save(application));
    }

    public List<ApplicationResponse> getByStartup(Long startupId, User currentUser) {
        Startup startup = startupRepository.findById(startupId)
                .orElseThrow(() -> new RuntimeException("Стартап не найден"));

        if (!startup.getOwner().getId().equals(currentUser.getId())) {
            throw new RuntimeException("Нет доступа");
        }

        return applicationRepository.findByStartup_Id(startupId)
                .stream().map(this::toResponse).toList();
    }

    public List<ApplicationResponse> getMyApplications(User currentUser) {
        return applicationRepository.findByUser_Id(currentUser.getId())
                .stream().map(this::toResponse).toList();
    }

    public ApplicationResponse updateStatus(Long applicationId, ApplicationStatusRequest dto, User currentUser) {
        Application application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new RuntimeException("Заявка не найдена"));

        if (!application.getStartup().getOwner().getId().equals(currentUser.getId())) {
            throw new RuntimeException("Нет доступа");
        }

        application.setStatus(dto.getStatus());
        return toResponse(applicationRepository.save(application));
    }

    private ApplicationResponse toResponse(Application a) {
        ApplicationResponse r = new ApplicationResponse();
        r.setId(a.getId());
        r.setUserId(a.getUser().getId());
        r.setUserName(a.getUser().getName());
        r.setStartupId(a.getStartup().getId());
        r.setStartupTitle(a.getStartup().getTitle());
        r.setType(a.getType());
        r.setStatus(a.getStatus());
        r.setMessage(a.getMessage());
        r.setCreatedAt(a.getCreatedAt());
        return r;
    }
}