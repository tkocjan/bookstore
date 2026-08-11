package com.abidimi.bookstore.rest;

import com.abidimi.bookstore.domain.book.Book;
import com.abidimi.bookstore.domain.book.BookService;
import com.abidimi.bookstore.rest.dto.BookDto;
import com.abidimi.bookstore.rest.dto.CreateBookRequest;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static com.abidimi.bookstore.config.SwaggerConfig.BEARER_KEY_SECURITY_SCHEME;

@RequiredArgsConstructor
@RestController
//@RequestMapping("/public/books")
public class BookController {

    private final BookService bookService;

//    @Operation(security = {@SecurityRequirement(name = BASIC_AUTH_SECURITY_SCHEME)})
//    @GetMapping("/public/books/old")
//    public List<BookDto> getBooks(
//        @RequestParam(value = "text", required = false) String text
//    ) {
//        List<Book> books = (text == null || text.isBlank())
//            ? bookService.getBooks()
//            : bookService.getBooksContainingText(text);
//
//        return books.stream().map(BookDto::from).toList();
//    }

//    @Operation(security = {@SecurityRequirement(name = BASIC_AUTH_SECURITY_SCHEME)})
    @GetMapping("/public/books")
    public Page<Book> getBooks(
        @PageableDefault(size = 2) Pageable pageable,
        @RequestParam(value = "text", required = false) String text
    ) {
        Page<Book> pagedBooks = (text == null || text.isBlank())
                ? bookService.getBooks(pageable)
                : bookService.getBooksContainingText(text, pageable);

        return pagedBooks;
    }

    @Operation(security = {@SecurityRequirement(name = BEARER_KEY_SECURITY_SCHEME)})
    @GetMapping("/public/books/{isbn}")
    public BookDto getBook(@PathVariable String isbn)
    {
        Book book = bookService.validateAndGetBook(isbn);

        return BookDto.from(book);
    }

    @Operation(security = {@SecurityRequirement(name = BEARER_KEY_SECURITY_SCHEME)})
    @ResponseStatus(HttpStatus.CREATED)
    @PostMapping("/api/books")
    public BookDto createBook(@Valid @RequestBody CreateBookRequest createBookRequest) {
        Book book = createBookRequest.toDomain();

        return BookDto.from(bookService.saveBook(book));
    }

    @Operation(security = {@SecurityRequirement(name = BEARER_KEY_SECURITY_SCHEME)})
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @DeleteMapping("/api/books/{isbn}")
    public void deleteBook(@PathVariable String isbn) {
        Book book = bookService.validateAndGetBook(isbn);
        bookService.deleteBook(book);
    }
}
