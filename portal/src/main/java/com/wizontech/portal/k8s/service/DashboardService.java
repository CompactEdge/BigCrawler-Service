package com.wizontech.portal.k8s.service;

import java.util.List;

import com.wizontech.portal.k8s.model.K8sObject;
import com.wizontech.portal.k8s.model.Namespace;

import io.kubernetes.client.openapi.ApiException;

public interface DashboardService {

  /**
   * 모든 Namespace 조회
   * @return
   * @throws ApiException
   */
  public List<Namespace> getAllNamespaces() throws ApiException;

  /**
   * 특정 Namespace의 Object Workload
   * @throws ApiException
   */
  public List<? extends K8sObject> getNamespacedWorkloads(String namespaceName, String type) throws ApiException;

  /**
   * Watch API
   * @param v1pods
   */
  // public List<Pod> getPodsWatch(V1PodList v1pods);

}