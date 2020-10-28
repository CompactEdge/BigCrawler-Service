package com.wizontech.portal.k8s.model;

import java.util.ArrayList;
import java.util.List;

import io.kubernetes.client.openapi.models.V1Container;
import io.kubernetes.client.openapi.models.V1ObjectMeta;
import io.kubernetes.client.openapi.models.V1StatefulSet;
import io.kubernetes.client.openapi.models.V1StatefulSetList;
import io.kubernetes.client.openapi.models.V1StatefulSetSpec;
import io.kubernetes.client.openapi.models.V1StatefulSetStatus;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
@Builder
public class StatefulSet extends K8sObject {
  private String name;
  private String namespace;
  private String pods;
  private String running;

  private List<Container> containers;

  public static List<StatefulSet> v1StatefulSetListToStatefulSetList(V1StatefulSetList v1StatefulSetList) {
    // log.debug("========================================================================");
    List<StatefulSet> statefulSets = new ArrayList<>();
    for (V1StatefulSet v1StatefulSet : v1StatefulSetList.getItems()) {
      V1ObjectMeta metadata = v1StatefulSet.getMetadata();
      V1StatefulSetStatus statefulSetStatus = v1StatefulSet.getStatus();
      V1StatefulSetSpec statefulSetSpec = v1StatefulSet.getSpec();

      StringBuilder status = new StringBuilder();
      if (statefulSetStatus.getCollisionCount() == null || statefulSetStatus.getCollisionCount() == 0) {
        status.append("Running");
      } else {
        status.append("Fail");
      }

      List<V1Container> containerList = statefulSetSpec.getTemplate().getSpec().getContainers();
      List<Container> containers = new ArrayList<>();
      for (int i = 0; i < containerList.size(); i++) {
        Container container =
          Container.builder()
            .image(containerList.get(i).getImage())
            .name(containerList.get(i).getName())
            .build();
        containers.add(container);
      }

      statefulSets.add(
        StatefulSet.builder()
          .name(metadata.getName())
          .namespace(metadata.getNamespace())
          .pods(String.valueOf(statefulSetStatus.getReadyReplicas() + " / " + statefulSetStatus.getReplicas()))
          .running(status.toString())
          .containers(containers)
          .build()
      );
    }

    return statefulSets;
  }
}