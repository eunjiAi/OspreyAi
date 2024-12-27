package org.myweb.ospreyai.notice.model.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.myweb.ospreyai.common.Search;
import org.myweb.ospreyai.notice.jpa.entity.NoticeEntity;
import org.myweb.ospreyai.notice.jpa.repository.NoticeRepository;
import org.myweb.ospreyai.notice.model.dto.Notice;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class NoticeService {
	private final NoticeRepository noticeRepository;

	private ArrayList<Notice> toList(Page<NoticeEntity> entityList) {
		ArrayList<Notice> list = new ArrayList<>();
		for(NoticeEntity entity : entityList){
			list.add(entity.toDto());
		}
		return list;
	}

	// toList 오버로딩
	private ArrayList<Notice> toList(List<NoticeEntity> entityList) {
		ArrayList<Notice> list = new ArrayList<>();
		for(NoticeEntity entity : entityList){
			list.add(entity.toDto());
		}
		return list;
	}

	@Transactional
	public int insertNotice(Notice notice) {
		try {
			//마지막 번호에서 +1 추가
			notice.setNoticeNo(noticeRepository.findLastNoticeNo() + 1);
			noticeRepository.save(notice.toEntity());
			return 1;
		}catch(Exception e){
			log.info(e.getMessage());
			return 0;
		}
	}

	public Notice selectNotice(int noticeNo) {
		Optional<NoticeEntity> entityOptional = noticeRepository.findById(noticeNo);
		return entityOptional.get().toDto();
	}

	@Transactional
	public Notice updateAddReadCount(int noticeNo) {
		Optional<NoticeEntity> entity = noticeRepository.findById(noticeNo);
		NoticeEntity noticeEntity = entity.get();
		log.info("addReadCount : " + noticeEntity);
		noticeEntity.setNCount(noticeEntity.getNCount() + 1);
		return noticeRepository.save(noticeEntity).toDto();	//jpa가 제공
	}

	//로직을 단계별로 처리한 코드 ------------------------------------------
	/*public ArrayList<Notice> selectList(Pageable pageable) {
		//jpa 제공 메소드 사용
		//findAll() : Entity 반환됨 => select * from notice 쿼리 자동 실행됨
		//page 단위로 list 조회를 하고자 한다면, 스프링이 제공하는 Pageable 객체를 사용함
		//findAll(Pageable 변수) : Page<NoticeEntity> 반환됨 => 한 페이지의 리스트 정보가 들어있음
		Page<NoticeEntity> entityList = noticeRepository.findAll(pageable);
		//컨트롤러로 리턴할 ArrayList<Notice> 타입으로 변경 처리 필요함
		ArrayList<Notice> list = new ArrayList<>();
		//Page 안의 NoticeEntity 를 Notice 로 변환해서 리스트에 추가 처리함
		for(NoticeEntity entity : entityList){
			list.add(entity.toDto());
		}
		return list;
	}*/

	//별도로 작성된 toList() 메소드 이용한 코드로 변경하면 ---------------------
	public ArrayList<Notice> selectList(Pageable pageable) {
		return toList(noticeRepository.findAll(pageable));
	}


	public int selectListCount() {
		return (int)noticeRepository.count();
	}

	@Transactional
	public int deleteNotice(int noticeNo) {
		//jpa 제공하는 메소드 사용
		//deleteById(pk로 지정된 컬럼에 대한 property): void => 실패하면 에러, 성공하면 리턴값없음
		try {
			noticeRepository.deleteById(noticeNo);
			return 1;
		}catch(Exception e){
			log.info(e.getMessage());
			return 0;
		}
	}


	public int updateNotice(Notice notice) {
		//save(Entity) : Entity 가 반환되는 메소드 사용, 실패하면 에러 발생하고 null 리턴
		//jpa 가 제공, insert 문, update 문 처리
		try {
			noticeRepository.save(notice.toEntity());
			return 1;
		}catch(Exception e){
			log.info(e.getMessage());
			return 0;
		}
	}

	//검색용 메소드 --------------------------------------------------------
//	public ArrayList<Notice> selectSearchTitle(String keyword, Pageable pageable) {
//		return toList(noticeRepository.findSearchTitle(keyword, pageable));
//	}
//
//	public int selectSearchTitleCount(String keyword) {
//		return (int)noticeRepository.countSearchTitle(keyword);
//	}
//
//	public ArrayList<Notice> selectSearchContent(String keyword, Pageable pageable) {
//		return toList(noticeRepository.findSearchContent(keyword, pageable));
//	}
//
//	public int selectSearchContentCount(String keyword) {
//		return (int)noticeRepository.countSearchContent(keyword);
//	}
//
//	public ArrayList<Notice> selectSearchDate(Search search, Pageable pageable) {
//		return toList(noticeRepository.findSearchDate(search.getBegin(), search.getEnd(), pageable));
//	}
//
//	public int selectSearchDateCount(Search search) {
//		return (int)noticeRepository.countSearchDate(search.getBegin(), search.getEnd());
//	}
}





