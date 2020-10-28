package com.wizontech.portal.k8s.controller;

import java.util.List;
import java.util.Map;

import com.wizontech.portal.k8s.model.K8sObject;
import com.wizontech.portal.k8s.model.Node;
import com.wizontech.portal.k8s.model.PersistentVolumeClaim;
import com.wizontech.portal.k8s.model.Pod;
import com.wizontech.portal.k8s.model.Service;
import com.wizontech.portal.k8s.service.ResourceService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import io.kubernetes.client.openapi.ApiException;
import lombok.RequiredArgsConstructor;

@CrossOrigin(origins = "*")
@RequiredArgsConstructor
@RequestMapping("/resource")
@Controller
public class ResourceController {

  private final ResourceService resourceService;

  /**
   * Get JSON data
   */
  @GetMapping("/node/all")
  @ResponseBody
  // @GetMapping(produces = MediaType.APPLICATION_STREAM_JSON_VALUE)
  public ResponseEntity<Map<String, List<? extends K8sObject>>> getNodes() throws ApiException {
    Map<String, List<? extends K8sObject>> all = resourceService.getAllNodes();
    return new ResponseEntity<>(all, HttpStatus.OK);
  }

  @GetMapping("/pod/{namespaceName}/{podType}")
  @ResponseBody
  public ResponseEntity<Map<String, List<? extends K8sObject>>> getSpecifiedNamespacedPods(@PathVariable String namespaceName, @PathVariable String podType) throws ApiException {
    if (namespaceName.equals("all")) {
      Map<String, List<? extends K8sObject>> all = resourceService.getAllNamespacedPods(podType);
      return new ResponseEntity<>(all, HttpStatus.OK);
    }
    Map<String, List<? extends K8sObject>> namespace = resourceService.getSpecifiedNamespacedPods(namespaceName, podType);
    return new ResponseEntity<>(namespace, HttpStatus.OK);
  }

  @GetMapping("/pod/select/all/{podType}/{objectName}")
  @ResponseBody
  public ResponseEntity<Map<String, List<? extends K8sObject>>> getSelectedPod(@PathVariable String podType, @PathVariable String objectName) throws ApiException {
    Map<String, List<? extends K8sObject>> pod = resourceService.selectPod(podType, objectName);
    return new ResponseEntity<>(pod, HttpStatus.OK);
  }

  @GetMapping("/service/{namespaceName}")
  @ResponseBody
  public ResponseEntity<Map<String, List<? extends K8sObject>>> getServiceList(@PathVariable String namespaceName) throws ApiException {
    Map<String, List<? extends K8sObject>> services = resourceService.getServiceList(namespaceName);
    return new ResponseEntity<>(services, HttpStatus.OK);
  }

  @GetMapping("/storage/{namespaceName}")
  @ResponseBody
  public ResponseEntity<Map<String, List<? extends K8sObject>>> getStorageList(@PathVariable String namespaceName) throws ApiException {
    Map<String, List<? extends K8sObject>> storages = resourceService.getStorageList(namespaceName);
    return new ResponseEntity<>(storages, HttpStatus.OK);
  }

  /**
   * POPUP
   */
  @GetMapping("/node/{nodeName}")
  public String getPodInfo(Model model, @PathVariable String nodeName) throws ApiException {
    Node node = resourceService.readNodeInfo(nodeName);
    List<Pod> pods = resourceService.readPodInfoByNode(nodeName);
    model
      .addAttribute("node", node)
      .addAttribute("pods", pods);
    return "popup/node";
  }
  @GetMapping("/pod/{namespaceName}/{podType}/{podName}")
  public String getPodInfo(Model model, @PathVariable String namespaceName, @PathVariable String podType, @PathVariable String podName) throws ApiException {
    if (podType.equals("all")) {
      Map<String, Pod> all = resourceService.readPodInfo(namespaceName, podName);
      model.addAttribute("all", all);
    }
    return "popup/pod";
  }

  @GetMapping("/service/{namespaceName}/{serviceName}")
  public String getServiceInfo(Model model, @PathVariable String namespaceName, @PathVariable String serviceName) throws ApiException {
    Service service = resourceService.readServiceInfo(namespaceName, serviceName);
    model.addAttribute("service", service);
    return "popup/service";
  }

  @GetMapping("/storage/{namespaceName}/{pvcName}")
  public String getStorageInfo(Model model, @PathVariable String namespaceName, @PathVariable String pvcName) throws ApiException {
    PersistentVolumeClaim pvc = resourceService.readPVCInfo(namespaceName, pvcName);
    model.addAttribute("pvc", pvc);
    return "popup/storage";
  }

  /**
   * DELETE
   */
  @DeleteMapping("/pod/{namespaceName}/{podType}/{podName}")
  @ResponseBody
  public String getSpecifiedNamespacedPods(@PathVariable String namespaceName, @PathVariable String podType, @PathVariable String podName) throws ApiException {
    resourceService.deleteSpecifiedNamespacedPods(namespaceName, podType, podName);
    return "delete-pod";
  }

}