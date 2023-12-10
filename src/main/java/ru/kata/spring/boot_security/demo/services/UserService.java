package ru.kata.spring.boot_security.demo.services;

import ru.kata.spring.boot_security.demo.models.User;

import java.util.List;

public interface UserService {
    List<User> getAll();

    void save(User user);

    void removeById(long id);

    User getById(long id);

    void update(User user, long id);

    User findByUsername(String username);
}
