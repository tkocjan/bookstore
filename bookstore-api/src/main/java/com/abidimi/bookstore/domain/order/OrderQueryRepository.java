package com.abidimi.bookstore.domain.order;

import java.util.List;

public interface OrderQueryRepository
{
    List<Order> getOrders(Long userId, boolean isAdmin, String text);
    List<Order> getOrdersSpec(Long userId, boolean isAdmin, String text);
    List<Order> getOrdersPredSpec(Long userId, boolean isAdmin, String text);
}
