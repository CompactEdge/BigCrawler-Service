package com.wizontech.portal.k8s.controller;

import java.io.IOException;
import java.util.List;

import com.google.gson.JsonObject;
import com.wizontech.portal.k8s.model.Namespace;
import com.wizontech.portal.k8s.model.Node;
import com.wizontech.portal.k8s.model.Pod;
import com.wizontech.portal.k8s.service.MonitoringService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import io.kubernetes.client.openapi.ApiException;
import lombok.RequiredArgsConstructor;

// @lombok.extern.slf4j.Slf4j
@RequiredArgsConstructor
@RequestMapping("/monitoring")
@Controller
public class MonitoringController {

  private final MonitoringService monitoringService;

  @GetMapping("/node/selectnode")
  @ResponseBody
  public ResponseEntity<List<Node>> getSelectNode() throws ApiException {
    List<Node> nodes = monitoringService.getAllNodes();
    return new ResponseEntity<>(nodes, HttpStatus.OK);
  }

  @GetMapping("/pod/selectns")
  @ResponseBody
  public ResponseEntity<List<Namespace>> getSelectNamespace() throws ApiException {
    List<Namespace> namespaces = monitoringService.getAllNamespaces();
    return new ResponseEntity<>(namespaces, HttpStatus.OK);
  }

  @GetMapping("/pod/selectpod")
  @ResponseBody
  public ResponseEntity<List<Pod>> getSelectPod(@RequestParam String namespace) throws ApiException {
    List<Pod> pods = monitoringService.getNamespacedPods(namespace);
    return new ResponseEntity<>(pods, HttpStatus.OK);
  }

  @ResponseBody
  @GetMapping("/cluster/{resource}")
  public String getClusterMonitoring(@PathVariable String resource, @RequestParam(required = false) String cluster) throws IOException {
    // log.debug("resource : {}", resource);
    JsonObject json = monitoringService.getClusterMonitoring(resource, cluster);
    return json.toString();
  }

  @ResponseBody
  @GetMapping("/namespace/{resource}")
  public String getNamespaceMonitoring(@PathVariable String resource, @RequestParam(required = false) String namespace, @RequestParam(required = false) String type) throws IOException {
    // log.debug("resource : {}", resource);
    JsonObject json = monitoringService.getNamespaceMonitoring(resource, namespace, type);
    return json.toString();
  }

  @ResponseBody
  @GetMapping("/node/{resource}")
  public String getNodeMonitoring(@PathVariable String resource, @RequestParam(required = false) String node) throws IOException {
    // log.debug("resource : {}", resource);
    JsonObject json = monitoringService.getNodeMonitoring(resource, node);
    return json.toString();
  }

  @ResponseBody
  @GetMapping("/pod/{resource}")
  public String getPodMonitoring(@PathVariable String resource, @RequestParam(required = false) String namespace, @RequestParam(required = false) String pod) throws IOException {
    // log.debug("resource : {}", resource);
    JsonObject json = monitoringService.getPodMonitoring(resource, namespace, pod);
    return json.toString();
  }

}