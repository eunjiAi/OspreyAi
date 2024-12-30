package org.myweb.ospreyai.posts.model.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.myweb.ospreyai.posts.jpa.entity.PostsEntity;
import org.myweb.ospreyai.posts.jpa.repository.PostsRepository;
import org.myweb.ospreyai.posts.model.dto.Posts;
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
public class PostsService {
	private final PostsRepository postsRepository;

	// 엔티티 리스트를 DTO 리스트로 변환 (Page 타입 처리)
	private ArrayList<Posts> toList(Page<PostsEntity> entityList) {
		ArrayList<Posts> list = new ArrayList<>();
		for(PostsEntity entity : entityList){
			list.add(entity.toDto());
		}
		return list;
	}

	// 엔티티 리스트를 DTO 리스트로 반환 (List 타입 처리) => 오버로딩
	private ArrayList<Posts> toList(List<PostsEntity> entityList) {
		ArrayList<Posts> list = new ArrayList<>();
		for(PostsEntity entity : entityList){
			list.add(entity.toDto());
		}
		return list;
	}

	// 게시글 상세 조회
	public Posts selectPosts(int postId) {
		Optional<PostsEntity> entityOptional = postsRepository.findById(postId);
		return entityOptional.get().toDto();
	}

	// 조회수 증가
	@Transactional
	public void updateAddPostsCount(int postsId) {
		Optional<PostsEntity> entity = postsRepository.findById(postsId);
		PostsEntity postsEntity = entity.get();
		postsEntity.setPostCount(postsEntity.getPostCount() + 1);
		postsRepository.save(postsEntity).toDto();
	}

	// 게시글 리스트 조회 (페이징 처리)
	public ArrayList<Posts> selectList(Pageable pageable) {
		return toList(postsRepository.findAll(pageable));
	}

	// 게시글 전체 개수 조회
	public int selectListCount() {
		return (int)postsRepository.count();
	}

	// 게시글 추가
	@Transactional
	public int insertPosts(Posts posts) {
		try {
			//마지막 번호에서 +1 추가
			posts.setPostId(postsRepository.findLastPostId() + 1);
			postsRepository.save(posts.toEntity());
			return 1;
		}catch(Exception e){
			log.info(e.getMessage());
			return 0;
		}
	}

	// 게시글 삭제
	@Transactional
	public int deletePosts(int postId) {
		try {
			postsRepository.deleteById(postId);
			return 1;
		}catch(Exception e){
			log.info(e.getMessage());
			return 0;
		}
	}

	// 게시글 수정
	@Transactional
	public int updatePosts(Posts posts) {
		try {
			Optional<PostsEntity> existingEntityOpt = postsRepository.findById(posts.getPostId());
			if (existingEntityOpt.isEmpty()) {
				return 0;
			}
			PostsEntity existingEntity = existingEntityOpt.get();

			posts.setPostDate(existingEntity.getPostDate());
			posts.setPostUpdate(new Date(System.currentTimeMillis()));
			postsRepository.save(posts.toEntity());
			return 1;
		} catch (Exception e) {
			log.info(e.getMessage());
			return 0;
		}
	}


	//검색용 메소드 --------------------------------------------------------
	public ArrayList<Posts> selectSearchTitle(String keyword, Pageable pageable) {
		return toList(postsRepository.findSearchTitle(keyword, pageable));
	}

	public int selectSearchTitleCount(String keyword) {
		return (int)postsRepository.countSearchTitle(keyword);
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





