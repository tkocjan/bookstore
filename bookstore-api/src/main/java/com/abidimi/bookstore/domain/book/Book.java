package com.abidimi.bookstore.domain.book;

import com.abidimi.bookstore.domain.user.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "books")
public class Book {
    public Book(String aIsbn, String aTitle)
    {
        isbn = aIsbn;
        title = aTitle;
    }

    @Id
    private String isbn;

    @Column(nullable = false)
    private String title;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(name = "books_users",
            joinColumns = @JoinColumn(name = "isbn"),
            inverseJoinColumns = @JoinColumn(name = "user_id"))
    List<User> users;
}
