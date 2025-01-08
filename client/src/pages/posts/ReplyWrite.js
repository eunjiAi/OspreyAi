// src/pages/reply/ReplyWrite.js
import React, { useState, useContext } from "react";
import apiClient from "../../utils/axios";
import { AuthContext } from "../../AuthProvider";
import styles from './ReplyWrite.module.css';

const ReplyWrite = ({ postId, onReplyAdded }) => {
    const { userid, accessToken } = useContext(AuthContext);  // AuthProvider 에서 가져오기
    const [rcontent, setrcontent] = useState('');

    console.log('postId', postId);
    const handleSubmit = async (e) => {
        e.preventDefault();   //발생한 submit 이벤트 취소시킴

        console.log('postId', postId);
        try{
            const formData = new FormData();
            formData.append('replyRef', postId);  //항상 전달받음, 참조원글번호
            

            formData.append('rwriter', userid);
            formData.append('rcontent', rcontent);

            await apiClient.post('/reply', formData, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'multipart/form-data',
                }
            });

            alert('댓글이 등록되었습니다.');
            setrcontent('');
            //모달 닫기
            if(onReplyAdded) onReplyAdded();
        }catch(error){
            console.error('댓글 등록 실패 : ', error);
            alert('댓글 등록에 실패했습니다.');
        }
    };

    return (
        <form className={styles.replyForm} onSubmit={handleSubmit}>
            <div>
                <label>작성자 : </label>
                <input type="text" value={userid} readOnly className={styles.readOnlyInput} />
            </div>
            <div>
                <label>내용 : </label>
                <textarea value={rcontent} 
                    onChange={(e) => setrcontent(e.target.value)}
                    rows="4"
                    placeholder="내용을 입력하세요."
                    required></textarea>
            </div>
            <button type="submit" className={styles.submitButton}>등록</button>
        </form>
    );
};

export default ReplyWrite;