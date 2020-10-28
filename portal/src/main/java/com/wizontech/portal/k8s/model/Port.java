package com.wizontech.portal.k8s.model;

import java.util.ArrayList;
import java.util.List;

import io.kubernetes.client.openapi.models.V1ServicePort;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
@Builder
public class Port extends K8sObject {
  private String name;
  private String nodePort;
  private String port;
  private String protocol;
  private String targetPort;

  public static List<Port> v1PortListToPortList(List<V1ServicePort> v1ServicePorts) {
    List<Port> ports = new ArrayList<>();

    for (V1ServicePort v1ServicePort : v1ServicePorts) {
      ports.add(
        Port.builder()
          .name(v1ServicePort.getName())
          .nodePort(String.valueOf(v1ServicePort.getNodePort()))
          .port(String.valueOf(v1ServicePort.getPort()))
          .protocol(v1ServicePort.getProtocol())
          .targetPort(String.valueOf(v1ServicePort.getTargetPort()))
          .build()
      );
    }

    return ports;
  }
}