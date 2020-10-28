package com.wizontech.portal.user.controller;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.validation.Valid;

import com.wizontech.portal.user.model.UserProfileDto;
import com.wizontech.portal.user.model.UserProfileEntity;
import com.wizontech.portal.user.service.UserServiceImpl;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RequiredArgsConstructor
@RequestMapping("/user")
@Controller
public class UserController {

  private final UserServiceImpl userService;

  @PostMapping("/signin")
  public void getPortal(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
    request.getRequestDispatcher("/portal").forward(request, response);
  }

  @GetMapping("/{id}")
  public ResponseEntity<UserProfileDto> getProfile(@PathVariable("id") Long id, Model model) {
    log.debug("get <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< user profile");
    UserProfileEntity profile = userService.getProfile(id);
    return new ResponseEntity<>(profile.toDto(), HttpStatus.OK);
  }

  @ResponseBody
  @PostMapping("/{id}")
  public ResponseEntity<UserProfileDto> postProfile(@PathVariable("id") Long id, @Valid @RequestBody UserProfileDto updateProfile, Model model) {
    log.debug("post >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> user profile");
    userService.updateProfile(id, updateProfile);
    UserProfileDto newProfile = userService.getProfile(id).toDto();
    return new ResponseEntity<>(newProfile, HttpStatus.OK);
  }
}