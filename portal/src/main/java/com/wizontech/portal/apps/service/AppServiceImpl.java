package com.wizontech.portal.apps.service;

import java.io.IOException;
import java.io.InputStream;
import java.util.HashMap;
import java.util.Map;

import com.jcraft.jsch.Channel;
import com.jcraft.jsch.ChannelExec;
import com.jcraft.jsch.JSch;
import com.jcraft.jsch.JSchException;
import com.jcraft.jsch.Session;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@lombok.extern.slf4j.Slf4j
@Service
public class AppServiceImpl implements AppService {

  @Value("${remote-shell.host}")
  private String host;
  @Value("${remote-shell.username}")
  private String username;
  @Value("${remote-shell.password}")
  private String password;
  private final int PORT = 22;

  public Map<String, String> remoteSsh(String command) throws JSchException, IOException {
    // Declaring output
    Map<String, String> json = new HashMap<>();

    // export REMOTE_SHELL_HOST="192.168.213.241"
    // printenv
    // unset REMOTE_SHELL_HOST
    // editor (VS Code, EClipse ...) reboot
    // for (Map.Entry<String, String> entry : System.getenv().entrySet()) {
    //   log.debug("{}={}", entry.getKey(), entry.getValue());
    // }
    // String host = System.getenv("REMOTE_SHELL_HOST");
    log.debug("host : {}", host);

    if (host == null) {
      json.put("flag", "fail");
      return json;
    }
    // 1. session
    JSch jsch = new JSch();
    Session session = jsch.getSession(username, host, PORT);
    session.setPassword(password);
    java.util.Properties config = new java.util.Properties();
    config.put("StrictHostKeyChecking", "no");
    session.setConfig(config);
    session.connect(1000*3);  // timeout after 3 seconds

    // 2. channel
    Channel channel = session.openChannel("exec");
    ChannelExec channelExec = (ChannelExec) channel;
    channelExec.setPty(true);
    channelExec.setCommand(command);
    StringBuilder outputBuffer = new StringBuilder("======= COMMAND RESULT =======<br/><br/>");
    // StringBuilder outputBuffer = new StringBuilder();
    InputStream in = channel.getInputStream();
    ((ChannelExec) channel).setErrStream(System.err);
    channel.connect(1000*3);  // timeout after 3 seconds

    // 3. get stream
    // https://github.com/is/jsch/blob/addb8e3a0e/examples/Exec.java
    int bufSize = 1024;
    byte[] buf = new byte[bufSize];
    while (true) {
      while (in.available() > 0) {
        int i = in.read(buf, 0, bufSize);
        outputBuffer.append(new String(buf, 0, i));
        if (i < 0) break;
      }
      if (channel.isClosed()) {
        if(in.available() > 0) continue;
        // log.debug(outputBuffer.toString());
        // tab size = 3
        json.put("stdout", outputBuffer.toString().replaceAll(System.lineSeparator(), "<br/>"));
        log.debug("exit-status: " + channel.getExitStatus());
        break;
      }
      try { Thread.sleep(1000); } catch (Exception exc) {}
    }
    json.put("flag", "success");

    // 4. disconnect
    channel.disconnect();
    session.disconnect();

    return json;
  }

  public Map<String, String> install(String app) throws JSchException, IOException {
    StringBuilder install = new StringBuilder("helm upgrade --install ");
    switch (app) {
      case "apache":
        install.append("apache local/apache ");
        install.append("--namespace user-app");
        break;
      case "maria":
        install.append("maria local/mariadb ");
        install.append("--namespace user-app");
        break;
      case "etri-sim":
        install.append("simulation-service local/simulation-service ");
        install.append("--namespace simulation-service");
        break;
      case "wizontech-sim":
        install.append("mano-sim local/mano-sim ");
        install.append("--namespace default");
        break;
      default:
        break;
    }
    // log.debug("install : {}", install);
    return remoteSsh(install.toString());
  }

  public Map<String, String> delete(String app) throws JSchException, IOException {
    StringBuilder delete = new StringBuilder("helm uninstall ");
    switch (app) {
      case "apache":
        delete.append("apache ");
        delete.append("--namespace user-app");
        break;
      case "maria":
        delete.append("maria ");
        delete.append("--namespace user-app");
        break;
      case "etri-sim":
        delete.append("simulation-service local/simulation-service ");
        delete.append("--namespace simulation-service");
        break;
      case "wizontech-sim":
        delete.append("mano-sim local/mano-sim ");
        delete.append("--namespace default");
        break;
      default:
        break;
    }
    // log.debug("delete : {}", delete);
    return remoteSsh(delete.toString());
  }
}