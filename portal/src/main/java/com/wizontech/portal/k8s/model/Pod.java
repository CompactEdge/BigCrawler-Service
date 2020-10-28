package com.wizontech.portal.k8s.model;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.joda.time.DateTime;

import io.kubernetes.client.openapi.models.V1ContainerStatus;
import io.kubernetes.client.openapi.models.V1DaemonSet;
import io.kubernetes.client.openapi.models.V1DaemonSetList;
import io.kubernetes.client.openapi.models.V1Deployment;
import io.kubernetes.client.openapi.models.V1DeploymentList;
import io.kubernetes.client.openapi.models.V1ObjectMeta;
import io.kubernetes.client.openapi.models.V1OwnerReference;
import io.kubernetes.client.openapi.models.V1Pod;
import io.kubernetes.client.openapi.models.V1PodCondition;
import io.kubernetes.client.openapi.models.V1PodList;
import io.kubernetes.client.openapi.models.V1PodSpec;
import io.kubernetes.client.openapi.models.V1PodStatus;
import io.kubernetes.client.openapi.models.V1StatefulSet;
import io.kubernetes.client.openapi.models.V1StatefulSetList;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

// @lombok.extern.slf4j.Slf4j
@Getter
@Setter
@ToString
@Builder
public class Pod extends K8sObject {

  /* Dashboard Info */
  private String serviceAccount;

  /* Additional Info */
  // metadata
  private String name;
  private String namespace;
  private DateTime creationTime;
  private String uid;
  private List<String> labels;
  // resource information
  private String node;
  private String running;
  private String ip;
  private String qosClass;
  private Integer restarts;
  // conditions
  private List<V1PodCondition> conditions;
  // controlled by
  private List<V1OwnerReference> controller;
  private String pods;
  // pvc
  // event
  // containers
  private List<Container> containers;

  /**
   * 모든 Pods
   */
  public static List<Pod> v1PodListToPodList(V1PodList v1PodList) {
    return convertList(v1PodList.getItems());
  }

  /**
   * V1DeploymentList의 Pods
   */
  public static List<Pod> v1PodListToPodList(V1PodList v1PodList, V1DeploymentList v1DeploymentList) {

    List<V1Pod> deploymentPods = new ArrayList<>();
    for (V1Pod v1Pod : v1PodList.getItems()) {
      for (V1Deployment v1Deployment : v1DeploymentList.getItems()){
        Map<String, String> deploymentLabels = v1Deployment.getSpec().getTemplate().getMetadata().getLabels();
        Map<String, String> podLabels = v1Pod.getMetadata().getLabels();

        boolean matchLabel =
          deploymentLabels.entrySet()
            .stream()
            .allMatch(e -> e.getValue().equals(podLabels.get(e.getKey())));

        if (matchLabel) {
          deploymentPods.add(v1Pod);
        }
      }
    }
    return convertList(deploymentPods);
  }

  /**
   * V1StatefulSetList의 Pods
   */
  public static List<Pod> v1PodListToPodList(V1PodList v1PodList, V1StatefulSetList v1StatefulSetList) {

    List<V1Pod> statefulSetPods = new ArrayList<>();
    for (V1Pod v1Pod : v1PodList.getItems()) {
      for (V1StatefulSet v1StatefulSet : v1StatefulSetList.getItems()){
        Map<String, String> statefulSetLabels = v1StatefulSet.getSpec().getTemplate().getMetadata().getLabels();
        Map<String, String> podLabels = v1Pod.getMetadata().getLabels();

        boolean matchLabel =
          statefulSetLabels.entrySet()
            .stream()
            .allMatch(e -> e.getValue().equals(podLabels.get(e.getKey())));

        if (matchLabel) {
          statefulSetPods.add(v1Pod);
        }
      }
    }
    return convertList(statefulSetPods);
  }

  /**
   * V1DaemonSetList의 Pods
   */
  public static List<Pod> v1PodListToPodList(V1PodList v1PodList, V1DaemonSetList v1DaemonSetList) {

    List<V1Pod> daemonSetPods = new ArrayList<>();
    for (V1Pod v1Pod : v1PodList.getItems()) {
      for (V1DaemonSet v1DaemonSet : v1DaemonSetList.getItems()){
        Map<String, String> daemonSetLabels = v1DaemonSet.getSpec().getTemplate().getMetadata().getLabels();
        Map<String, String> podLabels = v1Pod.getMetadata().getLabels();

        boolean matchLabel =
          daemonSetLabels.entrySet()
            .stream()
            .allMatch(e -> e.getValue().equals(podLabels.get(e.getKey())));

        if (matchLabel) {
          daemonSetPods.add(v1Pod);
        }
      }
    }
    return convertList(daemonSetPods);
  }

  /**
   * 특정 Node의 Pods
   */
  public static List<Pod> v1PodListToPodListByNodeName(V1PodList v1PodList, String nodeName) {
    List<V1Pod> v1Pods = v1PodList.getItems()
      .stream()
      .filter(e -> e.getSpec().getNodeName().equals(nodeName))
      .collect(Collectors.toList());
    return convertList(v1Pods);
  }

