package com.abidimi.bookstore.domain.book.review;

import com.abidimi.bookstore.domain.book.review.permission.ReviewPermissionRepository;
import jakarta.persistence.Tuple;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@RequiredArgsConstructor
@Service
public class ReviewService
{
    private final ReviewRepository reviewRepository;
    private final ReviewPermissionRepository reviewPermissionRepository;


    public List<Tuple> getReviews(Long userId) {
        return reviewRepository.getReviewsForUserAsTuple(userId);
    }

    public List<Review> getReviewsSpec(Long userId) {
        return reviewRepository.findAll(Review.permittedReviewsAndPermission(userId));
    }

    // not working
//    public List<Tuple> getReviewsSpecAsTuple(Long userId, boolean isAdmin) {
//        return reviewPermissionRepository.findAll(Review.permittedReviewsAndPermission(userId));
//    }

    public Review validateAndGetReview(Long id) {
        return reviewRepository.findById(id)
            .orElseThrow(
                () -> new ReviewNotFoundException("Review with isbn %s not found".formatted(id))
            );
    }

    public Review saveReview(Review review) {
        return reviewRepository.saveAndFlush(review);
    }

    public List<Review> saveReviews(Iterable<Review> reviews) {
        return reviewRepository.saveAll(reviews);
//        return reviewRepository.saveAllAndFlush(reviews);
    }

    public void deleteReview(Review review) {
        reviewRepository.delete(review);
    }

    public long countReviews() {
        return reviewRepository.count();
    }
}
