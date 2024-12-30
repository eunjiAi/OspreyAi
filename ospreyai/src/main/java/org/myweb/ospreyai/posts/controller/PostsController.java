package org.myweb.ospreyai.posts.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.myweb.ospreyai.posts.model.dto.Posts;
import org.myweb.ospreyai.posts.model.service.PostsService;
import org.myweb.ospreyai.common.FileNameChange;
import org.myweb.ospreyai.common.Paging;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.net.URLEncoder;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

@Slf4j
@RequiredArgsConstructor
@RestController
@RequestMapping("/posts")
@CrossOrigin // 다른 포트에서 오는 요청을 허용하기 위한 설정
public class PostsController {

	private final PostsService postsService;

	@Value("${file.upload-dir}")
	private String uploadDir;

	// 게시글 상세보기
	@GetMapping("/{id}")
	public ResponseEntity<Posts> getPostsById(@PathVariable int id) {
		try {
			Posts posts = postsService.selectPosts(id);
			if (posts == null) {
				return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
			}
			postsService.updateAddPostsCount(id);
			return ResponseEntity.ok(posts);
		} catch (Exception e) {
			log.error("Error fetching posts details", e);
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
		}
	}

	// 게시글 목록 조회
	@GetMapping
	public Map<String, Object> postsListMethod(
			@RequestParam(name = "page", defaultValue = "1") int currentPage,
			@RequestParam(name = "limit", defaultValue = "10") int limit) {

		int listCount = postsService.selectListCount();
		Paging paging = new Paging(listCount, limit, currentPage);
		paging.calculate();

		Pageable pageable = PageRequest.of(paging.getCurrentPage() - 1, paging.getLimit(),
				Sort.by(Sort.Direction.DESC, "postId"));

		ArrayList<Posts> list = postsService.selectList(pageable);

		Map<String, Object> map = new HashMap<>();
		map.put("list", list);
		map.put("paging", paging);

		return map;
	}

	// 게시글 등록
	@PostMapping
	public ResponseEntity postsInsertMethod(
			@ModelAttribute Posts posts,
			@RequestParam(name = "ofile", required = false) MultipartFile mfile) throws IOException {
		log.info("postsInsertMethod() : " + posts);

		String savePath = uploadDir + "/posts_upfiles";
		log.info("postsInsertMethod() => savePath : " + savePath);

		File directory = new File(savePath);
		if (!directory.exists()) {
			directory.mkdirs();
		}

		if (mfile != null && !mfile.isEmpty()) {
			String fileName = mfile.getOriginalFilename();
			String renameFileName = null;

			if (fileName != null && !fileName.isEmpty()) {
				renameFileName = FileNameChange.change(fileName, "yyyyMMddHHmmss");
				log.info("변경된 첨부파일명 : " + renameFileName);

				try {
					mfile.transferTo(new File(savePath, renameFileName));
				} catch (Exception e) {
					return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
				}
			}

			posts.setFileName(fileName);
			posts.setRenameFile(renameFileName);
		}

		if (postsService.insertPosts(posts) > 0) {
			return ResponseEntity.ok().build();
		} else {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
		}
	}

	// 파일 다운로드
	@GetMapping("/pfdown")
	public ResponseEntity<Resource> fileDownload(
			@RequestParam("ofile") String originalFileName,
			@RequestParam("rfile") String renameFileName) throws IOException {

		String savePath = uploadDir + "/posts_upfiles";
		Path path = Paths.get(savePath).toAbsolutePath().normalize();

		Resource resource;
		try {
			resource = new UrlResource(path.toUri() + "/" + renameFileName);
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
		}

		String encodedFileName = originalFileName != null ? originalFileName : renameFileName;
		try {
			encodedFileName = URLEncoder.encode(encodedFileName, "UTF-8").replaceAll("\\+", "%20");
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
		}

		String contentDisposition = "attachment; filename=\"" + encodedFileName + "\"";

		return ResponseEntity.ok()
				.contentType(MediaType.APPLICATION_OCTET_STREAM)
				.header("Content-Disposition", contentDisposition)
				.body(resource);
	}

