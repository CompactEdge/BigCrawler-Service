package com.wizontech.gateway.controller;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cloud.client.ServiceInstance;
import org.springframework.cloud.client.discovery.DiscoveryClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.client.RestTemplate;

// @org.springframework.web.bind.annotation.RestController
// @org.springframework.web.bind.annotation.RequestMapping("/ce/v1")
public class CompactController {

  Logger logger = LoggerFactory.getLogger(CompactController.class);
  
	@Autowired
	RestTemplate restTemplate;

  @Autowired
  private DiscoveryClient discoveryClient;
  
	@GetMapping("/k8s")
	public ResponseEntity<Object> getData() {
		String url = "http://127.0.0.1:7000/api/v1/core/namespaces";
		ResponseEntity<String> responseEntity = restTemplate.getForEntity(url, String.class);
		return ResponseEntity.ok(responseEntity.getBody());
  }
  
  @javax.annotation.Nullable
	@GetMapping("/sample")
	public ResponseEntity<Object> getKubernetes() {
    List<ServiceInstance> testServiceInstances = discoveryClient.getInstances("kubernetes");
    logger.info("test1: {}", testServiceInstances.get(0).getUri());
    logger.info("test2: {}", testServiceInstances.get(0).getHost());
    logger.info("test3: {}", testServiceInstances.get(0).getPort());
    logger.info("test4: {}", testServiceInstances.get(0).getServiceId());
    logger.info("test5: {}", testServiceInstances.get(0).getMetadata());
		ResponseEntity<String> responseEntity = restTemplate.getForEntity(testServiceInstances.get(0).getUri() + "/api/v1/namespaces", String.class);
		return ResponseEntity.ok(responseEntity.getBody());
	}
}
