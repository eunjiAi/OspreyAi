import React, { useEffect, useState, useContext } from "react";
import apiClient from "../../utils/axios";
import styles from "./MypageAdmin.css";
import { AuthContext } from "../../AuthProvider";

function MypageAdmin() {
  const { accessToken } = useContext(AuthContext);
  const [members, setMembers] = useState([]);
  const [paging, setPaging] = useState({ currentPage: 1, totalPages: 1 }); // 페이징 상태 추가
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        setLoading(true);

        // API 요청 시 페이지와 항목 수 포함
        const response = await apiClient.get("/member/admin/members", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          params: {
            page: paging.currentPage, // 현재 페이지
            limit: 10, // 한 페이지에 표시할 항목 수
          },
        });

        setMembers(response.data.list); // 회원 목록 설정
        setPaging(response.data.paging); // 페이징 정보 설정
      } catch (err) {
        console.error("Error fetching members:", err);
        setError("회원 목록을 불러오는데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, [accessToken, paging.currentPage]); // currentPage가 변경될 때 다시 요청

  // 페이지 변경 함수
  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > paging.totalPages) return; // 페이지 범위 검사
    setPaging((prev) => ({ ...prev, currentPage: newPage }));
  };

  if (loading) return <div className={styles.loading}>로딩 중...</div>;
  if (error) return <div className={styles.error}>{error}</div>;

  return (
    <div className="admin-page-container">
      <h1 className="admin-page-title">회원 관리</h1>
      <table className="members-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>이름</th>
            <th>이메일</th>
            <th>권한</th>
            <th>상태</th>
            <th>가입일</th>
          </tr>
        </thead>
        <tbody>
          {members.map((member) => (
            <tr key={member.id}>
              <td>{member.id}</td>
              <td>{member.name}</td>
              <td>{member.email}</td>
              <td>{member.role}</td>
              <td>{member.status}</td>
              <td>{member.createdAt}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* 페이징 UI */}
      <div className="pagination">
        <button
          onClick={() => handlePageChange(paging.currentPage - 1)}
          disabled={paging.currentPage === 1}
        >
          이전
        </button>
        <span>
          {paging.currentPage} / {paging.totalPages}
        </span>
        <button
          onClick={() => handlePageChange(paging.currentPage + 1)}
          disabled={paging.currentPage === paging.totalPages}
        >
          다음
        </button>
      </div>

      {/* 추가 기능은 주석 처리 */}
      {/* const handleRoleChange = async (id, newRole) => { ... } */}
      {/* const handleDelete = async (id) => { ... } */}
    </div>
  );
}

export default MypageAdmin;
