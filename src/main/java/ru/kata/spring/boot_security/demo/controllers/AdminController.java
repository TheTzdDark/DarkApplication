package ru.kata.spring.boot_security.demo.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import ru.kata.spring.boot_security.demo.models.User;
import ru.kata.spring.boot_security.demo.services.RoleService;
import ru.kata.spring.boot_security.demo.services.UserService;

import javax.validation.Valid;

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
    public String printAll(@ModelAttribute("user") User user, Model model) {
        model.addAttribute("allUsers", service.getAll());
        model.addAttribute("allRoles", roleService.getAll());
        model.addAttribute("currentUser", (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal());
        return "admin/index";
    }

    @PostMapping("/new")
    public String add(@ModelAttribute("user") @Valid User user, BindingResult bindingResult) {
        if (!bindingResult.hasErrors()) {
            service.save(user);
        }
        return "redirect:/admin";
    }

    @PostMapping("/delete")
    public String remove(@RequestParam("id") long id) {
        service.removeById(id);
        return "redirect:/admin";
    }

    @PostMapping("/edit")
    public String edit(@ModelAttribute("user") @Valid User user, BindingResult bindingResult,
                       @RequestParam("id") long id) {
        if (!bindingResult.hasErrors()) {
            service.update(user, id);
        }
        return "redirect:/admin";
    }
}
