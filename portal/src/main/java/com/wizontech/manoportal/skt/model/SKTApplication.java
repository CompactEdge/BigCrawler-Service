package com.wizontech.manoportal.skt.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

// TODO: property 정리
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class SKTApplication {
  private String id;
  private String org_id;
  private String region_id;
  private String catalog_id;
  private String name;
  private String datacenter_id;
  private String status;
  // Components            []component           `json:"components,omitempty"`
  // ConnectivityDetection connectivityDetection `json:"connectivity_detection"`
  private String app_pkg_name;
  // DNS                   *dns                  `json:"dns,omitempty"`
  private String mepm_version;
  // Rules                 []rule                `json:"rule,omitempty"`
  private boolean enabled_rule;
  private String deployment_type;
}
