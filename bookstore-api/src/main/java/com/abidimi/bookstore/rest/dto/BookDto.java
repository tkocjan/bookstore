package com.abidimi.bookstore.rest.dto;

import com.abidimi.bookstore.domain.book.Book;

public record BookDto(String isbn, String title) {

  public static BookDto from(Book book) {
    return new BookDto(book.getIsbn(), book.getTitle());
  }
}
