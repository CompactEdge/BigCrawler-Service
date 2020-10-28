package com.wizontech.portal.k8s.service;

import java.io.IOException;
import java.util.List;

import com.google.gson.JsonObject;
import com.wizontech.portal.k8s.model.Namespace;
import com.wizontech.portal.k8s.model.Node;
import com.wizontech.portal.k8s.model.Pod;

import io.kubernetes.client.openapi.ApiException;

public interface MonitoringService {
  /**
   * select에 들어갈 쿠버네티스 Nodes 조회
   * @return
   * @throws ApiException
   */
  public List<Node> getAllNodes() throws ApiException;

  /**
   * select에 들어갈 쿠버네티스 Namespaces 조회
   * @return
   * @throws ApiException
   */
  public List<Namespace> getAllNamespaces() throws ApiException;

  /**
   * select에 들어갈 쿠버네티스 Pods 조회
   * @return
   * @throws ApiException
   */
  public List<Pod> getNamespacedPods(String namespace) throws ApiException;

  /**
   * Cluster Resource
   */
  public JsonObject getClusterMonitoring(String resource, String cluster) throws IOException;

  /**
   * Namespace Resource
   */
  public JsonObject getNamespaceMonitoring(String resource, String namespace, String type) throws IOException;

  /**
   * Node Resource
   */
  public JsonObject getNodeMonitoring(String resource, String node) throws IOException;

  /**
   * Pod Resource
   */
  public JsonObject getPodMonitoring(String resource, String namespace, String pod) throws IOException;
}