package org.myweb.ospreyai.board.model.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.myweb.ospreyai.board.jpa.entity.BoardEntity;
import org.myweb.ospreyai.board.jpa.entity.BoardNativeVo;
import org.myweb.ospreyai.board.jpa.repository.BoardRepository;
import org.myweb.ospreyai.board.model.dto.Board;
import org.myweb.ospreyai.common.Paging;
import org.myweb.ospreyai.common.Search;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j // Logger 객체 선언임, 별도의 로그객체 선언 필요없음, 제공되는 레퍼런스는 log 임
@Service
@RequiredArgsConstructor
@Transactional
public class BoardService {
	// 스프링 mvc 구조를 스프링부트에서 그대로 사용해도 됨
	// Service 에 대한 interface 를 만들고, 해당 서비스를 상속받은 ServiceImpl 클래스를 만드는 구조로 작성해도 됨

	private final BoardRepository boardRepository;

	public ArrayList<Board> selectTop3() {
		// jpa 가 제공하는 findAll() 로 모두 조회해 와서, 3개만 추출하는 방법이 있을 것임 (NoticeService 참조)
		// 필요할 경우 jpa 가 제공하는 메소드로는 해결이 안되는 기능을 메소드를 추가해서 사용할 수 있음
		// 추가 작성한 메소드 사용
		List<BoardNativeVo> nativeList = boardRepository.findTop3();
		// 내림차순정렬이므로 상위 3개만 추출함
		ArrayList<Board> list = new ArrayList<>();
		for (int i = 0; i < 3; i++) {
			Board board = new Board();
			board.setBoardNum(nativeList.get(i).getBoard_num());
			board.setBoardTitle(nativeList.get(i).getBoard_title());
			board.setBoardReadCount(nativeList.get(i).getBoard_readcount());
			log.info("BoardService board : " + board.getBoardNum());
			list.add(board);
		}

		return list;
	}

	public int selectListCount() {
		// jpa 가 제공 : count() 사용
		return (int) boardRepository.count();
	}

	public ArrayList<Board> selectList(Pageable pageable) {
		// jpa 가 제공 : findAll(Pageable) : Page<Entity>
		Page<BoardEntity> page = boardRepository.findAll(pageable);
		ArrayList<Board> list = new ArrayList<>();
		for (BoardEntity entity : page) {
			list.add(entity.toDto());
		}
		return list;
	}

	public Board selectBoard(int boardNum) {
		// jpa 가 제공하는 메소드 사용 : findById(id로 지정한 프로퍼티변수의 값) : Optional<Entity> 리턴
		Optional<BoardEntity> optionalBoard = boardRepository.findById(boardNum);
		return optionalBoard.get().toDto();
	}

	@Transactional
	public int updateAddReadCount(int boardNum) {
		// jpa가 제공하는 메소드 사용 : save(Entity) : 성공 Entity, 실패(에러) null
		// update 쿼리문 : 전달되는 엔티티의 id 프로퍼티의 값이 존재하면 update 가 작동됨
		// jpa 의 save() 는 수정할 정보를 가진 엔티티를 넘겨줘야 함
		Optional<BoardEntity> optionalBoard = boardRepository.findById(boardNum);
		BoardEntity entity = optionalBoard.get();
		log.info("BoardService boardEntity : " + entity); // db 테이블로 부터 조회해 온 게시글 정보 확인
		entity.setBoardReadCount(entity.getBoardReadCount() + 1); // 조회수 1 증가 처리
		try {
			boardRepository.save(entity); // 조회수 1 증가된 정보를 가진 엔티티가 전달됨
			return 1;
		} catch (Exception e) {
			log.error(e.getMessage());
			return 0;
		}

	}

