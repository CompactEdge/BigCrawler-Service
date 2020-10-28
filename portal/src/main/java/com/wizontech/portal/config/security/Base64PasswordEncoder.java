package com.wizontech.portal.config.security;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.util.Base64Utils;

public class Base64PasswordEncoder implements PasswordEncoder {

  @Override
  public String encode(CharSequence rawPassword) {
    return new String(Base64Utils.encode(rawPassword.toString().getBytes()));
  }

  @Override
  public boolean matches(CharSequence rawPassword, String encodedPassword) {
    return encodedPassword.equals(encode(rawPassword));
  }

}