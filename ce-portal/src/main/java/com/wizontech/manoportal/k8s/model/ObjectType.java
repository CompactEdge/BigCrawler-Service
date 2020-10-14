package com.wizontech.manoportal.k8s.model;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum ObjectType {

  ALL("all"),
  DEPLOY("Deployment"),
  STS("StatefulSet"),
  DS("DaemonSet");

  private String fullname;
}