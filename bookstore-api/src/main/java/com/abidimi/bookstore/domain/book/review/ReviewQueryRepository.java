package com.abidimi.bookstore.domain.book.review;

import jakarta.persistence.Tuple;

import java.util.List;

public interface ReviewQueryRepository
{
//    List<Tuple>  getReviewsForUser(Long userId);
    List<Tuple> getReviewsForUserAsTuple(Long userId);
    List<Object[]> getReviewsForUserAsArray(Long userId);
}
