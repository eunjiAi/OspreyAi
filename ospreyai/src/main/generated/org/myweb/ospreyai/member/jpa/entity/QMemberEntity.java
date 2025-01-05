package org.myweb.ospreyai.member.jpa.entity;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;


/**
 * QMemberEntity is a Querydsl query type for MemberEntity
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QMemberEntity extends EntityPathBase<MemberEntity> {

    private static final long serialVersionUID = -680498723L;

    public static final QMemberEntity memberEntity = new QMemberEntity("memberEntity");

    public final StringPath adminYn = createString("adminYn");

    public final DatePath<java.sql.Date> enrollDate = createDate("enrollDate", java.sql.Date.class);

    public final StringPath faceId = createString("faceId");

    public final StringPath faceVector = createString("faceVector");

    public final StringPath gender = createString("gender");

    public final StringPath google = createString("google");

    public final StringPath kakao = createString("kakao");

    public final DatePath<java.sql.Date> lastModified = createDate("lastModified", java.sql.Date.class);

    public final StringPath loginOk = createString("loginOk");

    public final StringPath memberId = createString("memberId");

    public final StringPath name = createString("name");

    public final StringPath naver = createString("naver");

    public final StringPath nickname = createString("nickname");

    public final StringPath phoneNumber = createString("phoneNumber");

    public final StringPath pw = createString("pw");

    public final StringPath uuid = createString("uuid");

    public QMemberEntity(String variable) {
        super(MemberEntity.class, forVariable(variable));
    }

    public QMemberEntity(Path<? extends MemberEntity> path) {
        super(path.getType(), path.getMetadata());
    }

    public QMemberEntity(PathMetadata metadata) {
        super(MemberEntity.class, metadata);
    }

}

