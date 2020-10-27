package com.wizontech.manoportal.k8s.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import com.google.gson.JsonSyntaxException;
import com.wizontech.manoportal.k8s.model.K8sObject;
import com.wizontech.manoportal.k8s.model.Namespace;
import com.wizontech.manoportal.k8s.model.Node;
import com.wizontech.manoportal.k8s.model.ObjectType;
import com.wizontech.manoportal.k8s.model.PersistentVolumeClaim;
import com.wizontech.manoportal.k8s.model.Pod;
import com.wizontech.manoportal.k8s.model.Service;

import io.kubernetes.client.openapi.ApiException;
import io.kubernetes.client.openapi.apis.AppsV1Api;
import io.kubernetes.client.openapi.apis.CoreV1Api;
import io.kubernetes.client.openapi.models.V1DaemonSetList;
import io.kubernetes.client.openapi.models.V1DeploymentList;
import io.kubernetes.client.openapi.models.V1NamespaceList;
import io.kubernetes.client.openapi.models.V1Node;
import io.kubernetes.client.openapi.models.V1NodeList;
import io.kubernetes.client.openapi.models.V1PersistentVolumeClaim;
import io.kubernetes.client.openapi.models.V1PersistentVolumeClaimList;
import io.kubernetes.client.openapi.models.V1PersistentVolumeList;
import io.kubernetes.client.openapi.models.V1Pod;
import io.kubernetes.client.openapi.models.V1PodList;
import io.kubernetes.client.openapi.models.V1Service;
import io.kubernetes.client.openapi.models.V1ServiceList;
import io.kubernetes.client.openapi.models.V1StatefulSetList;
import io.kubernetes.client.openapi.models.V1Status;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RequiredArgsConstructor
@org.springframework.stereotype.Service
public class ResourceServiceImpl implements ResourceService {

  private final CoreV1Api coreV1Api;
  private final AppsV1Api appsV1Api;

  @Override
  public List<Namespace> getAllNamespace() throws ApiException {
    V1NamespaceList v1namespaces = coreV1Api.listNamespace(null, null, null, null, null, null, null, null, null);
    return v1namespaces.getItems()
      .stream()
      .map(ns -> Namespace.builder().name(ns.getMetadata().getName()).build())
      .collect(Collectors.toList());
  }

  @Override
  public Map<String, List<? extends K8sObject>> getAllNodes() throws ApiException {
    Map<String, List<? extends K8sObject>> nodemap = new HashMap<>();
    V1NodeList v1nodes = coreV1Api.listNode(null, null, null, null, null, null, null, null, null);
    List<Node> nodelist = Node.v1NodeListToNodeList(v1nodes);
    nodemap.put("nodes", nodelist);
    return nodemap;
  }

  @Override
  public Map<String, List<? extends K8sObject>> getAllNamespacedPods(String podType) throws ApiException {

    Map<String, List<? extends K8sObject>> all = new HashMap<>();

    // all namespaces
    all.put("namespaces", getAllNamespace());

    // all pods
    V1PodList v1PodList = coreV1Api.listPodForAllNamespaces(null, null, null, null, null, null, null, null, null);
    // if (podType.equals(ObjectType.ALL.getFullname())) {
    List<Pod> pods = Pod.v1PodListToPodList(v1PodList);
    all.put("pods", pods);
    // }

    // // all deployments
    // else if (podType.equals(ObjectType.DEPLOY.getFullname())) {
    //   V1DeploymentList v1DeploymentList = appsV1Api.listDeploymentForAllNamespaces(null, null, null, null, null, null, null, null, null);
    //   all.put("deployments", Pod.v1PodListToPodList(v1PodList, v1DeploymentList));
    // }

    // // all statefulSets
    // else if (podType.equals(ObjectType.STS.getFullname())) {
    //   V1StatefulSetList v1StatefulSetList = appsV1Api.listStatefulSetForAllNamespaces(null, null, null, null, null, null, null, null, null);
    //   all.put("statefulsets", Pod.v1PodListToPodList(v1PodList, v1StatefulSetList));
    // }

    // // all daemonSets
    // else if (podType.equals(ObjectType.DS.getFullname())) {
    //   V1DaemonSetList v1DaemonSetList = appsV1Api.listDaemonSetForAllNamespaces(null, null, null, null, null, null, null, null, null);
    //   all.put("daemonsets", Pod.v1PodListToPodList(v1PodList, v1DaemonSetList));
    // }

    return all;
  }

