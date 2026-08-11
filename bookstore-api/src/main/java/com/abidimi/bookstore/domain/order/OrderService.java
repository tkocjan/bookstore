package com.abidimi.bookstore.domain.order;

import java.util.List;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.PredicateSpecification;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service
public class OrderService {

    private final OrderRepository orderRepository;

    public List<Order> getOrders(Long userId, boolean isAdmin, String text) {
        return orderRepository.getOrdersPredSpec(userId, isAdmin, text);
    }

    public List<Order> getOrdersSpec(Long userId, boolean isAdmin, String text) {
//        Specification<Order> spec = Order.orderByCreatedAtDesc();
        Specification<Order> spec = Specification.unrestricted();

        if (!isAdmin) {
            spec = spec.and(Order.userIdEquals(userId));
//            spec = spec.and((order, query, cb) ->
//                cb.equal(order.get("user").get("id"), userId)
//            );
        }

        if (text != null && !text.isEmpty()) {
            spec = spec.and(Order.idOrDescriptionLike(text));
        }

        return orderRepository.findAll(spec, Sort.by("createdAt").descending());
//        return orderRepository.findAll(spec);
    }

    public List<Order> getOrdersPredSpec(Long userId, boolean isAdmin, String text) {
        PredicateSpecification<Order> predSpec = PredicateSpecification.unrestricted();

        predSpec = predSpec.and(Order.ifUserNotAdminThenUserIdEquals(userId, isAdmin));

        predSpec = predSpec.and(Order.ifTextNotEmptyThenIdOrDescriptionLike(text));

        // no Pageable or Sort
        Specification<Order> spec = Specification.where(predSpec);

        return orderRepository.findAll(spec, Sort.by("createdAt").descending());
    }

    public long countOrders() {
        return orderRepository.count();
    }

    public Order validateAndGetOrder(String id) {
        return orderRepository
            .findById(id)
            .orElseThrow(() -> new OrderNotFoundException("Order with id %s not found".formatted(id)));
    }

    public Order saveOrder(Order order) {
        return orderRepository.save(order);
    }

    public void deleteOrder(Order order) {
        orderRepository.delete(order);
    }
}
