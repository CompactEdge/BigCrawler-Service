package com.wizontech.manoportal.k8s.controller;

import java.util.List;

import com.wizontech.manoportal.k8s.model.K8sObject;
import com.wizontech.manoportal.k8s.model.Namespace;
import com.wizontech.manoportal.k8s.service.DashboardService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import io.kubernetes.client.openapi.ApiException;
import lombok.RequiredArgsConstructor;

// @lombok.extern.slf4j.Slf4j
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
@RequestMapping("/portal")
@Controller
public class DashboardController {

  private final DashboardService dashboardService;

  @GetMapping
  public String getDashboard(Model model) {
    return "dashboard";
  }

  @GetMapping("/selectns")
  @ResponseBody
  public ResponseEntity<List<Namespace>> getSelectNamespace() throws ApiException {
    List<Namespace> namespaces = dashboardService.getAllNamespaces();
    return new ResponseEntity<>(namespaces, HttpStatus.OK);
  }

  @GetMapping("/{namespaceName}/{type}")
  @ResponseBody
  // @GetMapping(produces = MediaType.APPLICATION_STREAM_JSON_VALUE)
  public ResponseEntity<List<? extends K8sObject>> getNamespacedWorkloads(@PathVariable String namespaceName, @PathVariable String type) throws ApiException {
    List<? extends K8sObject> objects = dashboardService.getNamespacedWorkloads(namespaceName, type);
    return new ResponseEntity<>(objects, HttpStatus.OK);
  }

}