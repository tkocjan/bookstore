package com.abidimi.bookstore.domain.book;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@RequiredArgsConstructor
@Service
public class BookService {

    private final BookRepository bookRepository;

    public List<Book> getBooks() {
        return bookRepository.findAllByOrderByTitle();
    }

    public Page<Book> getBooks(Pageable pageable) {
        return bookRepository.findAllByOrderByTitle(pageable);
    }

    public Page<Book> getBooksContainingText(String text, Pageable pageable) {
        return bookRepository.findAllByIsbnContainingOrTitleContainingIgnoreCaseOrderByTitle(text, text, pageable);
    }

    public Book validateAndGetBook(String isbn) {
        return bookRepository.findByIsbn(isbn)
            .orElseThrow(
                () -> new BookNotFoundException("Book with isbn %s not found".formatted(isbn))
            );
    }

    public Book saveBook(Book book) {
        return bookRepository.save(book);
//        return bookRepository.saveAndFlush(book);
    }

    public void deleteBook(Book book) {
        bookRepository.delete(book);
    }

    public long countBooks() {
        return bookRepository.count();
    }
}
