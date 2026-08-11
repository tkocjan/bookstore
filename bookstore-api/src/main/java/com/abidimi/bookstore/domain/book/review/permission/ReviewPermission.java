package com.abidimi.bookstore.domain.book.review.permission;

import com.abidimi.bookstore.domain.book.review.Review;
import com.abidimi.bookstore.domain.user.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.Instant;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "reviews_permissions")
public class ReviewPermission {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne()
    @JoinColumn(nullable = false)
    Review review;

    @ManyToOne()
    @JoinColumn(nullable = false)
    private User permittedUser;

    @Column(nullable = false)
    private boolean userViewPermitted = true;

    @Column(nullable = false)
    private boolean userEditPermitted = false;

    @Column(nullable = false)
    private boolean userDeletePermitted;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private Instant createdAt;

    @UpdateTimestamp
    @Column(nullable = false)
    private Instant updatedAt;

    public ReviewPermission(Review review, User permittedUser, boolean userViewPermitted, boolean userEditPermitted, boolean userDeletePermitted) {
        this.review = review;
        this.permittedUser = permittedUser;
        this.userViewPermitted = userViewPermitted;
        this.userEditPermitted = userEditPermitted;
        this.userDeletePermitted = userDeletePermitted;
    }
}
