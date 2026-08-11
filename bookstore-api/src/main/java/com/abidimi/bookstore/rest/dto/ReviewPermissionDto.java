package com.abidimi.bookstore.rest.dto;

public record ReviewPermissionDto(
        Long id,
        Long permittedUserId,
        boolean userViewPermitted,
        boolean userEditPermitted,
        boolean userDeletePermitted
) {
}
