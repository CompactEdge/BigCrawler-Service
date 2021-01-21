/*
 * Copyright 2020 the original author or authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package com.wizontech.auth.config;

import org.springframework.context.annotation.Bean;
// import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;

/**
 * @author Joe Grandja
 * @since 0.1.0
 */
@EnableWebSecurity
public class SecurityConfig extends WebSecurityConfigurerAdapter {

	// @Override
	// protected void configure(HttpSecurity http) throws Exception {
	// 	http.authorizeRequests().anyRequest().permitAll();
	// }

	// @formatter:off
	@Bean
	UserDetailsService customUserDetailsService() {
		UserDetails user = User
			.withUsername("user1")
			.password("$2y$12$HGAvCjyOgyAWKbf9139jKuiP34SjUpYsNOTAv9KYu0hnQqAFu/Z3e") // "password"
			.roles("USER")
			.build();
		return new InMemoryUserDetailsManager(user);
	}
	// @formatter:on

}