import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../../utils/axios";
import styles from "./Posts.css";
import PagingView from "../../components/common/PagingView";
import { AuthContext } from "../../AuthProvider";

import fileDownIcon from "../../images/fileDown.png";

function Board({ searchResults }) {
  const [boards, setBoards] = useState([]); // 게시글 목록
  const [pagingInfo, setPagingInfo] = useState({
    currentPage: 1,
    maxPage: 1,
    startPage: 1,
    endPage: 1,
  }); // 페이징 정보

  const [isSearchMode, setIsSearchMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { role } = useContext(AuthContext);
  const navigate = useNavigate();

  /**
   * 게시글 목록을 가져오는 함수
   * 백엔드 매핑: GET /posts?page=1&limit=10
   */
  const fetchBoards = async (page) => {
    try {
      setLoading(true);
      const response = await apiClient.get(`/posts?page=${page}`);
      setBoards(response.data.list); // 게시글 목록 설정
      setPagingInfo(response.data.paging); // 페이징 정보 설정
      setIsSearchMode(false); // 검색 모드 해제
    } catch (err) {
      setError("게시글을 불러오는 데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  /**
   * 컴포넌트가 처음 렌더링되거나 검색 결과가 바뀔 때 실행
   */
  useEffect(() => {
    if (searchResults) {
      // 검색 결과 설정
      setBoards(searchResults.list || []);
      setPagingInfo(searchResults.paging || {});
      setIsSearchMode(true);
      setLoading(false);
    } else {
      // 기본 게시글 목록 가져오기
      fetchBoards(1);
    }
  }, [searchResults]);

  /**
   * 페이징 처리
   * 백엔드 매핑: GET /posts?page=1&limit=10
   */
  const handlePageChange = async (page) => {
    try {
      setLoading(true);
      if (isSearchMode) {
        // 검색 모드에서는 검색 결과 페이징 처리
        const response = await apiClient.get(`/posts/search/title`, {
          params: {
            action: searchResults.action,
            keyword: searchResults.keyword,
            page,
          },
        });
        setBoards(response.data.list || []);
        setPagingInfo(response.data.paging || {});
      } else {
        // 일반 게시글 페이징 처리
        fetchBoards(page);
      }
    } catch (err) {
      setError("페이징 요청 실패!");
    } finally {
      setLoading(false);
    }
  };

  /**
   * 글쓰기 페이지 이동
   */
  const handleWriteClick = () => {
    navigate("/board/new");
  };

  /**
   * 게시글 상세 페이지 이동
   */
  const handleTitleClick = (id) => {
    navigate(`/board/${id}`);
  };

  if (loading) {
    return <div className={styles.loading}>로딩 중...</div>;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  return (
    <div className="board-container">
      <h1 className="board-title">게시판</h1>
      {role === "ADMIN" && <button onClick={handleWriteClick}>글쓰기</button>}
      <table className={styles.boardList}>
        <thead>
          <tr>
            <th>번호</th>
            <th>제목</th>
            <th>작성자</th>
            <th>첨부파일</th>
            <th>날짜</th>
            <th>조회수</th>
          </tr>
        </thead>
        <tbody>
          {boards.map((board) => (
            <tr key={board.postId} className={styles.boardItem}>
              <td className={styles.postId}>{board.postId}</td>
              <td className={styles.title}>
                <span
                  style={{
                    color: "blue",
                    cursor: "pointer",
                    textDecoration: "underline",
                  }}
                  onClick={() => handleTitleClick(board.postId)}
                >
                  {board.title}
                </span>
              </td>
              <td className={styles.writer}>{board.writer}</td>
              <td className={styles.ofileName}>
                {board.fileName ? (
                  <a
                    href={`/posts/pfdown?ofile=${board.fileName}&rfile=${board.renameFile}`}
                  >
                    <img
                      src={fileDownIcon}
                      style={{ width: "20px", height: "20px" }}
                      alt="file download"
                    />
                  </a>
                ) : (
                  ""
                )}
              </td>
              <td className={styles.createdAt}>{board.postDate}</td>
              <td className={styles.count}>{board.postCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <PagingView
        currentPag={pagingInfo.currentPage || 1}
        maxPage={pagingInfo.maxPage || 1}
        startPage={pagingInfo.startPage || 1}
        endPage={pagingInfo.endPage || 1}
        onPageChange={(page) => handlePageChange(page)}
      />
    </div>
  );
}

export default Board;
