package org.myweb.ospreyai.qna.jpa.entity;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;


/**
 * QQuestionEntity is a Querydsl query type for QuestionEntity
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QQuestionEntity extends EntityPathBase<QuestionEntity> {

    private static final long serialVersionUID = -355680325L;

    public static final QQuestionEntity questionEntity = new QQuestionEntity("questionEntity");

    public final StringPath answerYn = createString("answerYn");

    public final StringPath qcontent = createString("qcontent");

    public final DatePath<java.sql.Date> qdate = createDate("qdate", java.sql.Date.class);

    public final NumberPath<Integer> qno = createNumber("qno", Integer.class);

    public final StringPath qtitle = createString("qtitle");

    public final StringPath qwriter = createString("qwriter");

    public QQuestionEntity(String variable) {
        super(QuestionEntity.class, forVariable(variable));
    }

    public QQuestionEntity(Path<? extends QuestionEntity> path) {
        super(path.getType(), path.getMetadata());
    }

    public QQuestionEntity(PathMetadata metadata) {
        super(QuestionEntity.class, metadata);
    }

}

