package com.abidimi.bookstore.rest;

import static com.abidimi.bookstore.config.SwaggerConfig.BEARER_KEY_SECURITY_SCHEME;

import com.abidimi.bookstore.domain.book.review.ReviewRepository;
import com.abidimi.bookstore.domain.book.review.ReviewService;
import com.abidimi.bookstore.domain.order.Order;
import com.abidimi.bookstore.domain.order.OrderService;
import com.abidimi.bookstore.rest.dto.CreateOrderRequest;
import com.abidimi.bookstore.rest.dto.OrderDto;
import com.abidimi.bookstore.rest.dto.ReviewDto;
import com.abidimi.bookstore.security.CustomUserDetails;
import com.abidimi.bookstore.domain.user.User;
import com.abidimi.bookstore.domain.user.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;

import java.util.List;
import java.util.UUID;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RequiredArgsConstructor
@RestController
//@RequestMapping("/api/orders")
public class OrderController {

    private final UserService userService;
    private final OrderService orderService;

    private final ReviewService reviewService;
    private final ReviewRepository reviewRepository;

    @GetMapping("/api/orders")
    @PreAuthorize("hasAuthority('USER') or hasAuthority('ADMIN')")
//    @PreAuthorize("hasAnyAuthority({'USER', 'ADMIN'})")
    @Operation(security = {@SecurityRequirement(name = BEARER_KEY_SECURITY_SCHEME)})
    public List<OrderDto> getOrders(
        @AuthenticationPrincipal CustomUserDetails currentUser,
        @RequestParam(value = "text", required = false) String text
    ) {
        Pageable pageable = PageRequest.of(0, 2, Sort.by("id"));
//        List<Tuple> tuple = reviewService.getReviews(
//        List<Review> reviews = reviewService.getReviewsSpec(
//        List<Tuple> reviews = reviewService.getReviewsSpecAsTuple(    // not working
//        List<Tuple> tuple = reviewRepository.getReviewsForUserAsTuple(
//        List<Object[]> objectArrayList = reviewRepository.getReviewsForUserAsArray(
//        List<Review> review = reviewRepository.getAllReviews(
//        List<ReviewDto> dtos = reviewRepository.getAllDtosForUser(
//        Page<ReviewDto> dtos = reviewRepository.findAllDtosForUser(
        Page<ReviewDto> dtos = reviewRepository.findAllDtosForUserNative(
            currentUser.getId(),
            pageable
        );

        List<Order> orders = orderService.getOrdersSpec(
            currentUser.getId(),
            currentUser.isAdmin(),
            text
        );

        return orders.stream().map(OrderDto::from).toList();
    }

    @PostMapping("/api/orders")
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("isAuthenticated()")
    @Operation(security = {@SecurityRequirement(name = BEARER_KEY_SECURITY_SCHEME)})
    public OrderDto createOrder(
        @AuthenticationPrincipal CustomUserDetails currentUser,
        @Valid @RequestBody CreateOrderRequest createOrderRequest
    ) {
        User user = userService.validateAndGetUserByUsername(currentUser.getUsername());
        Order order = createOrderRequest.toDomain();
        order.setUser(user);

        return OrderDto.from(orderService.saveOrder(order));
    }

    @DeleteMapping("/api/orders/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @PreAuthorize("hasAuthority('ADMIN')")
//    @Secured("ADMIN")
    @Operation(security = {@SecurityRequirement(name = BEARER_KEY_SECURITY_SCHEME)})
    public void deleteOrder(@PathVariable UUID id) {
        Order order = orderService.validateAndGetOrder(id.toString());

        orderService.deleteOrder(order);
    }
}
