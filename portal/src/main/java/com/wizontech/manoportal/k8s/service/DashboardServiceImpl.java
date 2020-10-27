package com.wizontech.manoportal.k8s.service;

import java.util.List;
import java.util.stream.Collectors;

import com.wizontech.manoportal.k8s.model.DaemonSet;
import com.wizontech.manoportal.k8s.model.Deployment;
import com.wizontech.manoportal.k8s.model.K8sObject;
import com.wizontech.manoportal.k8s.model.Namespace;
import com.wizontech.manoportal.k8s.model.Pod;
import com.wizontech.manoportal.k8s.model.Service;
import com.wizontech.manoportal.k8s.model.StatefulSet;

import io.kubernetes.client.openapi.ApiException;
import io.kubernetes.client.openapi.apis.AppsV1Api;
import io.kubernetes.client.openapi.apis.CoreV1Api;
import io.kubernetes.client.openapi.models.V1DaemonSetList;
import io.kubernetes.client.openapi.models.V1DeploymentList;
import io.kubernetes.client.openapi.models.V1NamespaceList;
import io.kubernetes.client.openapi.models.V1PodList;
import io.kubernetes.client.openapi.models.V1ServiceList;
import io.kubernetes.client.openapi.models.V1StatefulSetList;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@org.springframework.stereotype.Service
public class DashboardServiceImpl implements DashboardService {

  private final CoreV1Api coreV1Api;
  private final AppsV1Api appsV1Api;

  @Override
  public List<Namespace> getAllNamespaces() throws ApiException {
    V1NamespaceList v1namespaces = coreV1Api.listNamespace(null, null, null, null, null, null, null, null, null);
    return v1namespaces.getItems().stream().map(e -> Namespace.builder().name(e.getMetadata().getName()).build()).collect(Collectors.toList());
  }

  @Override
  public List<? extends K8sObject> getNamespacedWorkloads(String namespaceName, String type) throws ApiException {

    if (namespaceName.equals("all")) {
      // all namespaces
      if (type.equals("pods")) {
        // all pods
        V1PodList v1PodList = coreV1Api.listPodForAllNamespaces(null, null, null, null, null, null, null, null, null);
        List<Pod> pods = Pod.v1PodListToPodList(v1PodList);
        return pods;
      }
      if (type.equals("deployments")) {
        // all deployments
        V1DeploymentList v1DeploymentList = appsV1Api.listDeploymentForAllNamespaces(null, null, null, null, null, null, null, null, null);
        List<Deployment> deployments = Deployment.v1DeploymentListToDeploymentList(v1DeploymentList);
        return deployments;
      }
      if (type.equals("statefulsets")) {
        // all statefulSets
        V1StatefulSetList v1StatefulSetList = appsV1Api.listStatefulSetForAllNamespaces(null, null, null, null, null, null, null, null, null);
        List<StatefulSet> statefulsets = StatefulSet.v1StatefulSetListToStatefulSetList(v1StatefulSetList);
        return statefulsets;
      }
      if (type.equals("daemonsets")) {
        // all daemonSets
        V1DaemonSetList v1DaemonSetList = appsV1Api.listDaemonSetForAllNamespaces(null, null, null, null, null, null, null, null, null);
        List<DaemonSet> daemonsets = DaemonSet.v1DaemonSetListToDaemonSetList(v1DaemonSetList);
        return daemonsets;
      }
      if (type.equals("services")) {
        // all services
        V1ServiceList v1ServiceList = coreV1Api.listServiceForAllNamespaces(null, null, null, null, null, null, null, null, null);
        List<Service> services = Service.v1ServiceListToServiceList(v1ServiceList);
        return services;
      }
    } else {
      // specified namespace
      if (type.equals("pods")) {
        // all pods
        V1PodList v1PodList = coreV1Api.listNamespacedPod(namespaceName, null, null, null, null, null, null, null, null, null);
        List<Pod> pods = Pod.v1PodListToPodList(v1PodList);
        return pods;
      }
      if (type.equals("deployments")) {
        // all deployments
        V1DeploymentList v1DeploymentList = appsV1Api.listNamespacedDeployment(namespaceName, null, null, null, null, null, null, null, null, null);
        List<Deployment> deployments = Deployment.v1DeploymentListToDeploymentList(v1DeploymentList);
        return deployments;
      }
      if (type.equals("statefulsets")) {
        // all statefulSets
        V1StatefulSetList v1StatefulSetList = appsV1Api.listNamespacedStatefulSet(namespaceName, null, null, null, null, null, null, null, null, null);
        List<StatefulSet> statefulsets = StatefulSet.v1StatefulSetListToStatefulSetList(v1StatefulSetList);
        return statefulsets;
      }
      if (type.equals("daemonsets")) {
        // all daemonSets
        V1DaemonSetList v1DaemonSetList = appsV1Api.listNamespacedDaemonSet(namespaceName, null, null, null, null, null, null, null, null, null);
        List<DaemonSet> daemonsets = DaemonSet.v1DaemonSetListToDaemonSetList(v1DaemonSetList);
        return daemonsets;
      }
      if (type.equals("services")) {
        // all services
        V1ServiceList v1ServiceList = coreV1Api.listNamespacedService(namespaceName, null, null, null, null, null, null, null, null, null);
        List<Service> services = Service.v1ServiceListToServiceList(v1ServiceList);
        return services;
      }
    }
    return null;
  }

}