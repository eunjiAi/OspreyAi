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

@Slf4j
@RequiredArgsConstructor
@RestController
@RequestMapping("/notice")
@CrossOrigin
public class NoticeController {

    private final NoticeService noticeService;

    @Value("${file.upload-dir}")
    private String uploadDir;

    // 공지사항 전체 목록보기
    @GetMapping
    public Map<String, Object> noticeListMethod(
            @RequestParam(name = "page", defaultValue = "1") int currentPage,
            @RequestParam(name = "limit", defaultValue = "10") int limit) {

        int listCount = noticeService.selectListCount();
        Paging paging = new Paging(listCount, limit, currentPage);
        paging.calculate();

        Pageable pageable = PageRequest.of(paging.getCurrentPage() - 1, paging.getLimit(),
                Sort.by(Sort.Direction.DESC, "noticeNo"));

        ArrayList<Notice> list = noticeService.selectList(pageable);

        Map<String, Object> map = new HashMap<>();
        map.put("list", list);
        map.put("paging", paging);

        return map;
    }

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
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    // 공지글 등록(파일 업로드)
    @PostMapping
    public ResponseEntity<?> noticeInsertMethod(
            @ModelAttribute Notice notice,
            @RequestParam(name = "ofile", required = false) MultipartFile mfile) {
        String savePath = uploadDir + "/notice_upfiles";
        if (notice.getNTitle().trim().isEmpty()) {
            notice.setNTitle("제목이 없습니다.");
        }

        File directory = new File(savePath);
        if (!directory.exists()) {
            directory.mkdirs();
        }

        if (mfile != null && !mfile.isEmpty()) {
            String fileName = mfile.getOriginalFilename();
            String renameFileName = null;

            if (fileName != null && !fileName.isEmpty()) {
                renameFileName = FileNameChange.change(fileName, "yyyyMMddHHmmss");
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

    // 첨부파일 다운로드
    @GetMapping("/nfdown")
    public ResponseEntity<Resource> fileDownload(
            @RequestParam("ofile") String originalFileName,
            @RequestParam("rfile") String renameFileName) throws IOException {
        String savePath = uploadDir + "/notice_upfiles";

        Path path = Paths.get(savePath).toAbsolutePath().normalize();

        Resource resource = null;
        try {
            resource = new UrlResource(path.toUri() + "/" + renameFileName);
        } catch (Exception e) {
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

    // 공지글 삭제
    @DeleteMapping("/{noticeNo}")
    public ResponseEntity<?> noticeDeleteMethod(@PathVariable int noticeNo,
                                                @RequestParam(name = "rfile", required = false) String renameFileName) {
        if (noticeService.deleteNotice(noticeNo) > 0) {
            if (renameFileName != null && renameFileName.length() > 0) {
                String savePath = uploadDir + "/notice_upfiles";

                Path path = Paths.get(savePath, renameFileName);
                File file = path.toFile();
                if (file.exists()) {
                    if (!file.delete()) {
                        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
                    }
                }
            }
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // 공지글 수정
    @PutMapping("/{id}")
    public ResponseEntity<?> updateNotice(
            @ModelAttribute Notice notice,
            @RequestParam(name = "ofile", required = false) MultipartFile mfile) {
        if (notice.getNTitle().trim().isEmpty()) {
            notice.setNTitle("제목이 없습니다.");
        }
        String savePath = uploadDir + "/notice_upfiles";

        if (mfile != null && !mfile.isEmpty()) {
            new File(savePath, notice.getRfileName()).delete();
            notice.setOfileName(null);
            notice.setRfileName(null);

            String fileName = mfile.getOriginalFilename();
            if (fileName != null && !fileName.isEmpty()) {
                String renameFileName = FileNameChange.change(fileName, "yyyyMMddHHmmss");
                try {
                    mfile.transferTo(new File(savePath, renameFileName));
                    notice.setOfileName(fileName);
                    notice.setRfileName(renameFileName);
                } catch (Exception e) {
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

    // 공지글 제목 검색용 (페이징 처리 포함)
    @GetMapping("/search/title")
    public ResponseEntity<Map> noticeSearchTitle(
            @RequestParam("action") String action,
            @RequestParam("keyword") String keyword,
            @RequestParam(name = "page", defaultValue = "1") int currentPage,
            @RequestParam(name = "limit", defaultValue = "10") int limit) {
        int listCount = noticeService.selectSearchTitleCount(keyword);

        Paging paging = new Paging(listCount, limit, currentPage);
        paging.calculate();

        Pageable pageable = PageRequest.of(paging.getCurrentPage() - 1, paging.getLimit(),
                Sort.by(Sort.Direction.DESC, "noticeNo"));

        ArrayList<Notice> list = noticeService.selectSearchTitle(keyword, pageable);
        Map<String, Object> map = new HashMap<String, Object>();

        if (list != null && list.size() > 0) {
            map.put("list", list);
            map.put("paging", paging);
            map.put("action", action);
            map.put("keyword", keyword);

            return new ResponseEntity<>(map, HttpStatus.OK);
        } else {
            map.put("message", "검색실패");
            return new ResponseEntity<>(map, HttpStatus.BAD_REQUEST);
        }
    }

    // 공지사항 필터링 목록보기 요청(마이페이지)
    @GetMapping("/my")
    public Map<String, Object> noticeListIdMethod(
            @RequestParam(name = "page", defaultValue = "1") int currentPage,
            @RequestParam(name = "limit", defaultValue = "10") int limit,
            @RequestParam(name = "userid", required = false) String userid) {

        int listCount = noticeService.selectListIdCount(userid);
        Paging paging = new Paging(listCount, limit, currentPage);
        paging.calculate();

        Pageable pageable = PageRequest.of(paging.getCurrentPage() - 1, paging.getLimit(),
                Sort.by(Sort.Direction.DESC, "noticeNo"));

        ArrayList<Notice> list = noticeService.selectListId(pageable, userid);  // userid로 필터링된 공지사항만 가져오기

        Map<String, Object> map = new HashMap<>();
        map.put("list", list);
        map.put("paging", paging);

        return map;
    }

}
