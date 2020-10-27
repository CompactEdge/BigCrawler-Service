package com.wizontech.manoportal.skt.model;

import com.fasterxml.jackson.annotation.JsonInclude;

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
public class SKTDataCenter {
  @JsonInclude(value = JsonInclude.Include.NON_EMPTY)
  private SKTServer[] server;
  private String service_type;
  private double latitude;
  private double longitude;
  private String mepm_version;
  private String id;
  private String name;

  // TODO: Rename JsonProperty with Lombok
  // @JsonProperty("region_id")
  // private String regionId;
  @JsonInclude(value = JsonInclude.Include.NON_EMPTY)
  private String region_id;
  @JsonInclude(value = JsonInclude.Include.NON_EMPTY)
  private String region_name;
  @JsonInclude(value = JsonInclude.Include.NON_EMPTY)
  private String region_type;
  @JsonInclude(value = JsonInclude.Include.NON_EMPTY)
  private String region_type_name;
  private String deploy_type;
  private boolean highavailability;
}
