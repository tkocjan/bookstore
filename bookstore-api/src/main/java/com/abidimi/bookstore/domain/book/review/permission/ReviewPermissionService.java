package com.abidimi.bookstore.domain.book.review.permission;

import com.abidimi.bookstore.domain.book.review.Review;
import com.abidimi.bookstore.domain.book.review.ReviewNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@RequiredArgsConstructor
@Service
public class ReviewPermissionService
{
    private final ReviewPermissionRepository reviewPermissionRepository;

    public List<Review> getReviewPermissions() {
        return null;
    }

    public ReviewPermission validateAndGetReviewPermission(Long id) {
        return reviewPermissionRepository.findById(id)
            .orElseThrow(
                () -> new ReviewPermissionNotFoundException("Review with isbn %s not found".formatted(id))
            );
    }

    public ReviewPermission saveReviewPermission(ReviewPermission reviewPermission) {
        return reviewPermissionRepository.save(reviewPermission);
    }

    public List<ReviewPermission> saveReviewPermissions(Iterable<ReviewPermission> reviewPermissions) {
        return reviewPermissionRepository.saveAll(reviewPermissions);
//        return reviewPermissionRepository.saveAllAndFlush(reviewPermissions);
    }

    public void deleteReviewPermission(ReviewPermission reviewPermission) {
        reviewPermissionRepository.delete(reviewPermission);
    }

    public long countReviewPermissions() {
        return reviewPermissionRepository.count();
    }
}
