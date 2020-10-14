package com.wizontech.manoportal.skt.model;

import com.google.gson.Gson;
import com.google.gson.JsonObject;

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
public class SKTApplications {
  private SKTApplication[] applications;

  public static SKTApplications deserialize(JsonObject json) {
    Gson gson = new Gson();
    return gson.fromJson(json, SKTApplications.class);
  }
}
