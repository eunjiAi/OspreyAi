package org.myweb.ospreyai.faq.model.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.myweb.ospreyai.faq.jpa.entity.FaqEntity;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Faq {
    @NotBlank
    private int faqId;
    private String faqTitle;
    private String faqContent;
    private String faqQa;
    private String category;
    private int viewCount;
    private java.sql.Date createdAt;
    private int qnaId;
    private String faqWriter;

    public FaqEntity toEntity(){
        return FaqEntity.builder()
                .faqId(faqId)
                .faqTitle(faqTitle)
                .faqContent(faqContent)
                .faqQa(faqQa)
                .category(category)
                .viewCount(viewCount)
                .createdAt(createdAt)
                .qnaId(qnaId)
                .faqWriter(faqWriter)
                .build();
    }
}
