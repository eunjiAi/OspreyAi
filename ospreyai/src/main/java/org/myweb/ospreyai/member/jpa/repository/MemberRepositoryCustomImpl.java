package org.myweb.ospreyai.member.jpa.repository;

import com.querydsl.jpa.impl.JPAQueryFactory;
import jakarta.persistence.EntityManager;
import lombok.RequiredArgsConstructor;
import org.myweb.ospreyai.member.jpa.entity.MemberEntity;
import org.myweb.ospreyai.member.jpa.entity.QMemberEntity;
import org.myweb.ospreyai.member.model.dto.Member;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Date;
import java.util.List;
import java.util.Optional;

@Repository
@RequiredArgsConstructor
public class MemberRepositoryCustomImpl implements MemberRepositoryCustom {

    private final JPAQueryFactory queryFactory;
    private final EntityManager entityManager;
    private QMemberEntity member = QMemberEntity.memberEntity;

    @Override
    public Optional<MemberEntity> findByMemberId(String memberId) {
        MemberEntity result = queryFactory
                .selectFrom(member)
                .where(member.memberId.eq(memberId))
                .fetchOne();

        return Optional.ofNullable(result);
    }

    @Override
    public Optional<MemberEntity> findByGoogle(String email) {
        MemberEntity result = queryFactory
                .selectFrom(member)
                .where(member.google.eq(email))
                .fetchOne();

        return Optional.ofNullable(result);
    }

    @Override
    public Optional<MemberEntity> findByNaver(String email) {
        MemberEntity result = queryFactory
                .selectFrom(member)
                .where(member.naver.eq(email))
                .fetchOne();

        return Optional.ofNullable(result);
    }

    @Override
    public Optional<MemberEntity> findByKakao(String email) {
        MemberEntity result = queryFactory
                .selectFrom(member)
                .where(member.kakao.eq(email))
                .fetchOne();

        return Optional.ofNullable(result);
    }

    @Override
    public Optional<MemberEntity> findByNameAndEmail(String name, String email) {
        MemberEntity result = queryFactory
                .selectFrom(member)
                .where(
                        member.name.eq(name),
                        member.email.eq(email)
                )
                .fetchOne();

        return Optional.ofNullable(result);
    }

    @Override
    public Optional<MemberEntity> existsByUserIdAndEmail(String userId, String email) {
        MemberEntity result = queryFactory
                .selectFrom(member)
                .where(
                        member.memberId.eq(userId),
                        member.email.eq(email)
                )
                .fetchOne();
        return Optional.ofNullable(result);
    }

    @Override
    @Transactional
    public void updatePassword(String userId, String encryptedPassword) {
        queryFactory
                .update(member)
                .set(member.pw, encryptedPassword)
                .where(member.memberId.eq(userId))
                .execute();
    }

    @Override
    public void deleteByGoogle(String uuid) {
        queryFactory
                .update(member)
                .set(member.google, (String) null)
                .where(member.uuid.eq(uuid))
                .execute();
    }

    @Override
    public void deleteByKakao(String uuid) {
        queryFactory
                .update(member)
                .set(member.kakao, (String) null)
                .where(member.uuid.eq(uuid))
                .execute();
    }


}

