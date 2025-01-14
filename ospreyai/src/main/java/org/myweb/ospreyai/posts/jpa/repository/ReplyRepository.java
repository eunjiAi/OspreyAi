package org.myweb.ospreyai.posts.jpa.repository;

import org.myweb.ospreyai.posts.jpa.entity.ReplyEntity;
import org.myweb.ospreyai.posts.jpa.repository.ReplyRepositoryCustom;
import org.myweb.ospreyai.qna.jpa.entity.AnswerEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReplyRepository extends JpaRepository<ReplyEntity, Integer>, ReplyRepositoryCustom {
    //해당 인터페이스가 비어 있으면, JpaRepository 가 제공하는 기본 메소드들을 사용한다는 의미임

    //QueryDSL 사용방법 첫번째 :
    //3. querydsl 용 커스텀 인터페이스를 상속에 추가한다.
}
