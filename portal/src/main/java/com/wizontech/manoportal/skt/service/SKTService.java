package com.wizontech.manoportal.skt.service;

import java.io.IOException;

import com.google.gson.JsonObject;

public interface SKTService {

  public JsonObject postAuth() throws IOException;

  public JsonObject listDataCenter(String token) throws IOException;

  public JsonObject listRegion(String token) throws IOException;

  public JsonObject listApplication() throws IOException;

}
