package com.wizontech.manoportal.k8s.model;

import org.joda.time.DateTime;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
@Builder
public class Container {
  // pod's metadata - container statuses
  private String image;
  private Boolean ready;
  private Integer restartCount;
  private DateTime runningStartedAt;
  private DateTime terminatedFinishedAt;
  private String waitingReason;
  // pod's spec
  private Integer containerSize;
  private String name;
  private Integer port;
}