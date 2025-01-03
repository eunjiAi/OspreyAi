package org.myweb.ospreyai.qna.jpa.entity;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;


/**
 * QAnswerEntity is a Querydsl query type for AnswerEntity
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QAnswerEntity extends EntityPathBase<AnswerEntity> {

    private static final long serialVersionUID = -1617007085L;

    public static final QAnswerEntity answerEntity = new QAnswerEntity("answerEntity");

    public final StringPath aContent = createString("aContent");

    public final DatePath<java.sql.Date> aDate = createDate("aDate", java.sql.Date.class);

    public final NumberPath<Integer> ano = createNumber("ano", Integer.class);

    public final NumberPath<Integer> answerRef = createNumber("answerRef", Integer.class);

    public final StringPath aTitle = createString("aTitle");

    public final StringPath aWriter = createString("aWriter");

    public QAnswerEntity(String variable) {
        super(AnswerEntity.class, forVariable(variable));
    }

    public QAnswerEntity(Path<? extends AnswerEntity> path) {
        super(path.getType(), path.getMetadata());
    }

    public QAnswerEntity(PathMetadata metadata) {
        super(AnswerEntity.class, metadata);
    }

}

