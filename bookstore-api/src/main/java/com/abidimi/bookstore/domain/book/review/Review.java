package com.abidimi.bookstore.domain.book.review;

import com.abidimi.bookstore.domain.book.Book;
import com.abidimi.bookstore.domain.book.review.permission.ReviewPermission;
import com.abidimi.bookstore.domain.user.User;
import com.abidimi.bookstore.rest.dto.ReviewDto;
import jakarta.persistence.*;
import jakarta.persistence.criteria.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import org.springframework.data.jpa.domain.Specification;

import java.time.Instant;

// https://thorben-janssen.com/spring-data-jpa-dto-native-queries/
@NamedNativeQueries({
    @NamedNativeQuery(name = "Review.findPagedDtosForUserNative",
        query = ReviewRepository.findPagedDtosForUserNative_Query,
        resultSetMapping = "Mapping.ReviewDto"
    ),
    @NamedNativeQuery(name = "Review.findPagedDtosForUserNative.count",
        query = ReviewRepository.findPagedDtosForUserNative_Count,
        resultSetMapping = "Mapping.ReviewDto.count"
    )
})
@SqlResultSetMappings({
    @SqlResultSetMapping(name = "Mapping.ReviewDto",
        classes = @ConstructorResult(
            targetClass = ReviewDto.class,
            columns = {
                @ColumnResult(name = "id", type = Long.class),
                @ColumnResult(name = "review_html", type = String.class),
                @ColumnResult(name = "global_view_permitted", type = Boolean.class),
                @ColumnResult(name = "reviewer_user_id", type = Long.class),

                // ReviewPermissionDto
                @ColumnResult(name = "review_permission_id", type = Long.class),
                @ColumnResult(name = "permitted_user_id", type = Long.class),
                @ColumnResult(name = "user_view_permitted", type = Boolean.class),
                @ColumnResult(name = "user_edit_permitted", type = Boolean.class),
                @ColumnResult(name = "user_delete_permitted", type = Boolean.class),
            }
        )
    ),
    @SqlResultSetMapping(
        name = "Mapping.ReviewDto.count",
        columns = @ColumnResult(name = "cnt", type = Long.class)
    )
})

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "reviews")
public class Review {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

//    @Lob
//    @Column(columnDefinition = "LONGTEXT")
    private String reviewHtml;


    @Column(nullable = false)
    private boolean globalViewPermitted;

    @ManyToOne()
    @JoinColumn(name = "isbn", nullable = false)
    Book book;

    @ManyToOne()
    @JoinColumn(nullable = false)
    private User reviewerUser;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private Instant createdAt;

    @UpdateTimestamp
    @Column(nullable = false)
    private Instant updatedAt;

    public Review(String reviewHtml, boolean globalViewPermitted, Book book, User ownerUser) {
        this.reviewHtml = reviewHtml;
        this.globalViewPermitted = globalViewPermitted;
        this.book = book;
        this.reviewerUser = ownerUser;
    }

    static Specification<Review> permittedReviewsAndPermission(Long userId) {
        return (review, query, cb) -> {
            Join<Review, ReviewPermission> permission = review.join(ReviewPermission.class, JoinType.LEFT);
            permission.on(
                cb.and(
                    cb.equal(permission.get("review").get("id"), review.get("id")),
                    cb.equal(permission.get("permittedUser").get("id"), userId)
                )
            );

            if (userId == null) {
                return cb.equal(review.get("globalViewPermitted"), true);
            }

            return cb.or(
                cb.equal(review.get("globalViewPermitted"), true),
                cb.equal(review.get("reviewerUser").get("id"), userId),
                cb.equal(permission.get("permittedUser").get("id"), userId)
            );
        };
    }

//    static Specification<Tuple> permittedReviewsAndPermissionTuple(Long userId, boolean isAdmin) {
//        return (review, query, cb) -> {
////        return (Root<Review> review, CriteriaQuery<Tuple> query, CriteriaBuilder cb) -> {
//            Join<Review, ReviewPermission> permission = review.join(ReviewPermission.class, JoinType.LEFT);
//            permission.on(
//                cb.equal(permission.get("review").get("id"), review.get("id"))
//            );
//
//            return cb.or(
//                cb.equal(review.get("globalViewPermitted"), true),
//                cb.equal(review.get("reviewerUser").get("id"), userId),
//                cb.equal(permission.get("permittedUser").get("id"), userId)
//            );
//        };
//    }

}
