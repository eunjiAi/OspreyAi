package org.myweb.ospreyai.squatfeedback.jpa.entity;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;


/**
 * QSquatFeedback is a Querydsl query type for SquatFeedback
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QSquatFeedback extends EntityPathBase<SquatFeedback> {

    private static final long serialVersionUID = -1181140270L;

    public static final QSquatFeedback squatFeedback = new QSquatFeedback("squatFeedback");

    public final NumberPath<Integer> correctCount = createNumber("correctCount", Integer.class);

    public final DateTimePath<java.util.Date> squatDate = createDateTime("squatDate", java.util.Date.class);

    public final NumberPath<Long> squatId = createNumber("squatId", Long.class);

    public final NumberPath<Integer> totalAttempts = createNumber("totalAttempts", Integer.class);

    public final StringPath uuid = createString("uuid");

    public QSquatFeedback(String variable) {
        super(SquatFeedback.class, forVariable(variable));
    }

    public QSquatFeedback(Path<? extends SquatFeedback> path) {
        super(path.getType(), path.getMetadata());
    }

    public QSquatFeedback(PathMetadata metadata) {
        super(SquatFeedback.class, metadata);
    }

}