  public static List<Pod> convertList(List<V1Pod> v1PodList) {
    List<Pod> pods = new ArrayList<>();

    for (V1Pod v1pod : v1PodList) {
      // log.debug("========================================================================");
      V1ObjectMeta v1PodMetadata = v1pod.getMetadata();
      V1PodStatus v1PodStatus = v1pod.getStatus();
      List<V1ContainerStatus> containerStatuses = v1PodStatus.getContainerStatuses();
      V1PodSpec v1PodSpec = v1pod.getSpec();

      // pod's container info
      Integer readyContainer = 0;
      List<Container> containers = new ArrayList<>();
      if (containerStatuses != null) {
        for (int i = 0; i < containerStatuses.size(); i++) {
          Container container =
            Container.builder()
              .image(containerStatuses.get(i).getImage())
              .name(v1PodSpec.getContainers().get(i).getName())
              .ready(containerStatuses.get(i).getReady())
              .restartCount(containerStatuses.get(i).getRestartCount())
              .build();

          if (containerStatuses.get(i).getState().getRunning() != null) {
            container.setRunningStartedAt(containerStatuses.get(i).getState().getRunning().getStartedAt());
          }

          if (containerStatuses.get(i).getState().getTerminated() != null) {
            container.setTerminatedFinishedAt(containerStatuses.get(i).getState().getTerminated().getFinishedAt());
          }

          if (containerStatuses.get(i).getState().getWaiting() != null) {
            container.setWaitingReason(containerStatuses.get(i).getState().getWaiting().getReason());
          }

          containers.add(container);
          if (containerStatuses.get(i).getReady()) {
            readyContainer++;
          }
        }
      }
      if (containers.isEmpty()) containers.add(Container.builder().image("-").build());
      // log.debug("{}", containers);

      String status = getRunningStatus(v1PodStatus);
      List<String> labels = getLabels(v1PodMetadata.getLabels());
      // log.debug("pod name : {}", v1PodMetadata.getName());
      // if (v1PodMetadata.getName().contains("prom")) {
      //   log.debug("status : {}", v1PodStatus);
      // }

      pods.add(
        Pod.builder()
          // .cluster(metadata.getClusterName())
          .name(v1PodMetadata.getName())
          .namespace(v1PodMetadata.getNamespace())
          .serviceAccount(v1PodSpec.getServiceAccountName())
          .labels(labels)
          .pods(String.valueOf(readyContainer + " / " + containers.size()))
          .restarts(v1PodStatus.getContainerStatuses() == null ? 0 : v1PodStatus.getContainerStatuses().get(0).getRestartCount())
          .running(status)
          .creationTime(v1PodStatus.getStartTime())
          .ip(v1PodStatus.getPodIP() == null ? "-" : v1PodStatus.getPodIP())
          .containers(containers)
          .build()
        );
    }

    return pods;
  }

  public static Pod v1PodToPod(V1Pod v1Pod) {
    V1ObjectMeta v1PodMetadata = v1Pod.getMetadata();
    V1PodSpec v1PodSpec = v1Pod.getSpec();
    V1PodStatus v1PodStatus = v1Pod.getStatus();

    String status = getRunningStatus(v1PodStatus);
    List<String> labels = getLabels(v1PodMetadata.getLabels());
    List<Container> containers = getContainers(v1PodStatus.getContainerStatuses());
    // log.debug("{}", v1PodStatus.getContainerStatuses());

    return Pod.builder()
      .name(v1PodMetadata.getName())
      .namespace(v1PodMetadata.getNamespace())
      .serviceAccount(v1PodSpec.getServiceAccountName())
      .creationTime(v1PodStatus.getStartTime())
      .uid(v1PodMetadata.getUid())
      .labels(labels)
      .node(v1PodSpec.getNodeName())
      .running(status)
      .ip(v1PodStatus.getPodIP())
      .qosClass(v1PodStatus.getQosClass())
      .restarts(v1PodStatus.getContainerStatuses() == null ? 0 : v1PodStatus.getContainerStatuses().get(0).getRestartCount())
      .conditions(v1PodStatus.getConditions())
      .controller(v1PodMetadata.getOwnerReferences())
      .containers(containers)
      .build();
  }

  public static List<String> getLabels(Map<String, String> labelMap) {
    if (labelMap == null) return null;
    else return labelMap.entrySet().stream()
                  .map(e -> e.getKey() + "=" + e.getValue())
                  .collect(Collectors.toList());
  }

  // TODO
  public static String getRunningStatus(V1PodStatus podStatus) {
    // log.debug("podStatus.getConditions() : {}", podStatus.getConditions());
    // log.debug("podStatus.getContainerStatuses() : {}", podStatus.getContainerStatuses());
    if (podStatus.getConditions() == null) return "-";

    return podStatus.getConditions().stream()
      .filter(condition -> {
        if (condition.getType().equals("Ready"))
          return true;
        else if (condition.getType().equals("PodScheduled"))
          return true;
        else
          return false;
      })
      .map(ready -> ready.getStatus().equals("True")
                      ? podStatus.getPhase()
                      : (podStatus.getPhase().equals("Running")
                          ? "Fail"
                          : podStatus.getPhase()
                        ))
      .findAny()
      .orElse("Fail");
  }

  public static List<Container> getContainers(List<V1ContainerStatus> containerStatuses) {
    if (containerStatuses == null) { return null; }
    else {
      List<Container> containers = new ArrayList<>();
      containerStatuses.forEach(e -> {
        Container container = Container.builder().name(e.getName()).image(e.getImage()).build();
        containers.add(container);
      });
      return containers;
    }
  }

}
