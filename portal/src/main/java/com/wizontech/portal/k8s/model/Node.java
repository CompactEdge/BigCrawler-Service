package com.wizontech.portal.k8s.model;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.joda.time.DateTime;

import io.kubernetes.client.custom.Quantity;
import io.kubernetes.client.openapi.ApiException;
import io.kubernetes.client.openapi.models.V1Node;
import io.kubernetes.client.openapi.models.V1NodeCondition;
import io.kubernetes.client.openapi.models.V1NodeList;
import io.kubernetes.client.openapi.models.V1NodeStatus;
import io.kubernetes.client.openapi.models.V1ObjectMeta;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

// @lombok.extern.slf4j.Slf4j
@Getter
@Setter
@ToString
@Builder
public class Node extends K8sObject {
  /* Dashboard Info */
  private String role;
  private String ready;
  // metadata
  private String name;
  private DateTime creationTime;
  private String uid;
  private List<String> labels;
  private String zoneRegion;
  private List<String> annotations;
  // resource information
  private String address;
  // system information
  private String machineId;
  private String systemUuid;
  private String bootId;
  private String kernelVersion;
  private String osImage;
  private String containerRuntimeVersion;
  private String kubeletVersion;
  private String kubeProxyVersion;
  private String operatingSystem;
  private String architecture;
  // allocation
  private String allocatableResources;
  private String capacityResources;
  // conditions
  private List<V1NodeCondition> conditions;
  // pods
  private List<Pod> pods;
  // events

  public static List<Node> v1NodeListToNodeList(V1NodeList v1NodeList) throws ApiException {
    List<Node> nodes = new ArrayList<>();

    for (V1Node v1Node : v1NodeList.getItems()) {
      V1ObjectMeta v1NodeMetadata = v1Node.getMetadata();
      V1NodeStatus v1NodeStatus = v1Node.getStatus();

      String role = getRole(v1NodeMetadata);
      List<String> labels = getLabels(v1NodeMetadata);
      StringBuilder ready = getReady(v1NodeStatus);
      String address = getAddress(v1NodeStatus);
      // List<String> test =
      //   Arrays.asList(
      //     "topology.kubernetes.io/region=seoul",
      //     "topology.kubernetes.io/zone=pangyo"
      //   );

      String zrStr = getZoneRegion(labels);

      nodes.add(
        Node.builder()
          .name(v1NodeMetadata.getName())
          .role(role)
          .labels(labels)
          .zoneRegion(zrStr)
          .ready(ready.toString())
          .allocatableResources(getResource(v1NodeStatus.getAllocatable()))
          .capacityResources(getResource(v1NodeStatus.getCapacity()))
          .address(address)
          .kernelVersion(v1NodeStatus.getNodeInfo().getKernelVersion())
          .build()
      );
    }

    return nodes;
  }

  public static Node v1NodeToNode(V1Node v1Node) {
    V1ObjectMeta v1NodeMetadata = v1Node.getMetadata();
    V1NodeStatus v1NodeStatus = v1Node.getStatus();

    List<String> labels = getLabels(v1NodeMetadata);
    String address = getAddress(v1NodeStatus);

    return Node.builder()
      .name(v1NodeMetadata.getName())
      .creationTime(v1NodeMetadata.getCreationTimestamp())
      .uid(v1NodeMetadata.getUid())
      .labels(labels)
      .address(address)
      .machineId(v1NodeStatus.getNodeInfo().getMachineID())
      .systemUuid(v1NodeStatus.getNodeInfo().getSystemUUID())
      .bootId(v1NodeStatus.getNodeInfo().getBootID())
      .kernelVersion(v1NodeStatus.getNodeInfo().getKernelVersion())
      .osImage(v1NodeStatus.getNodeInfo().getOsImage())
      .containerRuntimeVersion(v1NodeStatus.getNodeInfo().getContainerRuntimeVersion())
      .kubeletVersion(v1NodeStatus.getNodeInfo().getKubeletVersion())
      .kubeProxyVersion(v1NodeStatus.getNodeInfo().getKubeProxyVersion())
      .operatingSystem(v1NodeStatus.getNodeInfo().getOperatingSystem())
      .architecture(v1NodeStatus.getNodeInfo().getArchitecture())
      .conditions(v1NodeStatus.getConditions())
      .build();
  }

  public static String getRole(V1ObjectMeta nodeMetadata) {
    return nodeMetadata.getLabels().keySet()
      .stream()
      .filter(node -> node.contains("master"))
      .collect(Collectors.counting()) > 0
      ? "master"
      : "&lt;none&gt;";
  }

  public static List<String> getLabels(V1ObjectMeta nodeMetadata) {
    return nodeMetadata.getLabels().entrySet()
    .stream()
    .map(e -> e.getKey() + "=" + e.getValue())
    .collect(Collectors.toList());
  }

  public static String getAddress(V1NodeStatus v1NodeStatus) {
    return v1NodeStatus.getAddresses()
      .stream()
      .filter(e -> e.getType().equals("InternalIP"))
      .map(e -> e.getAddress())
      .collect(Collectors.joining(", "));
  }

  public static StringBuilder getReady(V1NodeStatus v1NodeStatus) {
    StringBuilder ready = new StringBuilder();
    for (V1NodeCondition condition : v1NodeStatus.getConditions() ) {
      if (condition.getType().equals("Ready")) {
        ready.append(condition.getStatus());
      }
    }
    return ready;
  }

  public static String getResource(Map<String, Quantity> map) {
    return map.entrySet()
      .stream()
      .filter(e -> e.getKey().equals("cpu") || e.getKey().equals("memory"))
      .map(e -> e.getKey() + " : " + e.getValue().getNumber() + " (" + e.getValue().getFormat() + ")")
      .collect(Collectors.joining(System.lineSeparator() + "<br>")).toString();
  }

  public static String getZoneRegion(List<String> labels) {
    StringBuilder zrStr = new StringBuilder();
    zrStr.append(labels.stream().filter(e -> e.contains("zone")).map(e -> e.split("=")).map(e -> e[1]).findAny().orElse("&lt;none&gt;"));
    zrStr.append("/");
    zrStr.append(labels.stream().filter(e -> e.contains("region")).map(e -> e.split("=")).map(e -> e[1]).findAny().orElse("&lt;none&gt;"));
    return zrStr.toString();
  }
}