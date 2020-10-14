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
public class SKTServer {
  // @JsonProperty(value = "hwuuid") // not working
  private String hwuuid;
  private String ipaddress;
  private String disk;
  private String memory;
  private String servertype;
  private String name;
  private int cpu;
  private String id;
  private String iloipaddress;
}