	@Transactional
	public int insertBoard(Board board) {
		// 추가한 메소드 사용 : 현재 마지막 게시글 번호 조회용
		board.setBoardNum(boardRepository.findLastBoardNum() + 1);
		log.info("BoardService board + 1 들어가는 값: " + board + 1);
		// jpa가 제공하는 메소드 사용 : save(Entity) => 성공하면 entity, 실패하면 null 임
		// => pk 에 해당되는 글번호가 테이블에 없으면 insert 문 실행함
		// => pk에 해당되는 글번호가 테이블에 있으면 update 문을 실행함
		try {
			boardRepository.save(board.toEntity());
			return 1;
		} catch (Exception e) {
			log.error(e.getMessage());
			return 0;
		}
	}

	public int updateReplySeq(Board reply) {
		return 0;
	}

	public int insertReply(Board reply) {
		return 0;
	}

	@Transactional
	public int deleteBoard(Board board) {
		try {
			boardRepository.deleteById(board.getBoardNum());
			return 1;
		} catch (Exception e) {
			log.error(e.getMessage());
			return 0;
		}
	}

	@Transactional
	public int updateOrigin(Board board) {
		// jpa 가 제공하는 메소드 사용 : save(Entity) : Entity
		try {
			boardRepository.save(board.toEntity());
			return 1;
		} catch (Exception e) {
			log.error(e.getMessage());
			return 0;
		}
	}

	public int selectSearchTitleCount(String keyword) {
		// jpa 가 제공하는 전체 목록 갯수 조회 하는 count() 로는 해결이 안됨
		// 추가 작성해서 사용 : 리포지토리 인터페이스에 추가 작성함
		return boardRepository.countSearchTitle(keyword).intValue();
	}

	public int selectSearchWriterCount(String keyword) {
		// jpa 가 제공하는 전체 목록 갯수 조회 하는 count() 로는 해결이 안됨
		// 추가 작성해서 사용 : 리포지토리 인터페이스에 추가 작성함
		return boardRepository.countSearchWriter(keyword).intValue();
	}

	public int selectSearchDateCount(Search search) {
		// jpa 가 제공하는 전체 목록 갯수 조회 하는 count() 로는 해결이 안됨
		// 추가 작성해서 사용 : 리포지토리 인터페이스에 추가 작성함
		return boardRepository.countSearchDate(search.getBegin(), search.getEnd()).intValue();
	}

	public ArrayList<Board> selectSearchTitle(String keyword, Pageable pageable) {
		// jpa 가 제공하는 findAll(pageable) 메소드가 있으나, 키워드도 함께 전달되는 메소드는 없음
		// 추가해서 사용함 : BoardRepository 인터페이스에 메소드 추가함
		Page<BoardEntity> page = boardRepository.findSearchTitle(keyword, pageable);
		ArrayList<Board> list = new ArrayList<>();
		for (BoardEntity entity : page) {
			list.add(entity.toDto());
		}
		return list;
	}

	public ArrayList<Board> selectSearchWriter(String keyword, Pageable pageable) {

		// jpa 가 제공하는 findAll(pageable) 메소드가 있으나, 키워드도 함께 전달되는 메소드는 없음
		// 추가해서 사용함 : BoardRepository 인터페이스에 메소드 추가함
		Page<BoardEntity> page = boardRepository.findSearchWriter(keyword, pageable);
		ArrayList<Board> list = new ArrayList<>();
		for (BoardEntity entity : page) {
			list.add(entity.toDto());
		}
		return list;
	}

	public ArrayList<Board> selectSearchDate(Search search, Pageable pageable) {
		// jpa 가 제공하는 findAll(pageable) 메소드가 있으나, 키워드도 함께 전달되는 메소드는 없음
		// 추가해서 사용함 : BoardRepository 인터페이스에 메소드 추가함
		Page<BoardEntity> page = boardRepository.findSearchDate(search.getBegin(), search.getEnd(), pageable);
		ArrayList<Board> list = new ArrayList<>();
		for (BoardEntity entity : page) {
			list.add(entity.toDto());
		}
		return list;
	}
}
