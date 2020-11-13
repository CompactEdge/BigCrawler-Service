
package com.wizontech.gateway;

import static com.github.tomakehurst.wiremock.client.WireMock.*;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.cloud.contract.wiremock.AutoConfigureWireMock;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.reactive.server.WebTestClient;

@RunWith(SpringRunner.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT, properties = {
// @formatter:off
    "httpbin=http://localhost:${wiremock.server.port}",
    "logging.level.reactor.netty.http.server=debug"
// @formatter:on
})
@ActiveProfiles("dev")
@AutoConfigureWireMock(port = 0)
public class GatewayApplicationTests {

  @Autowired
  private WebTestClient webClient;

  @Test
  public void contextLoads() throws Exception {
    // @formatter:off
    // Stubs
    stubFor(get(urlEqualTo("/actuator/health"))
        .willReturn(aResponse()
          .withBody("{\"headers\":{\"Hello\":\"World\"}}")
          .withHeader("Content-Type", "application/json")));

    webClient
      .get().uri("/actuator/health")
      .exchange()
      .expectStatus().isOk()
      .expectBody();
      // .jsonPath("$.headers.Hello").isEqualTo("World");

    // stubFor(get(urlEqualTo("/delay/3"))
    //   .willReturn(aResponse()
    //     .withBody("no fallback")
    //     .withFixedDelay(3000)));

    // webClient
    //   .get().uri("/delay/3")
    //   .header("Host", "www.hystrix.com")
    //   .exchange()
    //   .expectStatus().isOk()
    //   .expectBody()
    //   .consumeWith(
    //     response -> assertThat(response.getResponseBody()).isEqualTo("fallback".getBytes()));
    // @formatter:on
  }
}
