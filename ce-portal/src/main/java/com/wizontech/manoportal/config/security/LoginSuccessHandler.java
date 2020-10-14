package com.wizontech.manoportal.config.security;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.SavedRequestAwareAuthenticationSuccessHandler;

@lombok.extern.slf4j.Slf4j
public class LoginSuccessHandler extends SavedRequestAwareAuthenticationSuccessHandler {

  public LoginSuccessHandler(String defaultTargetUrl) {
    setDefaultTargetUrl(defaultTargetUrl);
    log.debug("super.getDefaultTargetUrl() : {}", super.getDefaultTargetUrl());
    log.debug("super.getTargetUrlParameter() : {}", super.getTargetUrlParameter());
    log.debug("super.getRedirectStrategy() : {}", super.getRedirectStrategy());
  }

  @Override
	public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
                                              Authentication authentication) throws ServletException, IOException {
    request.getSession().setMaxInactiveInterval(-1); // A zero or negative time indicates that the session should never timeout.
    super.onAuthenticationSuccess(request, response, authentication);
    // request.getRequestDispatcher("/portal").forward(request, response);
  }

}