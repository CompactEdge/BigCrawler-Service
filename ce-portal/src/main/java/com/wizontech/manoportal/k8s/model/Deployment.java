package com.wizontech.manoportal.k8s.model;

import java.util.ArrayList;
import java.util.List;

import io.kubernetes.client.openapi.models.V1Deployment;
import io.kubernetes.client.openapi.models.V1DeploymentCondition;
import io.kubernetes.client.openapi.models.V1DeploymentList;
import io.kubernetes.client.openapi.models.V1DeploymentSpec;
import io.kubernetes.client.openapi.models.V1DeploymentStatus;
import io.kubernetes.client.openapi.models.V1ObjectMeta;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
@Builder
public class Deployment extends K8sObject {
  private String name;
  private String namespace;
  private String pods;
  private String running;

  public static List<Deployment> v1DeploymentListToDeploymentList(V1DeploymentList v1DeploymentList) {
    List<Deployment> deployments = new ArrayList<>();
    for (V1Deployment v1Deployment : v1DeploymentList.getItems()) {
      // log.debug("========================================================================");
      V1ObjectMeta metadata = v1Deployment.getMetadata();
      V1DeploymentStatus deploymentStatus = v1Deployment.getStatus();
      V1DeploymentSpec deploymentSpec = v1Deployment.getSpec();

      StringBuilder status = new StringBuilder();
      for (V1DeploymentCondition condition : deploymentStatus.getConditions() ) {
        if (condition.getType().equals("Available")) {
          if (condition.getStatus().equals("True")) {
            status.append("Running");
          } else {
            status.append("Fail");
          }
        }
      }

      deployments.add(
        Deployment.builder()
          .name(metadata.getName())
          .namespace(metadata.getNamespace())
          .pods(String.valueOf((deploymentStatus.getReadyReplicas() != null ? deploymentStatus.getReadyReplicas() : 0) + " / " + deploymentSpec.getReplicas()))
          .running(status.toString())
          .build()
      );
    }

    return deployments;
  }
}