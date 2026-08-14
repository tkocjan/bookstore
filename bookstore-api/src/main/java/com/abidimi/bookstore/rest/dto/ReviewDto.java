package com.abidimi.bookstore.rest.dto;

import com.abidimi.bookstore.domain.book.review.permission.ReviewPermission;
import com.abidimi.bookstore.domain.order.Order;
import jakarta.persistence.Column;

import java.time.Instant;

public record ReviewDto(
    Long id,
    String reviewHtml,
    boolean globalViewPermitted,
    Long reviewerUserId,
    ReviewPermissionDto reviewPermission
) {
    public ReviewDto(
        Long id,
        String reviewHtml,
        boolean globalViewPermitted,
        Long reviewerUserId,

        // ReviewPermissionDto
        Long reviewPermissionId,
        Long permittedUserId,
        boolean userViewPermitted,
        boolean userEditPermitted,
        boolean userDeletePermitted
    ) {
        ReviewPermissionDto reviewPermissionDto = reviewPermissionId == null
            ? null
            : new ReviewPermissionDto(
                reviewPermissionId,
                permittedUserId,
                userViewPermitted,
                userEditPermitted,
                userDeletePermitted
            );

        this(
            id,
            reviewHtml,
            globalViewPermitted,
            reviewerUserId,
            reviewPermissionDto
        );
    }

//public record ReviewDto(
//        Long id,
//        String reviewHtml,
//        Long reviewerUserId,
//        boolean globalViewPermitted,
//        Long permittedUserId,
//        boolean userViewPermitted,
//        boolean userEditPermitted,
//        boolean userDeletePermitted
//) {
//}
}