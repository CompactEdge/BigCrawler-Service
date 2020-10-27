package com.wizontech.manoportal.config.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class PasswordConfig {
  @Bean
  public PasswordEncoder passwordEncoder() {
    // return new Base64PasswordEncoder();
    return new BCryptPasswordEncoder(10);
  }
}