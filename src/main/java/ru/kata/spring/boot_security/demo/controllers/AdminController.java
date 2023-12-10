package ru.kata.spring.boot_security.demo.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import ru.kata.spring.boot_security.demo.models.User;
import ru.kata.spring.boot_security.demo.services.RoleService;
import ru.kata.spring.boot_security.demo.services.UserService;

@Controller
@RequestMapping("/admin")
public class AdminController {
    private final UserService service;
    private final RoleService roleService;

    @Autowired
    public AdminController(UserService service, RoleService roleService) {
        this.service = service;
        this.roleService = roleService;
    }

    @GetMapping
    public String printAll(Model model) {
        model.addAttribute("users", service.getAll());
        return "admin/index";
    }

    @GetMapping("/new")
    public String printAddForm(@ModelAttribute("user") User user, Model model) {
        model.addAttribute("allRoles", roleService.getAll());
        return "admin/new";
    }

    @PostMapping("/new")
    public String add(@ModelAttribute("user") User user) {
        service.save(user);
        return "redirect:/admin";
    }

    @PostMapping("/delete")
    public String remove(@RequestParam("id") long id) {
        service.removeById(id);
        return "redirect:/admin";
    }

    @GetMapping("/edit")
    public String printEditForm(@RequestParam("id") long id, Model model) {
        model.addAttribute("user", service.getById(id));
        model.addAttribute("allRoles", roleService.getAll());
        return "admin/edit";
    }

    @PostMapping("/edit")
    public String edit(@ModelAttribute("user") User user, @RequestParam("id") long id) {
        service.update(user, id);
        return "redirect:/admin";
    }
}
