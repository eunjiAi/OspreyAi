package org.myweb.ospreyai.member.jpa.repository;

import org.myweb.ospreyai.member.jpa.entity.MemberEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MemberRepository extends JpaRepository<MemberEntity, String>, MemberRepositoryCustom {
    // jpa 가 제공하는 기본 메소드들을 사용할 수 있게 됨

    //QueryDSL 사용방법 첫번째 :
    //3. jpaRepository 를 상속받은 인터페이스에 queryDSL 용 커스텀 인터페이스를 상속에 추가함
}
