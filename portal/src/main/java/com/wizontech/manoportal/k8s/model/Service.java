package com.wizontech.manoportal.k8s.model;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.joda.time.DateTime;

import io.kubernetes.client.openapi.models.V1ObjectMeta;
import io.kubernetes.client.openapi.models.V1Service;
import io.kubernetes.client.openapi.models.V1ServiceList;
import io.kubernetes.client.openapi.models.V1ServiceSpec;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
@Builder
public class Service extends K8sObject {
  // metadata
  private String name;
  private String namespace;
  private DateTime creationTime;
  private String uid;
  private List<String> labels;

  // resource information
  private String type;
  private String clusterIp;
  private String sessionAffinity;
  private List<String> selectors;

  // endpoints
  private String host;
  // private List<Port> ports;
  private String ports;
  private String node;
  private String ready;

  // pods
  // events

  public static List<Service> v1ServiceListToServiceList(V1ServiceList v1ServiceList) {
    List<Service> services = new ArrayList<>();

    for (V1Service v1Service : v1ServiceList.getItems()) {
      V1ObjectMeta v1ServiceMetadata = v1Service.getMetadata();
      V1ServiceSpec v1ServiceSpec = v1Service.getSpec();

      List<String> labels = getLabels(v1ServiceMetadata.getLabels());
      List<String> selectors = getLabels(v1ServiceSpec.getSelector());
      String port = getPorts(v1ServiceSpec);

      services.add(
        Service.builder()
          .name(v1ServiceMetadata.getName())
          .namespace(v1ServiceMetadata.getNamespace())
          .labels(labels)
          .type(v1ServiceSpec.getType())
          .clusterIp(v1ServiceSpec.getClusterIP())
          .selectors(selectors)
          .ports(port)
          .build()
      );
    }
    return services;
  }

  public static Service v1ServiceToKService(V1Service v1Service) {
    V1ObjectMeta v1ServiceMetadata = v1Service.getMetadata();
    V1ServiceSpec v1ServiceSpec = v1Service.getSpec();

    List<String> labels = getLabels(v1ServiceMetadata.getLabels());
    List<String> selectors = getLabels(v1ServiceSpec.getSelector());
    String port = getPorts(v1ServiceSpec);

    return Service.builder()
      .name(v1ServiceMetadata.getName())
      .namespace(v1ServiceMetadata.getNamespace())
      .creationTime(v1ServiceMetadata.getCreationTimestamp())
      .uid(v1ServiceMetadata.getUid())
      .labels(labels)
      .type(v1ServiceSpec.getType())
      .clusterIp(v1ServiceSpec.getClusterIP())
      .sessionAffinity(v1ServiceSpec.getSessionAffinity())
      .selectors(selectors)
      .host(null)
      .ports(port)
      .node(null)
      .ready(null)
      .build();
  }

  public static List<String> getLabels(Map<String, String> labelMap) {
    if (labelMap == null) return null;
    else return labelMap.entrySet().stream()
          .map(e -> e.getKey() + "=" + e.getValue())
          .collect(Collectors.toList());
  }

  public static String getPorts(V1ServiceSpec v1ServiceSpec) {
    if (v1ServiceSpec.getPorts() == null) return null;
    else return Port.v1PortListToPortList(v1ServiceSpec.getPorts()).stream()
          .map(e -> e.getPort() + (v1ServiceSpec.getType().equals("NodePort") ? ":" + e.getNodePort() : "") + "/" + e.getProtocol())
          .collect(Collectors.joining(", "));
  }
}