package org.myweb.ospreyai.notice.jpa.entity;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;


/**
 * QNoticeEntity is a Querydsl query type for NoticeEntity
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QNoticeEntity extends EntityPathBase<NoticeEntity> {

    private static final long serialVersionUID = -149782055L;

    public static final QNoticeEntity noticeEntity = new QNoticeEntity("noticeEntity");

    public final StringPath nContent = createString("nContent");

    public final NumberPath<Integer> nCount = createNumber("nCount", Integer.class);

    public final DatePath<java.sql.Date> nCreatedAt = createDate("nCreatedAt", java.sql.Date.class);

    public final NumberPath<Integer> noticeNo = createNumber("noticeNo", Integer.class);

    public final StringPath nTitle = createString("nTitle");

    public final DatePath<java.sql.Date> nUpdatedAt = createDate("nUpdatedAt", java.sql.Date.class);

    public final StringPath nWriter = createString("nWriter");

    public final StringPath ofileName = createString("ofileName");

    public final StringPath rfileName = createString("rfileName");

    public QNoticeEntity(String variable) {
        super(NoticeEntity.class, forVariable(variable));
    }

    public QNoticeEntity(Path<? extends NoticeEntity> path) {
        super(path.getType(), path.getMetadata());
    }

    public QNoticeEntity(PathMetadata metadata) {
        super(NoticeEntity.class, metadata);
    }

}