  @Override
  public Map<String, List<? extends K8sObject>> getSpecifiedNamespacedPods(String namespaceName, String podType) throws ApiException {

    Map<String, List<? extends K8sObject>> namespace = new HashMap<>();

    V1PodList v1PodList = coreV1Api.listNamespacedPod(namespaceName, null, null, null, null, null, null, null, null, null);
    // all pods
    if (podType.equals(ObjectType.ALL.getFullname())) {
      List<Pod> pods = Pod.v1PodListToPodList(v1PodList);
      namespace.put("pods", pods);
    }

    else if (podType.equals(ObjectType.DEPLOY.getFullname())) {
      V1DeploymentList v1DeploymentList = appsV1Api.listNamespacedDeployment(namespaceName, null, null, null, null, null, null, null, null, null);
      namespace.put("deployments", Pod.v1PodListToPodList(v1PodList, v1DeploymentList));
    }

    else if (podType.equals(ObjectType.STS.getFullname())) {
      V1StatefulSetList v1StatefulSetList = appsV1Api.listNamespacedStatefulSet(namespaceName, null, null, null, null, null, null, null, null, null);
      namespace.put("statefulSets", Pod.v1PodListToPodList(v1PodList, v1StatefulSetList));
    }

    else if (podType.equals(ObjectType.DS.getFullname())) {
      V1DaemonSetList v1DaemonSetList = appsV1Api.listNamespacedDaemonSet(namespaceName, null, null, null, null, null, null, null, null, null);
      namespace.put("daemonSets", Pod.v1PodListToPodList(v1PodList, v1DaemonSetList));
    }

    return namespace;
  }

  @Override
	public Map<String, List<? extends K8sObject>> selectPod(String podType, String objectName) throws ApiException {

    Map<String, List<? extends K8sObject>> pod = new HashMap<>();

    // all namespaces
    pod.put("namespaces", getAllNamespace());

    V1PodList v1PodList = coreV1Api.listPodForAllNamespaces(null, null, null, null, null, null, null, null, null);

    // all pods
    if (podType.equals(ObjectType.ALL.getFullname())) {
      List<Pod> pods = Pod.v1PodListToPodList(v1PodList);
      pod.put("pods", pods);
    }

    // all deployments
    else if (podType.equals(ObjectType.DEPLOY.getFullname())) {
      V1DeploymentList v1DeploymentList = appsV1Api.listDeploymentForAllNamespaces(null, null, null, null, null, null, null, null, null);
      pod.put("deployments", Pod.v1PodListToPodList(v1PodList, v1DeploymentList));
    }

    // all statefulSets
    else if (podType.equals(ObjectType.STS.getFullname())) {
      V1StatefulSetList v1StatefulSetList = appsV1Api.listStatefulSetForAllNamespaces(null, null, null, null, null, null, null, null, null);
      pod.put("statefulSets", Pod.v1PodListToPodList(v1PodList, v1StatefulSetList));
    }

    // all daemonSets
    else if (podType.equals(ObjectType.DS.getFullname())) {
      V1DaemonSetList v1DaemonSetList = appsV1Api.listDaemonSetForAllNamespaces(null, null, null, null, null, null, null, null, null);
      pod.put("daemonSets", Pod.v1PodListToPodList(v1PodList, v1DaemonSetList));
    }

    return pod;
  }

