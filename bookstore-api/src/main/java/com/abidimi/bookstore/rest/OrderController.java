package com.abidimi.bookstore.rest;

import static com.abidimi.bookstore.config.SwaggerConfig.BEARER_KEY_SECURITY_SCHEME;

import com.abidimi.bookstore.domain.order.Order;
import com.abidimi.bookstore.domain.order.OrderService;
import com.abidimi.bookstore.rest.dto.CreateOrderRequest;
import com.abidimi.bookstore.rest.dto.OrderDto;
import com.abidimi.bookstore.security.CustomUserDetails;
import com.abidimi.bookstore.domain.user.User;
import com.abidimi.bookstore.domain.user.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;

import java.util.List;
import java.util.UUID;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final UserService userService;
    private final OrderService orderService;

    @Operation(security = {@SecurityRequirement(name = BEARER_KEY_SECURITY_SCHEME)})
    @GetMapping
    public List<OrderDto> getOrders(
        @AuthenticationPrincipal CustomUserDetails currentUser,
        @RequestParam(value = "text", required = false) String text
    ) {
        List<Order> orders = (text == null)
            ? orderService.getOrders()
            : orderService.getOrdersContainingText(text);

        return orders.stream().map(OrderDto::from).toList();
    }

    @Operation(security = {@SecurityRequirement(name = BEARER_KEY_SECURITY_SCHEME)})
    @ResponseStatus(HttpStatus.CREATED)
    @PostMapping
    public OrderDto createOrder(
        @AuthenticationPrincipal CustomUserDetails currentUser,
        @Valid @RequestBody CreateOrderRequest createOrderRequest
    ) {
        User user = userService.validateAndGetUserByUsername(currentUser.getUsername());
        Order order = createOrderRequest.toDomain();
        order.setUser(user);

        return OrderDto.from(orderService.saveOrder(order));
    }

    @Operation(security = {@SecurityRequirement(name = BEARER_KEY_SECURITY_SCHEME)})
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @DeleteMapping("/{id}")
    public void deleteOrder(@PathVariable UUID id) {
        Order order = orderService.validateAndGetOrder(id.toString());

        orderService.deleteOrder(order);
    }
}
