package org.myweb.ospreyai.security.jwt.jpa.entity;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;


/**
 * QRefreshToken is a Querydsl query type for RefreshToken
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QRefreshToken extends EntityPathBase<RefreshToken> {

    private static final long serialVersionUID = -44498147L;

    public static final QRefreshToken refreshToken = new QRefreshToken("refreshToken");

    public final DateTimePath<java.time.LocalDateTime> expirationDate = createDateTime("expirationDate", java.time.LocalDateTime.class);

    public final NumberPath<Long> expiresIn = createNumber("expiresIn", Long.class);

    public final ComparablePath<java.util.UUID> id = createComparable("id", java.util.UUID.class);

    public final DateTimePath<java.time.LocalDateTime> issuedAt = createDateTime("issuedAt", java.time.LocalDateTime.class);

    public final StringPath memberAgent = createString("memberAgent");

    public final StringPath status = createString("status");

    public final StringPath tokenValue = createString("tokenValue");

    public final StringPath userId = createString("userId");

    public QRefreshToken(String variable) {
        super(RefreshToken.class, forVariable(variable));
    }

    public QRefreshToken(Path<? extends RefreshToken> path) {
        super(path.getType(), path.getMetadata());
    }

    public QRefreshToken(PathMetadata metadata) {
        super(RefreshToken.class, metadata);
    }

}