  /**
   * https://github.com/kubernetes-client/java/issues/880#issuecomment-597347284
   *
   * Basically delete methods in Kubernetes can return one of two different objects.
   * There isn't a really great way to handle this in a language like Java that can only have a single return type.
   * The only work around is to catch the exception.
   *
   */
  @Override
  public void deleteSpecifiedNamespacedPods(String namespaceName, String podType, String podName) throws ApiException {
    log.debug("namespaceName : {}", namespaceName);
    log.debug("podType : {}", podType);
    log.debug("podName : {}", podName);

    V1Status status = null;

    if (podType.equals(ObjectType.ALL.getFullname())) {
      try {
        status = coreV1Api.deleteNamespacedPod(podName, namespaceName, null, null, null, null, null, null);
      } catch(JsonSyntaxException e) {
        e.printStackTrace();
      }
      log.debug("delete status : {}", status);
      return;
    }

    if (podType.equals(ObjectType.DS.getFullname())) {
      try {
        status = appsV1Api.deleteNamespacedDaemonSet(podName, namespaceName, null, null, null, null, null, null);
      } catch(JsonSyntaxException e) {
        e.printStackTrace();
      }
      log.debug("delete status : {}", status);
      return;
    }

    if (podType.equals(ObjectType.STS.getFullname())) {
      try {
        status = appsV1Api.deleteNamespacedStatefulSet(podName, namespaceName, null, null, null, null, null, null);
      } catch(JsonSyntaxException e) {
        e.printStackTrace();
      }
      log.debug("delete status : {}", status);
      return;
    }

    if (podType.equals(ObjectType.DEPLOY.getFullname())) {
      try {
        status = appsV1Api.deleteNamespacedDeployment(podName, namespaceName, null, null, null, null, null, null);
      } catch(JsonSyntaxException e) {
        e.printStackTrace();
      }
      log.debug("delete status : {}", status);
      return;
    }

    // appsV1Api.deleteNamespacedDaemonSet(podName, namespaceName, null, null, null, null, null, null);
    log.debug("delete status : {}", status);
  }

  @Override
  public Map<String, List<? extends K8sObject>> getServiceList(String namespaceName) throws ApiException {
    Map<String, List<? extends K8sObject>> service = new HashMap<>();
    service.put("namespaces", getAllNamespace());

    V1ServiceList v1ServiceList =
      namespaceName.equals(ObjectType.ALL.getFullname())
        ? coreV1Api.listServiceForAllNamespaces(null, null, null, null, null, null, null, null, null)
        : coreV1Api.listNamespacedService(namespaceName, null, null, null, null, null, null, null, null, null);
    service.put("services", Service.v1ServiceListToServiceList(v1ServiceList));

    return service;
  }

  @Override
  public Map<String, List<? extends K8sObject>> getStorageList(String namespaceName) throws ApiException {
    Map<String, List<? extends K8sObject>> storage = new HashMap<>();
    storage.put("namespaces", getAllNamespace());

    V1PersistentVolumeClaimList v1PvcList =
      namespaceName.equals(ObjectType.ALL.getFullname())
      ? coreV1Api.listPersistentVolumeClaimForAllNamespaces(null, null, null, null, null, null, null, null, null)
      : coreV1Api.listNamespacedPersistentVolumeClaim(namespaceName, null, null, null, null, null, null, null, null, null);
    V1PersistentVolumeList v1PvList = coreV1Api.listPersistentVolume(null, null, null, null, null, null, null, null, null);
    storage.put("persistentVolumeClaims", PersistentVolumeClaim.v1PVCListToPVCList(v1PvcList, v1PvList));

    return storage;
  }

  @Override
  public Node readNodeInfo(String nodeName) throws ApiException {
    V1Node v1Node = coreV1Api.readNode(nodeName, null, null, null);
    return Node.v1NodeToNode(v1Node);
  }

  @Override
  public List<Pod> readPodInfoByNode(String nodeName) throws ApiException {
    V1PodList v1PodList = coreV1Api.listPodForAllNamespaces(null, null, null, null, null, null, null, null, null);
    return Pod.v1PodListToPodList(v1PodList);
  }

  @Override
  public Map<String, Pod> readPodInfo(String namespaceName, String podName) throws ApiException {
    Map<String, Pod> all = new HashMap<>();
    V1Pod v1Pod = coreV1Api.readNamespacedPod(podName, namespaceName, null, null, null);
    all.put("pod", Pod.v1PodToPod(v1Pod));
    return all;
  }

  @Override
  public Service readServiceInfo(String namespaceName, String serviceName) throws ApiException {
    V1Service v1Service = coreV1Api.readNamespacedService(serviceName, namespaceName, null, null, null);
    return Service.v1ServiceToKService(v1Service);
  }

  @Override
  public PersistentVolumeClaim readPVCInfo(String namespaceName, String pvcName) throws ApiException {
    V1PersistentVolumeClaim v1Pvc = coreV1Api.readNamespacedPersistentVolumeClaim(pvcName, namespaceName, null, null, null);
    return PersistentVolumeClaim.v1PVCtoPVC(v1Pvc);
  }

}