package com.abidimi.bookstore.domain.book;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BookRepository extends JpaRepository<Book, String> {

    List<Book> findAllByOrderByTitle();

    Page<Book> findAllByOrderByTitle(Pageable pageable);

    Page<Book> findByIsbnContainingOrTitleContainingIgnoreCaseOrderByTitle(String isbn, String title, Pageable pageable);
}
