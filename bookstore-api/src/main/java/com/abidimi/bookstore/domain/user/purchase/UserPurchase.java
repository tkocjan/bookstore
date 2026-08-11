package com.abidimi.bookstore.domain.user.purchase;

import com.abidimi.bookstore.domain.book.Book;
import com.abidimi.bookstore.domain.order.Order;
import com.abidimi.bookstore.domain.user.User;
import com.abidimi.bookstore.security.Role;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@Entity
@Table(name = "users_purchases")
public class UserPurchase {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne()
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne()
    @JoinColumn(name = "isbn", nullable = false)
    Book book;

    @Column(nullable = false)
    @JoinColumn(nullable = false)
    private Integer itemCount;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private Instant createdAt;

    @UpdateTimestamp
    @Column(nullable = false)
    private Instant updatedAt;
}
