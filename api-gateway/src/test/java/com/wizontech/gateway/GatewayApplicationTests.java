
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
    "logging.level.reactor.netty.http.server=trace",
    "management.endpoint.health.show-details=never",
    "management.endpoint.health.show-components=never",
// @formatter:on
})
@ActiveProfiles("dev")
@AutoConfigureWireMock(port = 0)
public class GatewayApplicationTests {

  @Autowired
  private WebTestClient webClient;

  @Test
  public void healthCheck() throws Exception {
    // @formatter:off
    stubFor(get(urlEqualTo("/actuator/health"))
        .willReturn(aResponse()
          .withHeader("Content-Type", "application/json")));

    webClient
      .get().uri("/actuator/health")
      .exchange()
      .expectStatus().isOk()
      .expectBody()
      .jsonPath("$.status").isEqualTo("UP");
    // @formatter:on
  }
}
