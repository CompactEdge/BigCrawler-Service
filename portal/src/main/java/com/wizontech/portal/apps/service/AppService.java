package com.wizontech.portal.apps.service;

import java.io.IOException;
import java.util.Map;

import com.jcraft.jsch.JSchException;

public interface AppService {

  public Map<String, String> remoteSsh(String command) throws JSchException, IOException;

  public Map<String, String> install(String app) throws JSchException, IOException;

  public Map<String, String> delete(String app) throws JSchException, IOException;
}