package com.abidimi.bookstore.domain.order;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import lombok.RequiredArgsConstructor;
import org.springframework.data.jpa.domain.PredicateSpecification;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;

@RequiredArgsConstructor
@Repository
public class OrderQueryRepositoryImpl implements OrderQueryRepository
{
    @PersistenceContext
    private EntityManager em;

    @Override
    public List<Order> getOrders(Long userId, boolean isAdmin, String text) {
        CriteriaBuilder cb = em.getCriteriaBuilder();
        CriteriaQuery<Order> query = cb.createQuery(Order.class);
        Root<Order> order = query.from(Order.class);

        query.orderBy(cb.desc(order.get("createdAt")));

        List<Predicate> predicates = new ArrayList<>();

        if (!isAdmin) {
            predicates.add(cb.equal(order.get("user").get("id"), userId));
        }

        if (text != null && !text.isEmpty()) {
            String likeStr = "%" + text + "%";
            predicates.add(
                cb.or(
                    cb.like(order.get("id"), likeStr),
                    cb.like(order.get("description"), likeStr)
                )
            );
        }

        query.select(order).where(cb.and(predicates.toArray(new Predicate[0])));

        return em.createQuery(query).getResultList();
    }

    @Override
    public List<Order> getOrdersSpec(Long userId, boolean isAdmin, String text) {
        CriteriaBuilder cb = em.getCriteriaBuilder();
        CriteriaQuery<Order> query = cb.createQuery(Order.class);
        Root<Order> order = query.from(Order.class);

        Specification<Order> spec = Order.orderByCreatedAtDesc();

        if (!isAdmin) {
            spec = spec.and(Order.userIdEquals(userId));
        }

        if (text != null && !text.isEmpty()) {
            spec = spec.and(Order.idOrDescriptionLike(text));
        }

        query.where(spec.toPredicate(order, query, cb));

        return em.createQuery(query).getResultList();
    }

    @Override
    public List<Order> getOrdersPredSpec(Long userId, boolean isAdmin, String text) {
        CriteriaBuilder cb = em.getCriteriaBuilder();
        CriteriaQuery<Order> query = cb.createQuery(Order.class);
        Root<Order> order = query.from(Order.class);

        query.orderBy(cb.desc(order.get("createdAt")));

        PredicateSpecification<Order> predSpec = PredicateSpecification.unrestricted();

        predSpec = predSpec.and(Order.ifUserNotAdminThenUserIdEquals(userId, isAdmin));

        predSpec = predSpec.and(Order.ifTextNotEmptyThenIdOrDescriptionLike(text));

        Specification<Order> spec = Specification.where(predSpec);

        query.where(spec.toPredicate(order, query, cb));

        return em.createQuery(query).getResultList();
    }
}