	// 게시글 삭제
	@DeleteMapping("/{postId}")
	public ResponseEntity postsDeleteMethod(@PathVariable int postId,
											@RequestParam(name = "rfile", required = false) String renameFileName) {
		if (postsService.deletePosts(postId) > 0) {
			if (renameFileName != null && renameFileName.length() > 0) {
				String savePath = uploadDir + "/posts_upfiles";
				Path path = Paths.get(savePath, renameFileName);
				File file = path.toFile();
				if (file.exists() && !file.delete()) {
					return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
				}
			}
			return ResponseEntity.ok().build();
		} else {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
		}
	}

	// 게시글 수정
	@PutMapping("/{id}")
	public ResponseEntity<?> updatePosts(
			@ModelAttribute Posts posts,
			@RequestParam(name = "ofile", required = false) MultipartFile mfile) {
		log.info("updatePosts() : " + posts);

		String savePath = uploadDir + "/posts_upfiles";
		log.info("updatePosts(), savePath : " + savePath);

		File directory = new File(savePath);
		if (!directory.exists()) {
			directory.mkdirs();
		}

		if (mfile != null && !mfile.isEmpty()) {
			new File(savePath, posts.getRenameFile()).delete();
			posts.setFileName(null);
			posts.setRenameFile(null);

			String fileName = mfile.getOriginalFilename();
			if (fileName != null && !fileName.isEmpty()) {
				String renameFileName = FileNameChange.change(fileName, "yyyyMMddHHmmss");
				try {
					mfile.transferTo(new File(savePath, renameFileName));
					posts.setFileName(fileName);
					posts.setRenameFile(renameFileName);
				} catch (Exception e) {
					e.printStackTrace();
					return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
				}
			}
		}

		int result = postsService.updatePosts(posts);
		if (result > 0) {
			return ResponseEntity.ok().build();
		} else {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
		}
	}




//	// 공지글 제목 검색용 (페이징 처리 포함)
//	@GetMapping("/search/title")
//	public ResponseEntity<Map> noticeSearchTitleMethod(
//			@RequestParam("action") String action,
//			@RequestParam("keyword") String keyword,
//			@RequestParam(name = "page", defaultValue = "1") int currentPage,
//			@RequestParam(name = "limit", defaultValue = "10") int limit) {
//		// page : 출력할 페이지, limit : 한 페이지에 출력할 목록 갯수
//
//		// 검색결과가 적용된 총 목록갯수 조회해서 총 페이지 수 계산함
//		int listCount = noticeService.selectSearchTitleCount(keyword);
//		// 페이지 관련 항목 계산 처리
//		Paging paging = new Paging(listCount, limit, currentPage, "nsearchTitle.do");
//		paging.calculate();
//
//		//JPA 가 제공하는 메소드에 필요한 Pageable 객체 생성함 ---------------------------------------
//		Pageable pageable = PageRequest.of(paging.getCurrentPage() - 1, paging.getLimit(),
//				Sort.by(Sort.Direction.DESC, "noticeNo"));
//
//		// 서비스롤 목록 조회 요청하고 결과 받기
//		ArrayList<Notice> list = noticeService.selectSearchTitle(keyword, pageable);
//		Map<String, Object> map = new HashMap<String, Object>();
//
//		if (list != null && list.size() > 0) {
//			map.put("list", list);
//			map.put("paging", paging);
//			//아래 데이터들은 요청한 페이지에 존재하는 값이므로 응답 처리에서 제외함
////			map.put("currentPage", currentPage);
//			map.put("action", action);
//			map.put("keyword", keyword);
//
//			return new ResponseEntity<Map>(map, HttpStatus.OK);
//		} else {
//			map.put("message", "검색실패");
//			return new ResponseEntity<Map>(map, HttpStatus.BAD_REQUEST);
//		}
//	}
//
//	// 공지글 내용 검색용 (페이징 처리 포함)
//	@GetMapping("/search/content")
//	public ResponseEntity<Map> noticeSearchContentMethod(
//			 @RequestParam("action") String action,
//			 @RequestParam("keyword") String keyword,
//			 @RequestParam(name = "page", defaultValue = "1") int currentPage,
//			 @RequestParam(name = "limit", defaultValue = "10") int limit) {
//
//		// page : 출력할 페이지, limit : 한 페이지에 출력할 목록 갯수
//		// 검색결과가 적용된 총 목록갯수 조회해서 총 페이지 수 계산함
//		int listCount = noticeService.selectSearchContentCount(keyword);
//		// 페이지 관련 항목 계산 처리
//		Paging paging = new Paging(listCount, limit, currentPage, "nsearchContent.do");
//		paging.calculate();
//
//		//JPA 가 제공하는 메소드에 필요한 Pageable 객체 생성함 ---------------------------------------
//		Pageable pageable = PageRequest.of(paging.getCurrentPage() - 1, paging.getLimit(),
//				Sort.by(Sort.Direction.DESC, "noticeNo"));
//
//		// 서비스롤 목록 조회 요청하고 결과 받기
//		ArrayList<Notice> list = noticeService.selectSearchContent(keyword, pageable);
//		Map<String, Object> map = new HashMap<String, Object>();
//
//		if (list != null && list.size() > 0) {
//			map.put("list", list);
//			map.put("paging", paging);
//			//아래 데이터들은 요청한 페이지에 존재하는 값이므로 응답 처리에서 제외함
////			map.put("currentPage", currentPage);
////			map.put("action", action);
////			map.put("keyword", keyword);
//
//			return new ResponseEntity<Map>(map, HttpStatus.OK);
//		} else {
//			map.put("message", "검색실패");
//			return new ResponseEntity<Map>(map, HttpStatus.BAD_REQUEST);
//		}
//	}
//
//	// 공지글 등록날짜 검색용 (페이징 처리 포함)
//	@GetMapping("/search/date")
//	public ResponseEntity<Map> noticeSearchDateMethod(
//			Search search,
//			@RequestParam("action") String action,
//			@RequestParam(name = "page", defaultValue = "1") int currentPage,
//			@RequestParam(name = "limit", defaultValue = "10") int limit) {
//
//		// page : 출력할 페이지, limit : 한 페이지에 출력할 목록 갯수
//
//		// 검색결과가 적용된 총 목록갯수 조회해서 총 페이지 수 계산함
//		int listCount = noticeService.selectSearchDateCount(search);
//		// 페이지 관련 항목 계산 처리
//		Paging paging = new Paging(listCount, limit, currentPage, "nsearchDate.do");
//		paging.calculate();
//
//		//JPA 가 제공하는 메소드에 필요한 Pageable 객체 생성함 ---------------------------------------
//		Pageable pageable = PageRequest.of(paging.getCurrentPage() - 1, paging.getLimit(),
//				Sort.by(Sort.Direction.DESC, "noticeNo"));
//
//		// 서비스롤 목록 조회 요청하고 결과 받기
//		ArrayList<Notice> list = noticeService.selectSearchDate(search, pageable);
//		Map<String, Object> map = new HashMap<String, Object>();
//
//		if (list != null && list.size() > 0) {
//			map.put("list", list);
//			map.put("paging", paging);
//			//아래 데이터들은 요청한 페이지에 존재하는 값이므로 응답 처리에서 제외함
////			map.put("currentPage", currentPage);
////			map.put("action", action);
////			map.put("begin", search.getBegin());
////			map.put("end", search.getEnd());
//
//			return new ResponseEntity<Map>(map, HttpStatus.OK);
//		} else {
//			map.put("message", "검색실패");
//			return new ResponseEntity<Map>(map, HttpStatus.BAD_REQUEST);
//		}
//	}
}
