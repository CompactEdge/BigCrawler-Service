package com.wizontech.manoportal.skt.service;

import java.io.IOException;
import java.net.URL;

import com.google.gson.JsonObject;
import com.wizontech.manoportal.util.NewRequest;

import org.springframework.http.HttpMethod;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@org.springframework.stereotype.Service
public class SKTServiceImpl implements SKTService {

  @Override
  public JsonObject postAuth() throws IOException {
    URL url = new URL("http://127.0.0.1:7000/api/v1/createToken");
    return NewRequest.openConnection(url, HttpMethod.POST);
  }

  @Override
  public JsonObject listDataCenter(String token) throws IOException {
    URL url = new URL("http://127.0.0.1:7000/api/v1/getDatacenterAll");
    return NewRequest.openConnection(url, HttpMethod.GET, token);
  }

  @Override
  public JsonObject listRegion(String token) throws IOException {
    URL url = new URL("http://127.0.0.1:7000/api/v1/getRegion");
    return NewRequest.openConnection(url, HttpMethod.GET, token);
  }

  @Override
  public JsonObject listApplication() throws IOException {
    URL url = new URL("http://127.0.0.1:7000/api/v1/getAppAll");
    return NewRequest.openConnection(url, HttpMethod.GET);
  }
}
