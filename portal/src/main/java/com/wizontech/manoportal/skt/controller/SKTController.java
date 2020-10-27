package com.wizontech.manoportal.skt.controller;

import java.io.IOException;
import java.time.Instant;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.TimeZone;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.wizontech.manoportal.skt.model.SKTApplications;
import com.wizontech.manoportal.skt.model.SKTDataCenters;
import com.wizontech.manoportal.skt.model.SKTRegions;
import com.wizontech.manoportal.skt.service.SKTService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import lombok.RequiredArgsConstructor;

@lombok.extern.slf4j.Slf4j
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
@RequestMapping("/skt")
@Controller
public class SKTController {

  private final SKTService sktService;

  @ResponseBody
  @PostMapping("/auth")
  public ResponseEntity<String> postAuth(HttpServletRequest request, HttpServletResponse response) throws IOException {
    log.debug("POST auth");
    Cookie[] cookies = request.getCookies();
    if (cookies != null) {
      for (Cookie cookie : cookies) {
        if (cookie.getName().equals("token")) {
          log.debug("\"{\"token\":\"" + cookie.getValue() + "\"}\"");

          // TODO: Utilization
          String[] splitToken = cookie.getValue().split("\\.");
          String base64EncodedHeader = splitToken[0];
          String base64EncodedBody = splitToken[1];
          // String base64EncodedSignature = splitToken[2];

          String header = new String(Base64.getDecoder().decode(base64EncodedHeader));
          log.debug("~~~~~~~~~ JWT Header ~~~~~~~");
          log.debug("JWT Header : {}", header);
          String body = new String(Base64.getDecoder().decode(base64EncodedBody));
          log.debug("~~~~~~~~~ JWT Body ~~~~~~~");
          log.debug("JWT Body : {}", body);
          // String sign = new String(Base64.getDecoder().decode(base64EncodedSignature));
          // log.debug("~~~~~~~~~ JWT Signature ~~~~~~~");
          // log.debug("JWT Sign : {}", sign);

          long epochExp = Long.parseLong(JsonParser.parseString(body).getAsJsonObject().get("exp").getAsString());
          LocalDateTime expiredTime = LocalDateTime.ofInstant(Instant.ofEpochMilli(epochExp * 1000), TimeZone.getDefault().toZoneId());
          log.debug("JWT expiredTime : {}", expiredTime);

          log.debug("epochExp : {}", epochExp);
          long epochNow = Instant.now().getEpochSecond();
          log.debug("epochNow : {}", epochNow);

          // 이미 토큰이 만료되었다면
          if (epochNow > epochExp) {
            log.debug("need to create token");
            break;
          }
          log.debug("return existing token");
          return new ResponseEntity<>("\"" + cookie.getValue() + "\"", HttpStatus.OK);
        }
      }
    }

    JsonObject json = sktService.postAuth();
    if (json != null) {
      log.debug("json.toString() : {}", json.toString());
      if (json.has("token")) {
        Cookie cookie = new Cookie("token", json.get("token").getAsString());
        response.addCookie(cookie);
      }
      return new ResponseEntity<>(json.toString(), HttpStatus.OK);
    } else {
      return new ResponseEntity<>("", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @ResponseBody
  @GetMapping("/datacenters")
  public ResponseEntity<SKTDataCenters> listDatacenter(@CookieValue(value = "token", defaultValue = "") String token) throws IOException {
    log.debug("GET datacenters");
    JsonObject json = sktService.listDataCenter(token);
    log.debug(json.toString());
    SKTDataCenters dc = SKTDataCenters.deserialize(json);
    return new ResponseEntity<>(dc, HttpStatus.OK);
  }

  @ResponseBody
  @GetMapping("/regions")
  public ResponseEntity<SKTRegions> listRegion(@CookieValue(value = "token", defaultValue = "") String token) throws IOException {
    log.debug("GET regions");
    JsonObject json = sktService.listRegion(token);
    log.debug(json.toString());
    SKTRegions region = SKTRegions.deserialize(json);
    return new ResponseEntity<>(region, HttpStatus.OK);
  }

  @ResponseBody
  @GetMapping("/apps")
  public ResponseEntity<SKTApplications> listApplication() throws IOException {
    log.debug("GET apps");
    JsonObject json = sktService.listApplication();
    log.debug(json.toString());
    SKTApplications app = SKTApplications.deserialize(json);
    return new ResponseEntity<>(app, HttpStatus.OK);
  }

}