package com.abidimi.bookstore.domain.book.review.permission;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.NOT_FOUND)
public class ReviewPermissionNotFoundException extends RuntimeException {

  public ReviewPermissionNotFoundException(String message) {
    super(message);
  }
}
