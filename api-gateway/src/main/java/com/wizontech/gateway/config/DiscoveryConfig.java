package com.wizontech.gateway.config;

import org.springframework.cloud.client.discovery.DiscoveryClient;
import org.springframework.cloud.client.discovery.simple.SimpleDiscoveryClient;
import org.springframework.cloud.client.discovery.simple.SimpleDiscoveryProperties;

// @org.springframework.context.annotation.Configuration
public class DiscoveryConfig {
  // @org.springframework.context.annotation.Bean
  public DiscoveryClient getDisCoveryClient() {
    return new SimpleDiscoveryClient(new SimpleDiscoveryProperties());
  }
}
