import React, { useEffect, useState, useContext } from "react";
import apiClient from "../../utils/axios";
import styles from "./MypageAdmin.module.css"; // 모듈 파일 import
import PagingView from "../../components/common/PagingView"; // PagingView 컴포넌트 import
import { AuthContext } from "../../AuthProvider";

function MypageAdmin() {
  const { accessToken } = useContext(AuthContext);
  const [members, setMembers] = useState([]);
  const [pagingInfo, setPagingInfo] = useState({
    currentPage: 1,
    maxPage: 1,
    startPage: 1,
    endPage: 1,
  }); // 페이징 상태
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMembers = async (page) => {
    try {
      setLoading(true);
      const response = await apiClient.get(`/member/admin/members`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        params: { page },
      });

      setMembers(response.data.list);
      setPagingInfo(response.data.paging);
    } catch (err) {
      console.error("Error fetching members:", err);
      setError("회원 목록을 불러오는데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleLoginOkChange = async (uuid, loginOk) => {
    try {
      const response = await apiClient.put(
        `member/loginok/${uuid}/${loginOk}`,
        {}, // Request body는 비어 있음
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.status === 200) {
        alert("로그인 제한 상태가 변경되었습니다.");
        setMembers((prev) =>
          prev.map((member) =>
            member.uuid === uuid ? { ...member, loginOk } : member
          )
        );
      }
    } catch (err) {
      console.error("Error updating loginOk:", err);
      alert("로그인 제한 상태 변경에 실패했습니다.");
    }
  };

  useEffect(() => {
    fetchMembers(1);
  }, []);

  const handlePageChange = (page) => {
    fetchMembers(page);
  };

  if (loading) return <div className={styles.loading}>로딩 중...</div>;
  if (error) return <div className={styles.error}>{error}</div>;

  return (
    <div className={styles.adminPageContainer}>
      <h1 className={styles.adminPageTitle}>회원 관리</h1>
      <table className={styles.membersTable}>
        <thead>
          <tr>
            <th>ID</th>
            <th>이름</th>
            <th>이메일</th>
            <th>관리자 권한</th>
            <th>로그인 제한</th>
            <th>가입일</th>
          </tr>
        </thead>
        <tbody>
          {members.map((member) => (
            <tr key={member.memberId}>
              <td>{member.memberId}</td>
              <td>{member.name}</td>
              <td>{member.email}</td>
              <td>{member.adminYn}</td>
              <td>
                <select
                  value={member.loginOk}
                  onChange={(e) =>
                    handleLoginOkChange(member.uuid, e.target.value)
                  }
                >
                  <option value="Y">허용</option>
                  <option value="N">제한</option>
                </select>
              </td>
              <td>{member.enrollDate}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <PagingView
        currentPage={pagingInfo.currentPage || 1}
        maxPage={pagingInfo.maxPage || 1}
        startPage={pagingInfo.startPage || 1}
        endPage={pagingInfo.endPage || 1}
        onPageChange={(page) => handlePageChange(page)}
      />
    </div>
  );
}

export default MypageAdmin;
