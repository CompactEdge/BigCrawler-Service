package com.wizontech.manoportal.skt.model;

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
public class SKTRegion {
  private String id;
  private String name;
  private String type;
  private String type_name;
  private String endpoint_url;
  private SKTDataCenter[] datacenter;
}
