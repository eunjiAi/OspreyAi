package org.myweb.ospreyai.security.jwt.jpa.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@NoArgsConstructor
@AllArgsConstructor
@Builder
@Data
@Entity
@Table(name="REFRESH_TOKENS")
public class RefreshToken {
    @Id
    @Column(length=36)
    private UUID id;

    /*@ManyToOne(fetch = FetchType.LAZY)
    @Column(name="userid", referencedColumnName="userid", nullable=false)
    private String userid;*/

    @Column(name="userid", nullable=false)
    private String userId;

    @Column(name="token_value", nullable=false, length=255)
    private String tokenValue;

    @Column(name = "issued_at", nullable = false)
    private LocalDateTime issuedAt;

    @Column(name = "expires_in", nullable = false)
    private Long expiresIn;

    @Column(name = "expiration_date", nullable = false)
    private LocalDateTime expirationDate;

    @Column(name = "member_agent")
    private String memberAgent;

    @Column(name = "STATUS", length = 50)
    private String status;

    @PrePersist
    public void prePersist() {
        LocalDateTime now = LocalDateTime.now();
        if (issuedAt == null) issuedAt = now;
        if (expiresIn == null || expiresIn <= 0) expiresIn = 86400000L;
        if (expirationDate == null) expirationDate = now.plusSeconds(expiresIn / 1000);
    }

}
