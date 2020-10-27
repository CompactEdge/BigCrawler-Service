package com.wizontech.manoportal.util;

import java.io.IOException;
import java.net.URL;

import com.google.gson.JsonObject;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Component;

// @lombok.extern.slf4j.Slf4j
@Component
public class MonitoringUtil {

  @Value("${prometheus.url}")
  private String prometheusURL;
  @Value("${prometheus.api}")
  private String prometheusAPI;

  public JsonObject fromPromQL(String query) throws IOException {
    String queryType = "query?query=";
    URL url = new URL(prometheusURL + prometheusAPI + queryType + NewRequest.encode(query));
    return NewRequest.openConnection(url, HttpMethod.GET);
  }

  public JsonObject fromPromQL(String query, String start, String end, String step) throws IOException {
    String queryType = "query_range?query=";

    StringBuilder range = new StringBuilder();
    if (start != null && end != null && step != null) {
      range.append("&start=" + start);
      range.append("&end=" + end);
      range.append("&step=" + step);
    }

    URL url = new URL(prometheusURL + prometheusAPI + queryType + NewRequest.encode(query) + (range.toString() != null ? range.toString() : ""));
    return NewRequest.openConnection(url, HttpMethod.GET);
  }

}