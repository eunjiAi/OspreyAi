import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../../utils/axios";
import styles from "./Notice.css";
import PagingView from "../../components/common/PagingView";
import { AuthContext } from "../../AuthProvider";

import fileDownIcon from "../../images/fileDown.png";

function Notice({ searchResults }) {
  const [notices, setNotices] = useState([]);
  const [pagingInfo, setPagingInfo] = useState({
    currentPage: 1,
    maxPage: 1,
    startPage: 1,
    endPage: 1,
  });

  const [isSearchMode, setIsSearchMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { role } = useContext(AuthContext);
  const navigate = useNavigate();

  const fetchNotices = async (page) => {
    try {
      setLoading(true);
      const response = await apiClient.get(`/notice?page=${page}`);
      setNotices(response.data.list);
      setPagingInfo(response.data.paging);
      setIsSearchMode(false);
    } catch (err) {
      setError("공지사항을 불러오는 데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (searchResults) {
      setNotices(searchResults.list || []);
      setPagingInfo(searchResults.paging || {});
      setIsSearchMode(true);
      setLoading(false);
    } else {
      fetchNotices(1);
    }
  }, [searchResults]);

  const handlePageChange = async (page) => {
    try {
      setLoading(true);
      if (isSearchMode) {
        const response = await apiClient.get(`/notice/search/title`, {
          params: {
            action: searchResults.action,
            keyword: searchResults.keyword,
            page,
          },
        });
        setNotices(response.data.list || []);
        setPagingInfo(response.data.paging || {});
      } else {
        fetchNotices(page);
      }
    } catch (error) {
      setError("페이징 요청 실패!");
    } finally {
      setLoading(false);
    }
  };

  const handleListButtonClick = () => {
    setIsSearchMode(false);
    fetchNotices(1);
  };

  const handleTitleClick = (id) => {
    navigate(`/notice/${id}`);
  };

  const handleWriteClick = () => {
    navigate("/notice/new");
  };

  if (loading) {
    return <div className={styles.loading}>로딩 중...</div>;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  return (
    <div className="notice-container">
      <h1 className="notice-title">공지사항</h1>
      {role === "ADMIN" && <button onClick={handleWriteClick}>글쓰기</button>}
      <button onClick={handleListButtonClick}>목록</button>
      <table className={styles.noticeList}>
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
          {notices.map((notice) => (
            <tr key={notice.noticeNo} className={styles.noticeItem}>
              <td className={styles.noticeNo}>{notice.noticeNo}</td>
              <td className={styles.nTitle}>
                <span
                  style={{
                    color: "blue",
                    cursor: "pointer",
                    textDecoration: "underline",
                  }}
                  onClick={() => handleTitleClick(notice.noticeNo)}
                >
                  {notice.ntitle}
                </span>
              </td>
              <td className={styles.nWriter}>{notice.nwriter}</td>
              <td className={styles.ofileName}>
                {notice.ofileName ? <img src={fileDownIcon} style={{width: "20px", height: "20px",}} /> : ""}
              </td>
              <td className={styles.ncreatedAt}>{notice.ncreatedAt}</td>
              <td className={styles.nCount}>{notice.ncount}</td>
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

export default Notice;
