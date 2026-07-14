package com.abidimi.bookstore;

import com.abidimi.bookstore.domain.order.OrderService;
import com.abidimi.bookstore.security.TokenProvider;
import com.abidimi.bookstore.domain.user.UserService;
import javax.sql.DataSource;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.test.context.bean.override.mockito.MockitoBean;

@SpringBootTest(
    properties = {
      "spring.jpa.database-platform=org.hibernate.dialect.PostgreSQLDialect",
      "spring.jpa.hibernate.ddl-auto=none"
    })
class BookstoreApplicationTests {

  @MockitoBean DataSource dataSource;

  @MockitoBean private UserService userService;

  @MockitoBean private OrderService orderService;

  @MockitoBean private UserDetailsService userDetailsService;

  @MockitoBean private TokenProvider tokenProvider;

  @Test
  void contextLoads() {}
}
