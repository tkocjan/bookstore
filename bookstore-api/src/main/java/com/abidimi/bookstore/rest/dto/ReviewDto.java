package com.abidimi.bookstore.rest.dto;

import com.abidimi.bookstore.domain.order.Order;
import jakarta.persistence.Column;

import java.time.Instant;

public record ReviewDto(
    Long id,
    String reviewHtml,
    Long reviewerUserId,
    boolean globalViewPermitted
//    ReviewPermissionDto reviewPermission
) {
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
