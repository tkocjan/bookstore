package com.abidimi.bookstore.domain.book.review;

import com.abidimi.bookstore.rest.dto.ReviewDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Long>, JpaSpecificationExecutor<Review>, ReviewQueryRepository
{
//    @Query(value = findAllDtosForUser_Query, countQuery = findAllDtosForUser_Count)
//    Page<ReviewDto> findAllDtosForUser(
//        @Param("userId") Long userId,
//        Pageable page
//    );

//    List<Review> getAllReviews(
//            @Param("userId") Long userId,
//            boolean isAdmin
//    );

    Page<ReviewDto> findAllDtosForUserNative(
        @Param("userId") Long userId,
        Pageable page
    );

    String findAllDtosForUser_Body =
        """

        FROM Review r
        LEFT JOIN ReviewPermission rp
            ON      rp.review.id = r.id
                AND rp.permittedUser.id = :userId
        WHERE
            (       :userId IS NULL
                AND r.globalViewPermitted = true
            ) OR (
                    :userId IS NOT NULL
                AND (
                       r.globalViewPermitted = true
                    OR r.reviewerUser.id = :userId
                    OR rp.permittedUser.id = :userId
                )
            )
        """;
    String findAllDtosForUser_Count = "SELECT COUNT(*)" + findAllDtosForUser_Body;
    String findAllDtosForUser_Query =
        """
        SELECT NEW com.abidimi.bookstore.rest.dto.ReviewDto(
            r.id,
            r.reviewHtml,
            r.reviewerUser.id,
            r.globalViewPermitted,
            NEW com.abidimi.bookstore.rest.dto.ReviewPermissionDto(
                rp.id,
                rp.permittedUser.id,
                IFNULL(rp.userViewPermitted, false),
                IFNULL(rp.userEditPermitted, false),
                IFNULL(rp.userDeletePermitted, false)
            )
        )
        """ + findAllDtosForUser_Body;

    String findAllDtosForUserNative_Body =
        """

        FROM reviews r
        LEFT JOIN reviews_permissions rp
            ON      rp.review_id = r.id
                AND rp.permitted_user_id = :userId
        WHERE
            (       CAST(:userId AS BIGINT) IS NULL
                AND r.global_view_permitted = true
            ) OR (
                    CAST(:userId AS BIGINT) IS NOT NULL
                AND (
                       r.global_view_permitted = true
                    OR r.reviewer_user_id = :userId
                    OR rp.permitted_user_id = :userId
                )
            )
        """;
    String findAllDtosForUserNative_Count = "SELECT COUNT(*) as cnt" + findAllDtosForUserNative_Body;
    String findAllDtosForUserNative_Query =
        """
        SELECT
            r.id,
            r.review_html,
            r.global_view_permitted,
            r.reviewer_user_id,
            rp.permitted_user_id,
            COALESCE(rp.user_view_permitted, false) as user_view_permitted,
            COALESCE(rp.user_edit_permitted, false) as user_edit_permitted,
            COALESCE(rp.user_delete_permitted, false) as user_delete_permitted
        """ + findAllDtosForUserNative_Body;
}
