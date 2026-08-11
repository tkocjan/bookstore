package com.abidimi.bookstore.domain.book;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface BookRepository extends JpaRepository<Book, String> {

    Optional<Book> findByIsbn(String isbn);

    List<Book> findAllByOrderByTitle();

    Page<Book> findAllByOrderByTitle(Pageable pageable);

    Page<Book> findAllByIsbnContainingOrTitleContainingIgnoreCaseOrderByTitle(String isbn, String title, Pageable pageable);
}
