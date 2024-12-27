package org.myweb.ospreyai.faq.jpa.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.myweb.ospreyai.faq.model.dto.Faq;

import java.sql.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Table(name = "FAQ")
@Entity
public class FaqEntity {
    @Id
    @Column(name = "FAQ_ID", nullable = false)
    private int faqId;
    @Column(name = "FAQ_TITLE", nullable = false)
    private String faqTitle;
    @Column(name = "FAQ_CONTENT", nullable = false)
    private String faqContent;
    @Column(name = "CATEGORY", nullable = false)
    private String category;
    @Column(name = "VIEW_COUNT", nullable = false, columnDefinition = "0")
    private int viewCount;
    @Column(name = "CREATED_AT",nullable = false)
    private Date createdAt;
    @Column(name = "QNA_ID")
    private int qnaId;
    @Column(name = "FAQ_WRITER", nullable = false)
    private String faqWriter;

    @PrePersist
    protected void prePersist() {
        createdAt = new Date(System.currentTimeMillis());
    }

    public Faq toDto(){
        return Faq.builder()
                .faqId(faqId)
                .faqTitle(faqTitle)
                .faqContent(faqContent)
                .category(category)
                .viewCount(viewCount)
                .createdAt(createdAt)
                .qnaId(qnaId)
                .faqWriter(faqWriter)
                .build();
    }
}
