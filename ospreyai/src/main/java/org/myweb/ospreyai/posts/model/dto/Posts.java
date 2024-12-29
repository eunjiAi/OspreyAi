package org.myweb.ospreyai.posts.model.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.myweb.ospreyai.posts.jpa.entity.PostsEntity;

import java.sql.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Posts {
    @NotBlank
    private int postId;         //    POST_ID	NUMBER
    private String title;        //    TITLE	VARCHAR2(200 BYTE)
    private String content;     //    CONTENT	CLOB
    private String writer;      //    WRITER	VARCHAR2(30 BYTE)
    private String nickname;    //    NICKNAME	VARCHAR2(30 BYTE)
    private Date postDate;      //    POST_DATE	DATE
    private Date postUpdate;    //    POST_UPDATE	DATE
    private String fileName;    //    FILENAME	VARCHAR2(200 BYTE)
    private String renameFile;  //    RENAME_FILE	VARCHAR2(200 BYTE)
    private int postCount;      //    POST_COUNT	NUMBER

    public PostsEntity toEntity() {
        return PostsEntity.builder()
                .postId(postId)
                .title(title)
                .content(content)
                .writer(writer)
                .nickname(nickname)
                .postDate(postDate)
                .postUpdate(postUpdate)
                .fileName(fileName)
                .renameFile(renameFile)
                .postCount(postCount)
                .build();
    }
}
