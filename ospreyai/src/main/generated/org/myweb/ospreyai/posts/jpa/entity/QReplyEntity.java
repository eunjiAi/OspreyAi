package org.myweb.ospreyai.posts.jpa.entity;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;


/**
 * QReplyEntity is a Querydsl query type for ReplyEntity
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QReplyEntity extends EntityPathBase<ReplyEntity> {

    private static final long serialVersionUID = 216652428L;

    public static final QReplyEntity replyEntity = new QReplyEntity("replyEntity");

    public final StringPath rcontent = createString("rcontent");

    public final DatePath<java.sql.Date> rdate = createDate("rdate", java.sql.Date.class);

    public final NumberPath<Integer> replyId = createNumber("replyId", Integer.class);

    public final NumberPath<Integer> replyRef = createNumber("replyRef", Integer.class);

    public final StringPath rnickname = createString("rnickname");

    public final StringPath rwriter = createString("rwriter");

    public QReplyEntity(String variable) {
        super(ReplyEntity.class, forVariable(variable));
    }

    public QReplyEntity(Path<? extends ReplyEntity> path) {
        super(path.getType(), path.getMetadata());
    }

    public QReplyEntity(PathMetadata metadata) {
        super(ReplyEntity.class, metadata);
    }

}

