package com.abidimi.bookstore.domain.order;

import java.util.List;

import static com.abidimi.bookstore.domain.order.Order.Specs.byText;
import static com.abidimi.bookstore.domain.order.Order.Specs.byUserId;

import com.abidimi.bookstore.domain.user.User;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service
public class OrderService {

    private final OrderRepository orderRepository;

    public List<Order> getOrders(Long userId, boolean isAdmin, String text) {
        Specification<Order> spec = Specification.unrestricted();

        if (!isAdmin) {
            spec = spec.and(byUserId(userId));
        }

        if (text != null && !text.isEmpty()) {
            spec = spec.and(byText(text));
        }

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
