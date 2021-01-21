
package com.wizontech.gateway;

import static com.github.tomakehurst.wiremock.client.WireMock.aResponse;
import static com.github.tomakehurst.wiremock.client.WireMock.get;
import static com.github.tomakehurst.wiremock.client.WireMock.stubFor;
import static com.github.tomakehurst.wiremock.client.WireMock.urlEqualTo;

import org.apache.http.protocol.HTTP;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.cloud.contract.wiremock.AutoConfigureWireMock;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
// import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.reactive.server.WebTestClient;

@RunWith(SpringRunner.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.DEFINED_PORT, properties = {
// @formatter:off
    "httpbin=http://localhost:${wiremock.server.port}",
    "logging.level.reactor.netty.http.server=trace",
    "management.endpoint.health.show-details=never",
    "management.endpoint.health.show-components=never",
// @formatter:on
})
@ActiveProfiles("dev")
@AutoConfigureWireMock()
public class GatewayApplicationTests {

  @Autowired
  private WebTestClient webTestClient;

  @Test
  public void actuatorMetrics() throws Exception {
    // @formatter:off
    stubFor(get(urlEqualTo("/actuator/health"))
        .willReturn(aResponse()
          .withHeader(HTTP.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)));

    webTestClient
      .get().uri("/actuator/health")
      .exchange()
      .expectStatus().isOk()
      .expectBody()
      .jsonPath("$.status").isEqualTo("UP");
    // @formatter:on
  }
}
