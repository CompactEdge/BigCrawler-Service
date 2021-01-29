package com.wizontech.gateway.config;

// import org.springframework.cloud.gateway.filter.factory.TokenRelayGatewayFilterFactory;
// import org.springframework.cloud.security.oauth2.gateway.TokenRelayGatewayFilterFactory;
import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;

@org.springframework.stereotype.Controller
public class RouteLocatorConfig {

  // @Autowired
  // private TokenRelayGatewayFilterFactory filterFactory;

  public static final String HTTP_BIN = "http://httpbin.org";
  // public static final String LOCAL_SERVICE_BUS = "http://127.0.0.1:7000";
  // public static final String KUBE_SERVICE_BUS = "http://svcbus.default:7000";
  // public static final String LOCAL_PROMETHEUS = "http://127.0.0.1:9090";
  // public static final String KUBE_PROMETHEUS =
  // "http://prometheus-operator:9090";

  @Bean
  public RouteLocator customRouteLocator(
      RouteLocatorBuilder builder/* , TokenRelayGatewayFilterFactory filterFactory */) {
    //@formatter:off
    return builder.routes()
        .route("test_route", r -> r.path("/get").uri(HTTP_BIN))
        // .route("service_bus", r -> r
        //   .path("/kube/**")
        //     .filters(f -> {
        //         f.filters(filterFactory.apply()).removeRequestHeader("Cookie");
        //         return f.rewritePath("/kube/(?<segment>.*)", "/api/v1/${segment}");
        //       }
        //     )
        //     .uri(LOCAL_SERVICE_BUS))
        // .route("prometheus_query", r -> r
        //   .path("/prom/**")
        //   .filters(f -> {
        //     f.setResponseHeader("Access-Control-Allow-Origin", "*");
        //     return f.rewritePath("/prom/(?<segment>.*)", "/api/v1/query?query=${segment}");
        //   })
        //   .uri(LOCAL_PROMETHEUS))
        // .route("prometheus_query_range", r -> r
        //   .path("/promr/**")
        //   .filters(f -> {
        //     f.setResponseHeader("Access-Control-Allow-Origin", "*");
        //     return f.rewritePath("/promr/(?<segment>.*)", "/api/v1/query_range?query=${segment}");
        //   })
        //   .uri(LOCAL_PROMETHEUS))
        .build();
    //@formatter:on
  }
}
