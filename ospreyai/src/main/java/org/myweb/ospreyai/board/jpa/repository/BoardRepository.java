package org.myweb.ospreyai.board.jpa.repository;

import org.myweb.ospreyai.board.jpa.entity.BoardEntity;
import org.myweb.ospreyai.board.jpa.entity.BoardNativeVo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BoardRepository extends JpaRepository<BoardEntity, Integer> {
    // 해당 인터페이스가 비어 있으면, JpaRepository 가 제공하는 기본 메소드들을 사용한다는 의미임

    // jpa 기본 메소드로 해결이 안되는 쿼리문 작동일 때는 필요한 메소드를 이 인터페이스 안에 추가할 수 있음
    // JPQL 을 이용함 또는 Native Query 이용하면 됨
    // JPQL 은 WHERE, GROUP BY 절에서만 서브쿼리 사용 가능함
    // FROM 절에서는 서브쿼리 사용 못 함

    // @Query + Native Query 사용 형태 (쿼리문에 테이블과 컬럼명 사용)
    @Query(value = "select board_num, board_title, board_readcount from board order by board_readcount desc", nativeQuery = true)
    List<BoardNativeVo> findTop3();
    // nativeQuery 사용시 select 절의 컬럼명과 같은 get 메소드로만 구성된 nativeVo 인터페이스가 필요함
    // board_num, board_title, board_readcount 컬럼에 대한 get 메소드 작성
    // => board.jpa.entity.BoardNativeVo 인터페이스로 작성함

}
