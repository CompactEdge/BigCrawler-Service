package com.wizontech.manoportal.config.security;

import com.wizontech.manoportal.user.service.UserServiceImpl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.builders.WebSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.authentication.AuthenticationFailureHandler;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationFailureHandler;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Configuration
@EnableWebSecurity
@EnableGlobalMethodSecurity(prePostEnabled = true, securedEnabled = true)
public class SecurityConfig extends WebSecurityConfigurerAdapter {

  private final PasswordEncoder passwordEncoder;
  private final UserServiceImpl userService;

  @Override
  public void configure(WebSecurity webSecurity) throws Exception {
    webSecurity.ignoring().antMatchers("/css/**", "/js/**", "/img/**", "favicon.*");
  }

  @Override
  protected void configure(HttpSecurity http) throws Exception {

    http.csrf()
      .disable();
      // .ignoringAntMatchers("/**");

    http.authorizeRequests()
      .antMatchers("/user/**").authenticated()
      .antMatchers("/portal").authenticated()
      .antMatchers("/monitoring/**").authenticated()
      .antMatchers("/resource/**").authenticated()
      .antMatchers("/trace/**").authenticated()
      .antMatchers("/app/**").authenticated()
      .anyRequest().permitAll();

    http.formLogin()
      .loginPage("/")
      .loginProcessingUrl("/signin")
      .successHandler(successHandler())
      .failureHandler(failureHandler())
      .usernameParameter("username")
      .passwordParameter("password")
      .permitAll();

    http.logout()
      .logoutUrl("/logout")
      .logoutRequestMatcher(new AntPathRequestMatcher("/logout", "GET"))
      .clearAuthentication(true)
      .invalidateHttpSession(true)
      .deleteCookies("JSESSIONID")
      .logoutSuccessUrl("/");

    // http.cors()
    //   .configurationSource(corsConfigurationSource());
  }

  @Autowired
  protected void configureGlobal(AuthenticationManagerBuilder auth) throws Exception {
    auth.authenticationProvider(daoAuthenticationProvider());
  }

  // @Bean
  // public CorsConfigurationSource corsConfigurationSource() {
  //   CorsConfiguration configuration = new CorsConfiguration();
  //   // This Origin header you can see that in Network tab
  //   // configuration.setAllowedOrigins(Arrays.asList("http://221.153.191.33:12020", "http://221.153.191.33:15050", "http://localhost:8080"));
  //   configuration.setAllowedOrigins(Arrays.asList("*"));
  //   configuration.setAllowedMethods(Arrays.asList("*"));
  //   configuration.setAllowedHeaders(Arrays.asList("*"));
  //   configuration.setAllowCredentials(true);
  //   UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
  //   source.registerCorsConfiguration("/**", configuration);
  //   return source;
  // }

  @Bean
  public DaoAuthenticationProvider daoAuthenticationProvider() {
    DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
    provider.setPasswordEncoder(passwordEncoder);
    provider.setUserDetailsService(userService);
    return provider;
  }

  @Bean
  public AuthenticationSuccessHandler successHandler() {
    // return new LoginSuccessHandler("http://192.168.213.242:8000/portal"); // org.springframework.security.access.AccessDeniedException: Access is denied
    return new LoginSuccessHandler("/portal");
  }

  @Bean
  public AuthenticationFailureHandler failureHandler() {
    return new SimpleUrlAuthenticationFailureHandler("/");
  }
}