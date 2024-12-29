package org.myweb.ospreyai.posts.jpa.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.myweb.ospreyai.posts.model.dto.Posts;

import java.sql.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Table(name = "POSTS")
@Entity
public class PostsEntity {
    @Id
    @Column(name = "POST_ID", nullable = false)
    private int postId;         //    POST_ID	NUMBER
    @Column(name = "TITLE", nullable = false)
    private String title;        //    TITLE	VARCHAR2(200 BYTE)
    @Column(name = "CONTENT", nullable = false)
    private String content;     //    CONTENT	CLOB
    @Column(name = "WRITER", nullable = false)
    private String writer;      //    WRITER	VARCHAR2(30 BYTE)
    @Column(name = "POST_DATE")
    private Date postDate;      //    POST_DATE	DATE
    @Column(name = "POST_UPDATE")
    private Date postUpdate;    //    POST_UPDATE	DATE
    @Column(name = "FILENAME")
    private String fileName;    //    FILENAME	VARCHAR2(200 BYTE)
    @Column(name = "RENAME_FILE")
    private String renameFile;  //    RENAME_FILE	VARCHAR2(200 BYTE)
    @Column(name = "POST_COUNT")
    private int postCount;      //    POST_COUNT	NUMBER


    @PrePersist
    public void prePersist() {
        postDate = new Date(System.currentTimeMillis());
    }

    public Posts toDto() {
        return Posts.builder()
                .postId(postId)
                .title(title)
                .content(content)
                .writer(writer)
                .postDate(postDate)
                .postUpdate(postUpdate)
                .fileName(fileName != null && !fileName.isEmpty() ? fileName : "")
                .renameFile(renameFile != null && !renameFile.isEmpty() ? renameFile : "")
                .postCount(postCount)
                .build();
    }
}