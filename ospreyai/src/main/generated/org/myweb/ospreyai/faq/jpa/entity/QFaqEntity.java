package org.myweb.ospreyai.faq.jpa.entity;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;


/**
 * QFaqEntity is a Querydsl query type for FaqEntity
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QFaqEntity extends EntityPathBase<FaqEntity> {

    private static final long serialVersionUID = -1242116843L;

    public static final QFaqEntity faqEntity = new QFaqEntity("faqEntity");

    public final StringPath category = createString("category");

    public final DatePath<java.sql.Date> createdAt = createDate("createdAt", java.sql.Date.class);

    public final StringPath faqContent = createString("faqContent");

    public final NumberPath<Integer> faqId = createNumber("faqId", Integer.class);

    public final StringPath faqTitle = createString("faqTitle");

    public final StringPath faqWriter = createString("faqWriter");

    public final NumberPath<Integer> qnaId = createNumber("qnaId", Integer.class);

    public final NumberPath<Integer> viewCount = createNumber("viewCount", Integer.class);

    public QFaqEntity(String variable) {
        super(FaqEntity.class, forVariable(variable));
    }

    public QFaqEntity(Path<? extends FaqEntity> path) {
        super(path.getType(), path.getMetadata());
    }

    public QFaqEntity(PathMetadata metadata) {
        super(FaqEntity.class, metadata);
    }

}

