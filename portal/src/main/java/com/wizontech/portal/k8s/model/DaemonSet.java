package com.wizontech.portal.k8s.model;

import java.util.ArrayList;
import java.util.List;

import io.kubernetes.client.openapi.models.V1DaemonSet;
import io.kubernetes.client.openapi.models.V1DaemonSetList;
import io.kubernetes.client.openapi.models.V1DaemonSetStatus;
import io.kubernetes.client.openapi.models.V1ObjectMeta;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
@Builder
public class DaemonSet extends K8sObject {
  private String name;
  private String namespace;
  private String pods;
  private V1DaemonSetStatus status;
  private String running;

  public static List<DaemonSet> v1DaemonSetListToDaemonSetList(V1DaemonSetList v1DaemonSetList) {
    List<DaemonSet> daemonSets = new ArrayList<>();
    for (V1DaemonSet v1DaemonSet : v1DaemonSetList.getItems()) {
      V1ObjectMeta metadata = v1DaemonSet.getMetadata();
      V1DaemonSetStatus daemonSetStatus = v1DaemonSet.getStatus();

      StringBuilder available = new StringBuilder();
      if (daemonSetStatus.getNumberUnavailable() == null || daemonSetStatus.getNumberUnavailable() == 0) {
        available.append("Running");
      } else {
        available.append("Fail");
      }

      daemonSets.add(
        DaemonSet.builder()
          .name(metadata.getName())
          .namespace(metadata.getNamespace())
          .pods(String.valueOf(daemonSetStatus.getNumberReady() + " / " + daemonSetStatus.getNumberAvailable()))
          .status(daemonSetStatus)
          .running(available.toString())
          .build()
      );
    }

    return daemonSets;
  }
}