package com.wizontech.manoportal.k8s.model;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class Namespace extends K8sObject {
  private String name;
  private List<Pod> pods;
  private List<Deployment> deployments;
  private List<StatefulSet> statefulsets;
  private List<DaemonSet> daemonsets;
  private List<Service> services;
}