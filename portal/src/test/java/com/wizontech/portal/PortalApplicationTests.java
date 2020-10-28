package com.wizontech.portal;

import com.wizontech.portal.config.security.Base64PasswordEncoder;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.test.context.ActiveProfiles;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@ActiveProfiles("dev-docker")
@SpringBootTest(classes = PortalApplication.class)
class portalApplicationTests {

	@Test
	public void Base64Encode() {
		String password = "1234";	// MTIzNA==
		String encode = new Base64PasswordEncoder().encode(password);
		log.info("encoded password : {}", encode);
		Assertions.assertNotNull(encode);
  }

	@Test
	public void BCryptEncode() {
		String password = "1234";	// MTIzNA==
		String encode = new BCryptPasswordEncoder().encode(password);
		log.info("encoded password : {}", encode);
		Assertions.assertNotNull(encode);
	}

}
