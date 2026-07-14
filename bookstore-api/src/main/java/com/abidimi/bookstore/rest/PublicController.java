package com.abidimi.bookstore.rest;

import com.abidimi.bookstore.domain.order.OrderService;
import com.abidimi.bookstore.domain.user.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RequiredArgsConstructor
@RestController
@RequestMapping("/public")
public class PublicController {

  private final UserService userService;
  private final OrderService orderService;

  @GetMapping("/numberOfUsers")
  public long getNumberOfUsers() {
    return userService.countUsers();
  }

  @GetMapping("/numberOfOrders")
  public long getNumberOfOrders() {
    return orderService.countOrders();
  }
}
