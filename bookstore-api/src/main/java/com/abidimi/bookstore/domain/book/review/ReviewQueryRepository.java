package com.abidimi.bookstore.domain.book.review;

import jakarta.persistence.Tuple;

import java.util.List;

public interface ReviewQueryRepository
{
    List<Review>  getReviewsForUser(Long userId);
    List<Tuple> getReviewsForUserAsTuple(Long userId);
    List<Object[]> getReviewsForUserAsArray(Long userId);
}
