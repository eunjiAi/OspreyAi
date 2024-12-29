package org.myweb.ospreyai.notice.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.myweb.ospreyai.common.FileNameChange;
import org.myweb.ospreyai.common.Paging;
import org.myweb.ospreyai.common.Search;
import org.myweb.ospreyai.notice.model.dto.Notice;
import org.myweb.ospreyai.notice.model.service.NoticeService;
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
import java.sql.Date;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

@Slf4j    //log 객체 선언임, 별도의 로그객체 선언 필요없음, 제공되는 레퍼런스는 log 임
@RequiredArgsConstructor
@RestController
@RequestMapping("/notice")
@CrossOrigin			//다른 port 에서 오는 요청을 처리하기 위함
public class NoticeController {

	private final NoticeService noticeService;

	@Value("${file.upload-dir}")
	private String uploadDir;

	// 공지글 상세 보기
	@GetMapping("/{id}")
	public ResponseEntity<Notice> getNoticeById(@PathVariable int id) {
		try {
			Notice notice = noticeService.selectNotice(id);
			if (notice == null) {
				return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
			}
			noticeService.updateAddReadCount(id);
			return ResponseEntity.ok(notice);
		} catch (Exception e) {
			log.error("Error fetching notice details", e);
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
		}
	}

	// 공지사항 전체 목록보기 요청 처리용 (페이징 처리 : 한 페이지에 10개씩 출력 처리)
	@GetMapping
	public Map<String, Object> noticeListMethod(
			@RequestParam(name = "page", defaultValue = "1") int currentPage,
			@RequestParam(name = "limit", defaultValue = "10") int limit) {
		// page : 출력할 페이지, limit : 한 페이지에 출력할 목록 갯수

		int listCount = noticeService.selectListCount();
		Paging paging = new Paging(listCount, limit, currentPage, "noticeList");
		paging.calculate();

		Pageable pageable = PageRequest.of(paging.getCurrentPage() - 1, paging.getLimit(),
				Sort.by(Sort.Direction.DESC, "noticeNo"));

		ArrayList<Notice> list = noticeService.selectList(pageable);

		Map<String, Object> map = new HashMap<>();
		map.put("list", list);
		map.put("paging", paging);

		return map;
	}

	// 공지글 등록 요청(파일 업로드)
	@PostMapping
	public ResponseEntity noticeInsertMethod(
			@ModelAttribute Notice notice,
			@RequestParam(name = "ofile", required = false) MultipartFile mfile) throws IOException {
		log.info("noticeInsertMethod() : " + notice);

		String savePath = uploadDir + "/notice_upfiles";
		log.info("noticeInsertMethod() => savePath : " + savePath);


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

			notice.setOfileName(fileName);
			notice.setRfileName(renameFileName);
		}

		if (noticeService.insertNotice(notice) > 0) {
			return ResponseEntity.ok().build();
		} else {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
		}
	}

	// 첨부파일 다운로드 요청 처리
	@GetMapping("/nfdown")
	public ResponseEntity<Resource> fileDownload(
			@RequestParam("ofile") String originalFileName,
			@RequestParam("rfile") String renameFileName) throws IOException {

		String savePath = uploadDir + "/notice_upfiles";

		Path path = Paths.get(savePath).toAbsolutePath().normalize();

		// Resource 객체 생성
		Resource resource = null;
		try {
			resource = new UrlResource(path.toUri() + "/" + renameFileName);
		} catch (Exception e){
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
		}

		// 파일 이름 설정 (한글 파일명 인코딩)
		String encodedFileName = originalFileName != null ? originalFileName : renameFileName;
		try {
			encodedFileName = URLEncoder.encode(encodedFileName, "UTF-8").replaceAll("\\+", "%20");
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
		}

		// Content-Disposition 헤더 설정
		String contentDisposition = "attachment; filename=\"" + encodedFileName + "\"";

		return ResponseEntity.ok()
				.contentType(MediaType.APPLICATION_OCTET_STREAM)
				.header("Content-Disposition", contentDisposition)
				.body(resource);
	}


	// 공지글 삭제 요청 처리용
	@DeleteMapping("/{noticeNo}")
	public ResponseEntity noticeDeleteMethod(@PathVariable int noticeNo,
			@RequestParam(name = "rfile", required = false) String renameFileName) {
		if (noticeService.deleteNotice(noticeNo) > 0) { // 공지글 삭제 성공시
			// 공지글 삭제 성공시 저장 폴더에 있는 첨부파일도 삭제 처리함
			if (renameFileName != null && renameFileName.length() > 0) {
				// 공지사항 첨부파일 저장 폴더 경로 지정
				String savePath = uploadDir + "/notice_upfiles";

				//Path 객체 생성
				Path path = Paths.get(savePath, renameFileName);
				File file = path.toFile();
				if (file.exists()) {
					if(!file.delete()){
						return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
					}
				}
			}
			return ResponseEntity.ok().build();
		} else {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
		}
	}

	// 공지글 수정 요청
	@PutMapping("/{id}")
	public ResponseEntity<?> updateNotice(
			@ModelAttribute Notice notice,
			@RequestParam(name = "ofile", required = false) MultipartFile mfile) {
		log.info("updateNotice() : " + notice);

		// 첨부파일 처리 로직
		String savePath = uploadDir + "/notice_upfiles";
		log.info("savePath : " + savePath);

		if (mfile != null && !mfile.isEmpty()) {
			// 기존 파일 삭제
			new File(savePath, notice.getRfileName()).delete();
			notice.setOfileName(null);
			notice.setRfileName(null);

			// 새 파일 저장
			String fileName = mfile.getOriginalFilename();
			if (fileName != null && !fileName.isEmpty()) {
				String renameFileName = FileNameChange.change(fileName, "yyyyMMddHHmmss");
				try {
					mfile.transferTo(new File(savePath, renameFileName));
					notice.setOfileName(fileName);
					notice.setRfileName(renameFileName);
				} catch (Exception e) {
					e.printStackTrace();
					return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
				}
			}
		}

		// 서비스 호출
		int result = noticeService.updateNotice(notice);
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
