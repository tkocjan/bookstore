package com.abidimi.bookstore.domain.order;

import com.abidimi.bookstore.domain.user.User;
import jakarta.persistence.*;

import java.time.Instant;
import java.util.UUID;

import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.From;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import org.springframework.data.jpa.domain.PredicateSpecification;
import org.springframework.data.jpa.domain.Specification;

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
//    @JoinColumn(nullable = false)
    @JoinColumn(nullable = false)
    private User user;

//    @ManyToMany(fetch = FetchType.LAZY)
//    @JoinTable(name = "orders_books",
//        joinColumns = @JoinColumn(name = "order_id"),
//        inverseJoinColumns = @JoinColumn(name = "isbn"))
//    List<Book> books;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private Instant createdAt;

    @UpdateTimestamp
    @Column(nullable = false)
    private Instant updatedAt;

    public Order(String description) {
        this.description = description;
    }

    @PrePersist
    public void onPrePersist() {
        if (id == null) id = UUID.randomUUID().toString();
    }

    static Specification<Order> userIdEquals(Long userId) {
        return (order, query, cb) ->
            cb.equal(order.get("user").get("id"), userId);
    }

    static Specification<Order> idOrDescriptionLike(String text) {
        return (order, query, cb) -> {
            String likeStr = "%"+text+"%";
            return cb.or(
                cb.like(order.get("id"), likeStr),
                cb.like(order.get("description"), likeStr)
            );
        };
    }

    static Specification<Order> orderByCreatedAtDesc() {
        return (order, query, cb) -> {
            query.orderBy(cb.desc(order.get("createdAt")));

            return cb.conjunction();
        };
    }

    static PredicateSpecification<Order> ifUserNotAdminThenUserIdEquals(Long userId, boolean isAdmin) {
        return (From<?, Order> order, CriteriaBuilder cb) -> {
            if (isAdmin) return null;

            return cb.equal(order.get("user").get("id"), userId);
        };
    }

    static PredicateSpecification<Order> ifTextNotEmptyThenIdOrDescriptionLike(String text) {
        return (From<?, Order> order, CriteriaBuilder cb) -> {
            if (text == null || text.isEmpty()) return null;

            String likeStr = "%" + text + "%";
            return cb.or(
                    cb.like(order.get("id"), likeStr),
                    cb.like(order.get("description"), likeStr)
            );
        };
    }
}
