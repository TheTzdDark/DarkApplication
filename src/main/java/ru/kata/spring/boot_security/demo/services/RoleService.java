package ru.kata.spring.boot_security.demo.services;

import ru.kata.spring.boot_security.demo.models.Role;

import java.util.List;

public interface RoleService {
    List<Role> getAll();

    void save(Role role);

    void removeById(long id);

    Role getById(long id);

    void update(Role role, long id);
}
