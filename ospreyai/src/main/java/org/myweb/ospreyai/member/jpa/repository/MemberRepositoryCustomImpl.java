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
    //QueryDSL 사용방법 첫번째 :
    //2. MemberRepositoryCustom 인터페이스를 상속받는 후손 클래스를 만든다.
    //  => 후손 클래스이름은 부모인터페이스이름 + Impl 을 붙여줌

    //QueryDSL 에 대한 config 클래스를 먼저 만들고 나서 필드 선언함
    private final JPAQueryFactory queryFactory;     //이것만 선언하면 됨
    //반드시 final 사용할 것

    private final EntityManager entityManager;  //JPQL 사용을 위해 의존성 주입
    private QMemberEntity member = QMemberEntity.memberEntity;
    //member 테이블을 의미하는 MemberEntity 를 member 로 표현한다는 선언임

    //검색 관련 메소드 추가 ---------------------------------------------------
    @Override
    public List<MemberEntity> findSearchUserId(String keyword, Pageable pageable) {
        return queryFactory
                .selectFrom(member)
                .where(
                        member.memberId.like("%" + keyword + "%")
                                .and(member.adminYn.eq("N"))
                )
                .orderBy(member.enrollDate.desc())
                .offset(pageable.getOffset())
                .limit(pageable.getPageSize())
                .fetch();
    }

    @Override
    public long countSearchUserId(String keyword) {
        return queryFactory
                .selectFrom(member)     //select * from notice
                .where(
                        member.memberId.like("%" + keyword + "%")
                                .and(member.adminYn.eq("N"))
                )//where noticetitle %keyword%
                .fetchCount();
    }

    public List<MemberEntity> findSearchGender(String keyword, Pageable pageable) {
        return queryFactory
                .selectFrom(member)
                .where(
                        member.gender.eq(keyword)
                                .and(member.adminYn.eq("N"))
                )
                .orderBy(member.enrollDate.desc())
                .offset(pageable.getOffset())
                .limit(pageable.getPageSize())
                .fetch();
    }

    @Override
    public long countSearchGender(String keyword) {
        return queryFactory
                .selectFrom(member)     //select * from member
                .where(
                        member.gender.eq(keyword)
                                .and(member.adminYn.eq("N"))
                )//where gender = keyword
                .fetchCount();
    }

    @Override
    public List<MemberEntity> findSearchDate(Date begin, Date end, Pageable pageable) {
        return queryFactory
                .selectFrom(member)
                .where(
                        member.enrollDate.between(begin, end)
                                .and(member.adminYn.eq("N"))
                )
                .orderBy(member.enrollDate.desc())
                .offset(pageable.getOffset())
                .limit(pageable.getPageSize())
                .fetch();
    }

    @Override
    public long countSearchDate(Date begin, Date end) {
        return queryFactory
                .selectFrom(member)     //select * from member
                .where(
                        member.enrollDate.between(begin, end)
                                .and(member.adminYn.eq("N"))
                )  //where enroll_date between :begin and :end
                .fetchCount();
    }

    @Override
    public List<MemberEntity> findSearchLoginOK(String keyword, Pageable pageable) {
        return queryFactory
                .selectFrom(member)
                .where(
                        member.loginOk.eq(keyword)
                                .and(member.adminYn.eq("N"))
                )
                .orderBy(member.enrollDate.desc())
                .offset(pageable.getOffset())
                .limit(pageable.getPageSize())
                .fetch();
    }

    @Override
    public long countSearchLoginOK(String keyword) {
        return queryFactory
                .selectFrom(member)     //select * from member
                .where(
                        member.loginOk.eq(keyword)
                                .and(member.adminYn.eq("N"))
                )  //where loginOk = keyword
                .fetchCount();
    }

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


}

