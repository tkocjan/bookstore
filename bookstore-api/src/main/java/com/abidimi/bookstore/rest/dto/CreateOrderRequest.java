package com.abidimi.bookstore.rest.dto;

import com.abidimi.bookstore.domain.order.Order;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;

public record CreateOrderRequest(
    @Schema(example = "Buy two iPhones") @NotBlank String description) {

  public Order toDomain() {
    return new Order(description);
  }
}
