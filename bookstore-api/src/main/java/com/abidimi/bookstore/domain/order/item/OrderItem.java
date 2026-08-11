package com.abidimi.bookstore.domain.order.item;

import com.abidimi.bookstore.domain.book.Book;
import com.abidimi.bookstore.domain.order.Order;
import jakarta.persistence.*;
import jakarta.persistence.criteria.Predicate;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import org.springframework.data.jpa.domain.Specification;

import java.time.Instant;
import java.util.UUID;

@Data
@NoArgsConstructor
@Entity
@Table(name = "orders_items")
public class OrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne()
    @JoinColumn(name = "order_uuid", nullable = false)
    private Order order;

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

    interface Specs {
        static Specification<OrderItem> byUserId(Long userId) {
            return (order, query, cb) ->
                    cb.equal(order.get("user").get("id"), userId);
        }

        static Specification<OrderItem> byText(String text) {
            return (order, query, cb) -> {
                String likeStr = "%"+text+"%";
                return cb.or(
                        cb.like(order.get("id"), likeStr),
                        cb.like(order.get("description"), likeStr)
                );
            };
        }

        static Specification<OrderItem> orderByCreatedAtDesc() {
            return (order, query, cb) -> {
                Predicate predicate = cb.conjunction();  // 1=1
                query.orderBy(cb.desc(order.get("createdAt"))) ;

                return predicate;
            };
        }
    }
}
