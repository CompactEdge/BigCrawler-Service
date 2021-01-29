package com.wizontech.gateway.config;

import static org.springframework.security.config.Customizer.withDefaults;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.reactive.EnableWebFluxSecurity;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.core.userdetails.MapReactiveUserDetailsService;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.server.SecurityWebFilterChain;

@Configuration
@EnableWebFluxSecurity
public class SecurityConfig {

  @Bean
  public SecurityWebFilterChain springSecurityFilterChain(ServerHttpSecurity http) {
    // @formatter:off
    http
      .authorizeExchange()
      .pathMatchers("/actuator/**").permitAll()
      // .pathMatchers("/kube/**").hasAuthority("SCOPE_resource.read")
      .anyExchange()
      .authenticated()
      .and()
      // .httpBasic()
      // .and()
      .logout().logoutUrl("/logout").and()
      .oauth2Login(withDefaults())
      .oauth2Client(withDefaults());
    // @formatter:on
    return http.build();
  }

  @Bean
  // @formatter:off
	public MapReactiveUserDetailsService userDetailsService() {
		UserDetails user = User
      .withUsername("user")
			.password("password")
      .roles("USER")
			.build();
		return new MapReactiveUserDetailsService(user);
  // @formatter:on
  }

}
