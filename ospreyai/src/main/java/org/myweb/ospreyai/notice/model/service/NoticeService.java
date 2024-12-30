package org.myweb.ospreyai.notice.model.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.myweb.ospreyai.notice.jpa.entity.NoticeEntity;
import org.myweb.ospreyai.notice.jpa.repository.NoticeRepository;
import org.myweb.ospreyai.notice.model.dto.Notice;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Date;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class NoticeService {
	private final NoticeRepository noticeRepository;

	// 엔티티 리스트를 DTO 리스트로 변환 (Page 타입 처리)
	private ArrayList<Notice> toList(Page<NoticeEntity> entityList) {
		ArrayList<Notice> list = new ArrayList<>();
		for(NoticeEntity entity : entityList){
			list.add(entity.toDto());
		}
		return list;
	}

	// 엔티티 리스트를 DTO 리스트로 반환 (List 타입 처리)
	private ArrayList<Notice> toList(List<NoticeEntity> entityList) {
		ArrayList<Notice> list = new ArrayList<>();
		for(NoticeEntity entity : entityList){
			list.add(entity.toDto());
		}
		return list;
	}

	// 공지사항 상세 조회
	public Notice selectNotice(int noticeNo) {
		Optional<NoticeEntity> entityOptional = noticeRepository.findById(noticeNo);
		return entityOptional.get().toDto();
	}

	// 조회수 증가
	@Transactional
	public void updateAddReadCount(int noticeNo) {
		Optional<NoticeEntity> entity = noticeRepository.findById(noticeNo);
		NoticeEntity noticeEntity = entity.get();
		noticeEntity.setNCount(noticeEntity.getNCount() + 1);
		noticeRepository.save(noticeEntity).toDto();
	}

	// 공지사항 리스트 조회 (페이징 처리)
	public ArrayList<Notice> selectList(Pageable pageable) {
		return toList(noticeRepository.findAll(pageable));
	}

	// 공지사항 전체 개수 조회
	public int selectListCount() {
		return (int)noticeRepository.count();
	}

	// 공지사항 추가
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

	// 공지사항 삭제
	@Transactional
	public int deleteNotice(int noticeNo) {
		try {
			noticeRepository.deleteById(noticeNo);
			return 1;
		}catch(Exception e){
			log.info(e.getMessage());
			return 0;
		}
	}

	//공지사항 수정
	@Transactional
	public int updateNotice(Notice notice) {
		try {
			Optional<NoticeEntity> existingEntityOpt = noticeRepository.findById(notice.getNoticeNo());
			if (existingEntityOpt.isEmpty()) {
				return 0;
			}
			NoticeEntity existingEntity = existingEntityOpt.get();

			notice.setNCreatedAt(existingEntity.getNCreatedAt());
			notice.setNUpdatedAt(new Date(System.currentTimeMillis()));
			notice.setNCount(existingEntity.getNCount());
			noticeRepository.save(notice.toEntity());
			return 1;
		} catch (Exception e) {
			log.info(e.getMessage());
			return 0;
		}
	}


	//검색용 메소드 --------------------------------------------------------
	public ArrayList<Notice> selectSearchTitle(String keyword, Pageable pageable) {
		return toList(noticeRepository.findSearchTitle(keyword, pageable));
	}

	public int selectSearchTitleCount(String keyword) {
		return (int)noticeRepository.countSearchTitle(keyword);
	}
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





