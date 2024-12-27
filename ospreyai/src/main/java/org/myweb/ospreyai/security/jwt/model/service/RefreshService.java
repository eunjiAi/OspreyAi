package org.myweb.ospreyai.security.jwt.model.service;

import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;
import org.myweb.ospreyai.security.jwt.jpa.entity.RefreshToken;
import org.myweb.ospreyai.security.jwt.jpa.repository.RefreshRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@Slf4j
@Transactional
//@RequiredArgsConstructor
public class RefreshService {
    private final RefreshRepository refreshRepository;

    public RefreshService(RefreshRepository refreshRepository) {
        this.refreshRepository = refreshRepository;
    }

    public void save(RefreshToken refreshToken) {
        refreshRepository.save(refreshToken);
    }

    public Optional<RefreshToken> findByTokenValue(String token) {
        Optional<RefreshToken> refreshToken = refreshRepository.findByTokenValue(token);
        if (refreshToken.isEmpty()) {
            log.warn("No refresh token found for token value: {}", token);
        }
        return refreshToken;
    }


    public Boolean exitsByRefreshToken(String refreshValue) {
        return refreshRepository.existsByTokenValue(refreshValue);
    }

    public void deleteByRefreshToken(String refreshValue) {
        refreshRepository.deleteByTokenValue(refreshValue);
    }

    public List<RefreshToken> findByUserId(String userId) {
        return refreshRepository.findByUserId(userId);
    }
}
