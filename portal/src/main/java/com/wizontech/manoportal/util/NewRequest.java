package com.wizontech.manoportal.util;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.UnsupportedEncodingException;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.google.gson.JsonPrimitive;

import org.springframework.http.HttpMethod;

@lombok.extern.slf4j.Slf4j
public class NewRequest {

  private NewRequest() {
    throw new IllegalStateException("Utility class");
  }

  public static String encode(String query) {
    try {
      return URLEncoder.encode(query, StandardCharsets.UTF_8.toString());
    } catch (UnsupportedEncodingException ex) {
      throw new RuntimeException(ex.getCause());
    }
  }

  // https://www.baeldung.com/java-http-request
  public static JsonObject openConnection(URL url, HttpMethod method) throws IOException {
    // try-with-resources
    HttpURLConnection conn = (HttpURLConnection) url.openConnection();
    log.debug("method.name() : {}", method.name());
    conn.setRequestMethod(method.name());
    conn.setDoOutput(true); // URL connection for output
    String token = conn.getHeaderField("X-Auth-Token");

    int responsecode = conn.getResponseCode();
    log.debug("responsecode 1 : {}", responsecode);

    StringBuilder response = new StringBuilder();
    // error exists
    if (responsecode < 200 && responsecode > 300) {
      return JsonParser.parseString("{\"msg\": \"error\"}").getAsJsonObject();
    }
    // success
    else {
      // try-with-resources
      try (BufferedReader br = new BufferedReader(new InputStreamReader(conn.getInputStream(), StandardCharsets.UTF_8))) {
        String responseLine = null;
        while ((responseLine = br.readLine()) != null) {
          response.append(responseLine.trim());
        }
        log.debug("response.toString() : {}", response.toString());
      }

      JsonObject json = new JsonObject();
      if (!response.toString().equals("null")) {
        json = JsonParser.parseString(response.toString()).getAsJsonObject();
      }

      if (token != null) {
        json.add("token", new JsonPrimitive(token));
      }

      return json;
    }
  }

  public static JsonObject openConnection(URL url, HttpMethod method, String sktToken) throws IOException {
    HttpURLConnection conn = (HttpURLConnection) url.openConnection();
    conn.setRequestMethod(method.name());
    conn.setRequestProperty("X-Auth-Token", sktToken);
    conn.setDoOutput(true); // URL connection for output

    int responsecode = conn.getResponseCode();
    log.debug("responsecode 3 : {}", responsecode);

    StringBuilder response = new StringBuilder();
    if (responsecode < 200 && responsecode > 300) {
      return JsonParser.parseString("{\"msg\": \"error\"}").getAsJsonObject();
    } else {
      // try-with-resources
      try (BufferedReader br = new BufferedReader(new InputStreamReader(conn.getInputStream(), StandardCharsets.UTF_8))) {
        String responseLine = null;
        while ((responseLine = br.readLine()) != null) {
          response.append(responseLine.trim());
        }
        log.debug("response.toString() : {}", response.toString());
      }
      return JsonParser.parseString(response.toString()).getAsJsonObject();
    }
  }
}
