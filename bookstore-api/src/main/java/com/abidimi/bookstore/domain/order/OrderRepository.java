package com.abidimi.bookstore.domain.order;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderRepository extends JpaRepository<Order, String> {

    List<Order> findAllByOrderByCreatedAtDesc();

    List<Order> findAllByUserIdOrderByCreatedAtDesc(Long userId);

    List<Order> findByIdContainingOrDescriptionContainingIgnoreCaseOrderByCreatedAt(
            String orderId,
            String description
    );

    List<Order> findByUserIdAndIdContainingOrUserIdAndDescriptionContainingIgnoreCaseOrderByCreatedAt(
            Long userId,
            String orderId,
            Long sameUserId,
            String description
    );
}
