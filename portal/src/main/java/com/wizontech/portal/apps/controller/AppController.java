package com.wizontech.portal.apps.controller;

import java.io.IOException;
import java.util.Map;

import com.jcraft.jsch.JSchException;
import com.wizontech.portal.apps.model.Command;
import com.wizontech.portal.apps.service.AppService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import lombok.RequiredArgsConstructor;

@lombok.extern.slf4j.Slf4j
@RequiredArgsConstructor
@RequestMapping("/app")
@Controller
public class AppController {

  private final AppService appService;
  // private final String NAMESPACE = "--namespace compact-edge";

  @PostMapping("/command")
  @ResponseBody
  public ResponseEntity<Map<String, String>> commandRemoteSsh(@RequestBody Command command) throws JSchException, IOException {
    log.debug("command : {}", command.getCommand());
    Map<String, String> json = appService.remoteSsh(command.getCommand());
    return new ResponseEntity<>(json, HttpStatus.OK);
  }

  @PostMapping("/install/{app}")
  @ResponseBody
  public ResponseEntity<Map<String, String>> commandInstall(@PathVariable String app) throws JSchException, IOException {
    log.debug("install app : {}", app);
    Map<String, String> json = appService.install(app);
    return new ResponseEntity<>(json, HttpStatus.OK);
  }

  @PostMapping("/delete/{app}")
  @ResponseBody
  public ResponseEntity<Map<String, String>> commandDelete(@PathVariable String app) throws JSchException, IOException {
    Map<String, String> json = appService.delete(app);
    log.debug("delete app : {}", app);
    return new ResponseEntity<>(json, HttpStatus.OK);
  }
}