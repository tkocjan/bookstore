package com.abidimi.orderapi.domain.order;

import com.abidimi.orderapi.domain.book.Book;
import com.abidimi.orderapi.domain.user.User;
import jakarta.persistence.*;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@Entity
@Table(name = "orders")
public class Order {

    @Id
    private String id;

    @Column(nullable = false)
    private String description;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(name = "orders_books",
        joinColumns = @JoinColumn(name = "order_id"),
        inverseJoinColumns = @JoinColumn(name = "isbn"))
    List<Book> books;

    @Column(nullable = false, updatable = false)
    private Instant createdAt;

    public Order(String description) {
        this.description = description;
    }

    @PrePersist
    public void onPrePersist() {
        if (id == null) id = UUID.randomUUID().toString();
        if (createdAt == null) createdAt = Instant.now();
    }
}
