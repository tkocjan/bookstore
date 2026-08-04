package com.abidimi.bookstore.rest;

import static com.abidimi.bookstore.config.SwaggerConfig.BEARER_KEY_SECURITY_SCHEME;

import com.abidimi.bookstore.rest.dto.UserDto;
import com.abidimi.bookstore.security.CustomUserDetails;
import com.abidimi.bookstore.security.Role;
import com.abidimi.bookstore.domain.user.User;
import com.abidimi.bookstore.domain.user.UserDeletionNotAllowedException;
import com.abidimi.bookstore.domain.user.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;

import java.util.List;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RequiredArgsConstructor
@RestController
//@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    @GetMapping("/api/users/me")
//    @Operation(security = {@SecurityRequirement(name = BEARER_KEY_SECURITY_SCHEME)})
    @PreAuthorize("hasAuthority('USER') or hasAuthority('ADMIN')")
    public UserDto getCurrentUser(@AuthenticationPrincipal CustomUserDetails currentUser) {
        return UserDto.from(userService.validateAndGetUserByUsername(currentUser.getUsername()));
    }

    @GetMapping("/api/users")
//    @Operation(security = {@SecurityRequirement(name = BEARER_KEY_SECURITY_SCHEME)})
    @PreAuthorize("hasAuthority('ADMIN')")
    public List<UserDto> getUsers() {
        return userService.getUsers().stream().map(UserDto::from).toList();
    }

    @GetMapping("/api/users/{username}")
//    @Operation(security = {@SecurityRequirement(name = BEARER_KEY_SECURITY_SCHEME)})
    @PreAuthorize("hasRole('ADMIN')")
    public UserDto getUser(@PathVariable String username) {
        return UserDto.from(userService.validateAndGetUserByUsername(username));
    }

    @DeleteMapping("/api/users/{username}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
//    @Operation(security = {@SecurityRequirement(name = BEARER_KEY_SECURITY_SCHEME)})
    @PreAuthorize("hasRole('ADMIN')")
    public void deleteUser(
            @PathVariable String username, @AuthenticationPrincipal CustomUserDetails currentUser) {
        User user = userService.validateAndGetUserByUsername(username);
        if (currentUser.getUsername().equals(username)) {
            throw new UserDeletionNotAllowedException("You cannot delete your own account");
        }
        if (Role.ADMIN.equals(user.getRole()) && userService.countAdmins() == 1) {
            throw new UserDeletionNotAllowedException("Cannot delete the last admin account");
        }
        userService.deleteUser(user);
    }
}
