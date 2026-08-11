package com.abidimi.bookstore.domain.book;

import com.abidimi.bookstore.domain.user.User;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.Instant;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "books")
public class Book {

    @Id
    private String isbn;

    @Column(nullable = false)
    private String title;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private Instant createdAt;

    @UpdateTimestamp
    @Column(nullable = false)
    private Instant updatedAt;

    public Book(String aIsbn, String aTitle)
    {
        isbn = aIsbn;
        title = aTitle;
    }

//    @ManyToMany(fetch = FetchType.LAZY)
//    @JoinTable(name = "books_users",
//            joinColumns = @JoinColumn(name = "isbn"),
//            inverseJoinColumns = @JoinColumn(name = "user_id"))
//    @JsonIgnore
//    List<User> users;
}
