package org.myweb.ospreyai.posts.jpa.entity;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;


/**
 * QPostsEntity is a Querydsl query type for PostsEntity
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QPostsEntity extends EntityPathBase<PostsEntity> {

    private static final long serialVersionUID = 745550005L;

    public static final QPostsEntity postsEntity = new QPostsEntity("postsEntity");

    public final StringPath content = createString("content");

    public final StringPath fileName = createString("fileName");

    public final StringPath nickname = createString("nickname");

    public final NumberPath<Integer> postCount = createNumber("postCount", Integer.class);

    public final DatePath<java.sql.Date> postDate = createDate("postDate", java.sql.Date.class);

    public final NumberPath<Integer> postId = createNumber("postId", Integer.class);

    public final DatePath<java.sql.Date> postUpdate = createDate("postUpdate", java.sql.Date.class);

    public final StringPath renameFile = createString("renameFile");

    public final StringPath title = createString("title");

    public final StringPath writer = createString("writer");

    public QPostsEntity(String variable) {
        super(PostsEntity.class, forVariable(variable));
    }

    public QPostsEntity(Path<? extends PostsEntity> path) {
        super(path.getType(), path.getMetadata());
    }

    public QPostsEntity(PathMetadata metadata) {
        super(PostsEntity.class, metadata);
    }

}

