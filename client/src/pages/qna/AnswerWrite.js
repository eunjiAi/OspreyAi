// src/pages/reply/ReplyWrite.js
import React, { useState, useContext } from "react";
import apiClient from "../../utils/axios";
import { AuthContext } from "../../AuthProvider";
import styles from './AnswerWrite.module.css';

const AnswerWrite = ({ qno, onAnswerAdded }) => {
    const { userid, accessToken } = useContext(AuthContext);  // AuthProvider 에서 가져오기
    const [aTitle, setATitle] = useState('');
    const [aContent, setAContent] = useState('');

    console.log('qno', qno);
    const handleSubmit = async (e) => {
        e.preventDefault();   //발생한 submit 이벤트 취소시킴

        console.log('qno', qno);
        try{
            const formData = new FormData();
            formData.append('answerRef', qno);  //항상 전달받음, 참조원글번호
            

            formData.append('aWriter', userid);
            formData.append('aTitle', aTitle);
            formData.append('aContent', aContent);

            await apiClient.post('/answer', formData, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'multipart/form-data',
                }
            });

            alert('답변이 등록되었습니다.');
            setATitle('');
            setAContent('');
            //모달 닫기
            if(onAnswerAdded) onAnswerAdded();
        }catch(error){
            console.error('답변 등록 실패 : ', error);
            // alert('답변 등록에 실패했습니다.');
        }
    };

    return (
        <form className={styles.answerForm} onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label>작성자:</label>
            <input
              type="text"
              value={userid}
              readOnly
              className={styles.readOnlyInput}
            />
          </div>
          <div className={styles.formGroup}>
            <label>제목:</label>
            <input
              type="text"
              value={aTitle}
              onChange={(e) => {
                // 첫 번째 공백이 있는지 확인
                let updatedValue = e.target.value;

                // 첫 번째 공백을 제거
                if (updatedValue.startsWith(' ') || updatedValue.startsWith('\n')) {
                  updatedValue = updatedValue.trimStart(); // 첫 번째 공백 제거
                }

                setATitle(updatedValue);
              }}
              placeholder="제목을 입력하세요."
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label>내용:</label>
            <textarea
              value={aContent}
              onChange={(e) => {
                // 첫 번째 공백이 있는지 확인
                let updatedValue = e.target.value;

                // 첫 번째 공백을 제거
                if (updatedValue.startsWith(' ') || updatedValue.startsWith('\n')) {
                  updatedValue = updatedValue.trimStart(); // 첫 번째 공백 제거
                }

                setAContent(updatedValue);
              }}
              rows="6"
              placeholder="내용을 입력하세요."
              required
            />
          </div>
          <div className={styles.formActions}>
            <button type="submit" className={styles.submitButton}>
              등록
            </button>
          </div>
        </form>
      );
      
};

export default AnswerWrite;