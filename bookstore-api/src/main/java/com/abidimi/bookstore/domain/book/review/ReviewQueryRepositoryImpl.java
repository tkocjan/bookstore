package com.abidimi.bookstore.domain.book.review;

import com.abidimi.bookstore.domain.book.review.permission.ReviewPermission;
import com.abidimi.bookstore.domain.order.Order;
import com.abidimi.bookstore.domain.order.OrderQueryRepository;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.Tuple;
import jakarta.persistence.criteria.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.jpa.domain.PredicateSpecification;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;

@RequiredArgsConstructor
@Repository
public class ReviewQueryRepositoryImpl implements ReviewQueryRepository
{
    @PersistenceContext
    private EntityManager em;

//    @Override
//    public List<Tuple> getReviewsForUser(Long userId) {
//        CriteriaBuilder cb = em.getCriteriaBuilder();
//        CriteriaQuery<Review> query = cb.createQuery(Review.class);
//
//        Root<Review> review = query.from(Review.class);
//        Root<ReviewPermission> permission = query.from(ReviewPermission.class);
//
//        Join<Review, ReviewPermission> permissionJoin = review.join(ReviewPermission.class, JoinType.LEFT);
//        permissionJoin.on(
//            cb.equal(permissionJoin.get("review").get("id"), review.get("id"))
//        );
//
//        List<Predicate> predicates = new ArrayList<>();
//
//        predicates.add(
//            cb.or(
//                cb.equal(review.get("globalViewPermitted"), true),
//                cb.equal(review.get("reviewerUser").get("id"), userId),
//                cb.equal(permission.get("permittedUser").get("id"), userId)
//            )
//        );
//
//        query.select(cb.tuple(review, permission))
//                .where(cb.and(predicates.toArray(new Predicate[0])));
//
//        query.orderBy(cb.asc(review.get("createdAt")));
//
//        return em.createQuery(query).getResultList();
//    }

    @Override
    public List<Object[]> getReviewsForUserAsArray(Long userId)
    {
        CriteriaBuilder cb = em.getCriteriaBuilder();
        CriteriaQuery<Object[]> query = cb.createQuery(Object[].class);
        Root<Review> review = query.from(Review.class);

        Join<Review, ReviewPermission> permission = review.join(ReviewPermission.class, JoinType.LEFT);
        permission.on(
            cb.and(
                    cb.equal(permission.get("review").get("id"), review.get("id")),
                    cb.equal(permission.get("permittedUser").get("id"), userId)
            )
        );

        Predicate predicate;
        if (userId == null) {
            predicate = cb.equal(review.get("globalViewPermitted"), true);
        } else {
            predicate = cb.or(
                cb.equal(review.get("globalViewPermitted"), true),
                cb.equal(review.get("reviewerUser").get("id"), userId),
                cb.equal(permission.get("permittedUser").get("id"), userId)
            );
        }

        query.select(cb.array(review, permission)).where(predicate);
        query.orderBy(cb.asc(review.get("createdAt")));
        List<Object[]> entityArrayList = em.createQuery(query).getResultList();

        // Example:
         Review r = (Review)entityArrayList.get(0)[0];
         ReviewPermission rp = (ReviewPermission)entityArrayList.get(0)[1];

        return entityArrayList;
    }

    @Override
    public List<Tuple> getReviewsForUserAsTuple(Long userId)
    {
        CriteriaBuilder cb = em.getCriteriaBuilder();
        CriteriaQuery<Tuple> query = cb.createTupleQuery();
        Root<Review> review = query.from(Review.class);

        Join<Review, ReviewPermission> permission = review.join(ReviewPermission.class, JoinType.LEFT);
        permission.on(
                cb.and(
                        cb.equal(permission.get("review").get("id"), review.get("id")),
                        cb.equal(permission.get("permittedUser").get("id"), userId)
                )
        );

        Predicate predicate;
        if (userId == null) {
            predicate = cb.equal(review.get("globalViewPermitted"), true);
        } else {
            predicate = cb.or(
                    cb.equal(review.get("globalViewPermitted"), true),
                    cb.equal(review.get("reviewerUser").get("id"), userId),
                    cb.equal(permission.get("permittedUser").get("id"), userId)
            );
        }

        query.select(cb.tuple(review, permission)).where(predicate);
        query.orderBy(cb.asc(review.get("createdAt")));
        List<Tuple> tuples = em.createQuery(query).getResultList();

        // Example:
        // Tuple firstTuple = tuples.get(0);
        // Review r = firstTuple.get(0, Review.class);
        // ReviewPermission rp = firstTuple.get(1, ReviewPermission.class);

        return tuples;
    }

}
