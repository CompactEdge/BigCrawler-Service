package com.wizontech.manoportal.k8s.service;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import com.google.gson.JsonObject;
import com.wizontech.manoportal.k8s.model.Namespace;
import com.wizontech.manoportal.k8s.model.Node;
import com.wizontech.manoportal.k8s.model.Pod;
import com.wizontech.manoportal.util.MonitoringUtil;

import org.springframework.stereotype.Service;

import io.kubernetes.client.openapi.ApiException;
import io.kubernetes.client.openapi.apis.CoreV1Api;
import io.kubernetes.client.openapi.models.V1NamespaceList;
import io.kubernetes.client.openapi.models.V1NodeList;
import io.kubernetes.client.openapi.models.V1PodList;
import lombok.RequiredArgsConstructor;

@lombok.extern.slf4j.Slf4j
@RequiredArgsConstructor
@Service
public class MonitoringServiceImpl implements MonitoringService {

  private final MonitoringUtil monitoringUtil;
  private final CoreV1Api coreV1Api;

  @Override
  public List<Node> getAllNodes() throws ApiException {
    V1NodeList v1nodes = coreV1Api.listNode(null, null, null, null, null, null, null, null, null);
    List<Node> nodes = Node.v1NodeListToNodeList(v1nodes);
    return nodes;
  }

  @Override
  public List<Namespace> getAllNamespaces() throws ApiException {
    V1NamespaceList v1namespaces = coreV1Api.listNamespace(null, null, null, null, null, null, null, null, null);
    List<Namespace> namespaces = new ArrayList<>();

    Set<String> defaultNamespace = new HashSet<>();
    defaultNamespace.add("default");
    defaultNamespace.add("kube-node-lease");
    defaultNamespace.add("kube-public");

    v1namespaces.getItems().stream()
      .filter(e -> !defaultNamespace.contains(e.getMetadata().getName())).collect(Collectors.toList())
      .forEach(namespace -> {
        namespaces.add(Namespace.builder().name(namespace.getMetadata().getName()).build());
      });
    return namespaces;
  }

  @Override
  public List<Pod> getNamespacedPods(String namespace) throws ApiException {
    V1PodList v1PodList = coreV1Api.listNamespacedPod(namespace, null, null, null, null, null, null, null, null, null);
    List<Pod> pods = Pod.v1PodListToPodList(v1PodList);
    return pods;
  }

  @Override
  public JsonObject getClusterMonitoring(String resource, String cluster) throws IOException {
    if (cluster == null) cluster = "";
    long now = Calendar.getInstance().getTimeInMillis();

    switch (resource) {
      case "cpuUtilisation": return monitoringUtil.fromPromQL("1 - avg(rate(node_cpu_seconds_total{mode=\"idle\", cluster=\""+cluster+"\"}[1m]))");
      case "cpuRequestsCommitment": return monitoringUtil.fromPromQL("sum(kube_pod_container_resource_requests_cpu_cores{cluster=\""+cluster+"\"}) / sum(kube_node_status_allocatable_cpu_cores{cluster=\""+cluster+"\"})");
      case "cpuLimitsCommitment": return monitoringUtil.fromPromQL("sum(kube_pod_container_resource_limits_cpu_cores{cluster=\""+cluster+"\"}) / sum(kube_node_status_allocatable_cpu_cores{cluster=\""+cluster+"\"})");
      case "memoryUtilisation": return monitoringUtil.fromPromQL("1 - sum(:node_memory_MemAvailable_bytes:sum{cluster=\""+cluster+"\"}) / sum(kube_node_status_allocatable_memory_bytes{cluster=\""+cluster+"\"})");
      case "memoryRequestsCommitment": return monitoringUtil.fromPromQL("sum(kube_pod_container_resource_requests_memory_bytes{cluster=\""+cluster+"\"}) / sum(kube_node_status_allocatable_memory_bytes{cluster=\""+cluster+"\"})");
      case "memoryLimitsCommitment": return monitoringUtil.fromPromQL("sum(kube_pod_container_resource_limits_memory_bytes{cluster=\""+cluster+"\"}) / sum(kube_node_status_allocatable_memory_bytes{cluster=\""+cluster+"\"})");
      case "cpuUsage": return monitoringUtil.fromPromQL(
        "sum(node_namespace_pod_container:container_cpu_usage_seconds_total:sum_rate{cluster=\"\"})"
        + "by (namespace)",
        String.valueOf((now-(1000*60*30))/1000),
        String.valueOf(now/1000),
        "30");
      case "memoryUsage": return monitoringUtil.fromPromQL(
        "sum(container_memory_rss{cluster=\"\", container!=\"\"})"
        + "by (namespace)",
        String.valueOf((now-(1000*60*30))/1000),
        String.valueOf(now/1000),
        "30");
      case "cpuQuotaPods": return monitoringUtil.fromPromQL("count(mixin_pod_workload{cluster=\"\"}) by (namespace)");
      case "cpuQuotaWorkloads": return monitoringUtil.fromPromQL("count(avg(mixin_pod_workload{cluster=\"\"}) by (workload, namespace)) by (namespace)");
      case "cpuQuotaCpuUsage": return monitoringUtil.fromPromQL("sum(node_namespace_pod_container:container_cpu_usage_seconds_total:sum_rate{cluster=\"\"}) by (namespace)");
      case "cpuQuotaCpuRequests": return monitoringUtil.fromPromQL("sum(kube_pod_container_resource_requests_cpu_cores{cluster=\"\"}) by (namespace)");
      case "cpuQuotaCpuRequestsRate": return monitoringUtil.fromPromQL("sum(node_namespace_pod_container:container_cpu_usage_seconds_total:sum_rate{cluster=\"\"}) by (namespace) / sum(kube_pod_container_resource_requests_cpu_cores{cluster=\"\"}) by (namespace)");
      case "cpuQuotaCpuLimits": return monitoringUtil.fromPromQL("sum(kube_pod_container_resource_limits_cpu_cores{cluster=\"\"}) by (namespace)");
      case "cpuQuotaCpuLimitsRate": return monitoringUtil.fromPromQL("sum(node_namespace_pod_container:container_cpu_usage_seconds_total:sum_rate{cluster=\"\"}) by (namespace) / sum(kube_pod_container_resource_limits_cpu_cores{cluster=\"\"}) by (namespace)");
      case "memoryRequestsPods": return monitoringUtil.fromPromQL("count(mixin_pod_workload{cluster=\"\"}) by (namespace)");
      case "memoryRequestsWorkloads": return monitoringUtil.fromPromQL("count(avg(mixin_pod_workload{cluster=\"\"}) by (workload, namespace)) by (namespace)");
      case "memoryRequestsUsage": return monitoringUtil.fromPromQL("sum(container_memory_rss{cluster=\"\", container!=\"\"}) by (namespace)");
      case "memoryRequests": return monitoringUtil.fromPromQL("sum(kube_pod_container_resource_requests_memory_bytes{cluster=\"\"}) by (namespace)");
      case "memoryRequestsRate": return monitoringUtil.fromPromQL("sum(container_memory_rss{cluster=\"\", container!=\"\"}) by (namespace) / sum(kube_pod_container_resource_requests_memory_bytes{cluster=\"\"}) by (namespace)");
      case "memoryRequestsLimits": return monitoringUtil.fromPromQL("sum(kube_pod_container_resource_limits_memory_bytes{cluster=\"\"}) by (namespace)");
      case "memoryRequestsLimitsRate": return monitoringUtil.fromPromQL("sum(container_memory_rss{cluster=\"\", container!=\"\"}) by (namespace) / sum(kube_pod_container_resource_limits_memory_bytes{cluster=\"\"}) by (namespace)");
      default: log.info("getClusterMonitoring() switch default"); return null;
    }
  }

  @Override
  public JsonObject getNamespaceMonitoring(String resource, String namespace, String type) throws IOException {
    if (namespace == null) namespace = "";
    if (type == null) type = "";
    long now = Calendar.getInstance().getTimeInMillis();

    switch (resource) {
      case "cpuUsage": return monitoringUtil.fromPromQL(
          "sum(node_namespace_pod_container:container_cpu_usage_seconds_total:sum_rate{cluster=\"\", namespace=\""+namespace+"\"}"
          + "* on(namespace,pod)"
          + "group_left(workload, workload_type) mixin_pod_workload{cluster=\"\", namespace=\""+namespace+"\", workload_type=\""+type+"\"})"
          + "by (workload, workload_type)",
          String.valueOf((now-(1000*60*30))/1000),
          String.valueOf(now/1000),
          "30");
      case "memoryUsage": return monitoringUtil.fromPromQL(
          "sum(container_memory_working_set_bytes{cluster=\"\", namespace=\""+namespace+"\", container!=\"\"}"
          + "* on(namespace,pod)"
          + "group_left(workload, workload_type) mixin_pod_workload{cluster=\"\", namespace=\""+namespace+"\", workload_type=\""+type+"\"})"
          + "by (workload, workload_type)",
          String.valueOf((now-(1000*60*30))/1000),
          String.valueOf(now/1000),
          "30");
      case "cpuQuotaRunningPods": return monitoringUtil.fromPromQL("count(mixin_pod_workload{cluster=\"\", namespace=\""+namespace+"\", workload_type=\""+type+"\"}) by (workload, workload_type)");
      case "cpuQuotaCpuUsage": return monitoringUtil.fromPromQL("sum(node_namespace_pod_container:container_cpu_usage_seconds_total:sum_rate{cluster=\"\", namespace=\""+namespace+"\"} * on(namespace,pod) group_left(workload, workload_type) mixin_pod_workload{cluster=\"\", namespace=\""+namespace+"\", workload_type=\""+type+"\"}) by (workload, workload_type)");
      case "cpuQuotaCpuRequests": return monitoringUtil.fromPromQL("sum(kube_pod_container_resource_requests_cpu_cores{cluster=\"\", namespace=\""+namespace+"\"} * on(namespace,pod) group_left(workload, workload_type) mixin_pod_workload{cluster=\"\", namespace=\""+namespace+"\", workload_type=\""+type+"\"}) by (workload, workload_type)");
      case "cpuQuotaCpuRequestsRate": return monitoringUtil.fromPromQL("sum(node_namespace_pod_container:container_cpu_usage_seconds_total:sum_rate{cluster=\"\", namespace=\""+namespace+"\"} * on(namespace,pod) group_left(workload, workload_type) mixin_pod_workload{cluster=\"\", namespace=\""+namespace+"\", workload_type=\""+type+"\"}) by (workload, workload_type)/sum(kube_pod_container_resource_requests_cpu_cores{cluster=\"\", namespace=\"monitoring\"} * on(namespace,pod) group_left(workload, workload_type) mixin_pod_workload{cluster=\"\", namespace=\"monitoring\", workload_type=\""+type+"\"}) by (workload, workload_type)");
      case "cpuQuotaCpuLimits": return monitoringUtil.fromPromQL("sum(kube_pod_container_resource_limits_cpu_cores{cluster=\"\", namespace=\""+namespace+"\"} * on(namespace,pod) group_left(workload, workload_type) mixin_pod_workload{cluster=\"\", namespace=\""+namespace+"\", workload_type=\""+type+"\"}) by (workload, workload_type)");
      case "cpuQuotaCpuLimitsRate": return monitoringUtil.fromPromQL("sum(node_namespace_pod_container:container_cpu_usage_seconds_total:sum_rate{cluster=\"\", namespace=\""+namespace+"\"} * on(namespace,pod) group_left(workload, workload_type) mixin_pod_workload{cluster=\"\", namespace=\""+namespace+"\", workload_type=\""+type+"\"}) by (workload, workload_type)/sum(kube_pod_container_resource_limits_cpu_cores{cluster=\"\", namespace=\"monitoring\"} * on(namespace,pod) group_left(workload, workload_type) mixin_pod_workload{cluster=\"\", namespace=\"monitoring\", workload_type=\""+type+"\"}) by (workload, workload_type)");
      case "memoryQuotaRunningPods": return monitoringUtil.fromPromQL("count(mixin_pod_workload{cluster=\"\", namespace=\""+namespace+"\", workload_type=\""+type+"\"}) by (workload, workload_type)");
      case "memoryQuotaUsage": return monitoringUtil.fromPromQL("sum(container_memory_working_set_bytes{cluster=\"\", namespace=\""+namespace+"\", container!=\"\"} * on(namespace,pod) group_left(workload, workload_type) mixin_pod_workload{cluster=\"\", namespace=\""+namespace+"\", workload_type=\""+type+"\"}) by (workload, workload_type)");
      case "memoryQuotaRequests": return monitoringUtil.fromPromQL("sum(kube_pod_container_resource_requests_memory_bytes{cluster=\"\", namespace=\""+namespace+"\"} * on(namespace,pod) group_left(workload, workload_type) mixin_pod_workload{cluster=\"\", namespace=\""+namespace+"\", workload_type=\""+type+"\"}) by (workload, workload_type)");
      case "memoryQuotaRequestsRate": return monitoringUtil.fromPromQL("sum(container_memory_working_set_bytes{cluster=\"\", namespace=\""+namespace+"\", container!=\"\"} * on(namespace,pod) group_left(workload, workload_type) mixin_pod_workload{cluster=\"\", namespace=\""+namespace+"\", workload_type=\""+type+"\"}) by (workload, workload_type)/sum(kube_pod_container_resource_requests_memory_bytes{cluster=\"\", namespace=\"monitoring\"} * on(namespace,pod) group_left(workload, workload_type) mixin_pod_workload{cluster=\"\", namespace=\"monitoring\", workload_type=\""+type+"\"}) by (workload, workload_type)");
      case "memoryQuotaLimits": return monitoringUtil.fromPromQL("sum(kube_pod_container_resource_limits_memory_bytes{cluster=\"\", namespace=\""+namespace+"\"} * on(namespace,pod) group_left(workload, workload_type) mixin_pod_workload{cluster=\"\", namespace=\""+namespace+"\", workload_type=\""+type+"\"}) by (workload, workload_type)");
      case "memoryQuotaLimitsRate": return monitoringUtil.fromPromQL("sum(container_memory_working_set_bytes{cluster=\"\", namespace=\""+namespace+"\", container!=\"\"} * on(namespace,pod) group_left(workload, workload_type) mixin_pod_workload{cluster=\"\", namespace=\""+namespace+"\", workload_type=\""+type+"\"}) by (workload, workload_type)/sum(kube_pod_container_resource_limits_memory_bytes{cluster=\"\", namespace=\"monitoring\"} * on(namespace,pod) group_left(workload, workload_type) mixin_pod_workload{cluster=\"\", namespace=\"monitoring\", workload_type=\""+type+"\"}) by (workload, workload_type)");
      default: log.info("getNamespaceMonitoring() switch default"); return null;
    }
  }

  @Override
  public JsonObject getNodeMonitoring(String resource, String node) throws IOException {
    if (node == null) node = "";
    long now = Calendar.getInstance().getTimeInMillis();

    switch (resource) {
      case "cpuUsage": return monitoringUtil.fromPromQL(
        "sum(node_namespace_pod_container:container_cpu_usage_seconds_total:sum_rate{cluster=\"\", node=\""+node+"\"})"
        + "by (pod)",
        String.valueOf((now-(1000*60*30))/1000),
        String.valueOf(now/1000),
        "30");
      case "memoryUsage": return monitoringUtil.fromPromQL(
        "sum(node_namespace_pod_container:container_memory_working_set_bytes{cluster=\"\", node=\""+node+"\", container!=\"\"})"
        + "by (pod)",
        String.valueOf((now-(1000*60*30))/1000),
        String.valueOf(now/1000),
        "30");
      case "cpuQuotaCpuUsage": return monitoringUtil.fromPromQL("sum(node_namespace_pod_container:container_cpu_usage_seconds_total:sum_rate{cluster=\"\", node=\""+node+"\"}) by (pod)");
      case "cpuQuotaCpuRequests": return monitoringUtil.fromPromQL("sum(kube_pod_container_resource_requests_cpu_cores{cluster=\"\", node=\""+node+"\"}) by (pod)");
      case "cpuQuotaCpuRequestsRate": return monitoringUtil.fromPromQL("sum(node_namespace_pod_container:container_cpu_usage_seconds_total:sum_rate{cluster=\"\", node=\""+node+"\"}) by (pod) / sum(kube_pod_container_resource_requests_cpu_cores{cluster=\"\", node=\""+node+"\"}) by (pod)");
      case "cpuQuotaCpuLimits": return monitoringUtil.fromPromQL("sum(kube_pod_container_resource_limits_cpu_cores{cluster=\"\", node=\""+node+"\"}) by (pod)");
      case "cpuQuotaCpuLimitsRate": return monitoringUtil.fromPromQL("sum(node_namespace_pod_container:container_cpu_usage_seconds_total:sum_rate{cluster=\"\", node=\""+node+"\"}) by (pod) / sum(kube_pod_container_resource_limits_cpu_cores{cluster=\"\", node=\""+node+"\"}) by (pod)");
      case "memoryQuotaUsage": return monitoringUtil.fromPromQL("sum(node_namespace_pod_container:container_memory_working_set_bytes{cluster=\"\", node=\""+node+"\",container!=\"\"}) by (pod)");
      case "memoryQuotaRequests": return monitoringUtil.fromPromQL("sum(kube_pod_container_resource_requests_memory_bytes{cluster=\"\", node=\""+node+"\"}) by (pod)");
      case "memoryQuotaRequestsRate": return monitoringUtil.fromPromQL("sum(node_namespace_pod_container:container_memory_working_set_bytes{cluster=\"\", node=\""+node+"\",container!=\"\"}) by (pod) / sum(kube_pod_container_resource_requests_memory_bytes{node=\""+node+"\"}) by (pod)");
      case "memoryQuotaLimits": return monitoringUtil.fromPromQL("sum(kube_pod_container_resource_limits_memory_bytes{cluster=\"\", node=\""+node+"\"}) by (pod)");
      case "memoryQuotaLimitsRate": return monitoringUtil.fromPromQL("sum(node_namespace_pod_container:container_memory_working_set_bytes{cluster=\"\", node=\""+node+"\",container!=\"\"}) by (pod) / sum(kube_pod_container_resource_limits_memory_bytes{node=\""+node+"\"}) by (pod)");
      case "memoryQuotaUsageRss": return monitoringUtil.fromPromQL("sum(node_namespace_pod_container:container_memory_rss{cluster=\"\", node=\""+node+"\",container!=\"\"}) by (pod)");
      case "memoryQuotaUsageCache": return monitoringUtil.fromPromQL("sum(node_namespace_pod_container:container_memory_cache{cluster=\"\", node=\""+node+"\",container!=\"\"}) by (pod)");
      case "memoryQuotaUsageSwap": return monitoringUtil.fromPromQL("sum(node_namespace_pod_container:container_memory_swap{cluster=\"\", node=\""+node+"\",container!=\"\"}) by (pod)");
      default: log.info("getNamespaceMonitoring() switch default"); return null;
    }
  }

  @Override
  public JsonObject getPodMonitoring(String resource, String namespace, String pod) throws IOException {
    if (namespace == null) namespace = "";
    if (pod == null) pod = "";
    long now = Calendar.getInstance().getTimeInMillis();

    switch (resource) {
      case "cpuUsage": return monitoringUtil.fromPromQL(
          "sum(node_namespace_pod_container:container_cpu_usage_seconds_total:sum_rate{"
          + "namespace=\""+namespace+"\","
          + "pod=\""+pod+"\","
          + "container!=\"POD\","
          + "cluster=\"\"})"
          + "by (container)",
          String.valueOf((now-(1000*60*30))/1000),
          String.valueOf(now/1000),
          "30");
      case "memoryUsage": return monitoringUtil.fromPromQL(
          "sum(container_memory_working_set_bytes{"
          + "cluster=\"\","
          + "namespace=\""+namespace+"\","
          + "pod=\""+pod+"\","
          + "container!=\"POD\","
          + "container!=\"\"})"
          + "by (container)",
          String.valueOf((now-(1000*60*30))/1000),
          String.valueOf(now/1000),
          "30");
      case "memoryUsageRss": return monitoringUtil.fromPromQL(
          "sum(container_memory_rss{"
          + "cluster=\"\","
          + "namespace=\""+namespace+"\","
          + "pod=\""+pod+"\","
          + "container!=\"POD\","
          + "container!=\"\"})"
          + "by (container)",
          String.valueOf((now-(1000*60*30))/1000),
          String.valueOf(now/1000),
          "30");
      case "memoryUsageCache": return monitoringUtil.fromPromQL(
          "sum(container_memory_cache{"
          + "cluster=\"\","
          + "namespace=\""+namespace+"\","
          + "pod=\""+pod+"\","
          + "container!=\"POD\","
          + "container!=\"\"})"
          + "by (container)",
          String.valueOf((now-(1000*60*30))/1000),
          String.valueOf(now/1000),
          "30");
      case "memoryUsageSwap": return monitoringUtil.fromPromQL(
          "sum(container_memory_swap{"
          + "cluster=\"\","
          + "namespace=\""+namespace+"\","
          + "pod=\""+pod+"\","
          + "container!=\"POD\","
          + "container!=\"\"})"
          + "by (container)",
          String.valueOf((now-(1000*60*30))/1000),
          String.valueOf(now/1000),
          "30");

      case "cpuQuotaCpuUsage": return monitoringUtil.fromPromQL("sum(node_namespace_pod_container:container_cpu_usage_seconds_total:sum_rate{cluster=\"\", namespace=\""+namespace+"\", pod=\""+pod+"\", container!=\"POD\"}) by (container)");
      case "cpuQuotaCpuRequests": return monitoringUtil.fromPromQL("sum(kube_pod_container_resource_requests_cpu_cores{cluster=\"\", namespace=\""+namespace+"\", pod=\""+pod+"\"}) by (container)");
      case "cpuQuotaCpuRequestsRate": return monitoringUtil.fromPromQL("sum(node_namespace_pod_container:container_cpu_usage_seconds_total:sum_rate{cluster=\"\", namespace=\""+namespace+"\", pod=\""+pod+"\"}) by (container) / sum(kube_pod_container_resource_requests_cpu_cores{cluster=\"\", namespace=\""+namespace+"\", pod=\""+pod+"\"}) by (container)");
      case "cpuQuotaCpuLimits": return monitoringUtil.fromPromQL("sum(kube_pod_container_resource_limits_cpu_cores{cluster=\"\", namespace=\""+namespace+"\", pod=\""+pod+"\"}) by (container)");
      case "cpuQuotaCpuLimitsRate": return monitoringUtil.fromPromQL("sum(node_namespace_pod_container:container_cpu_usage_seconds_total:sum_rate{cluster=\"\", namespace=\""+namespace+"\", pod=\""+pod+"\"}) by (container) / sum(kube_pod_container_resource_limits_cpu_cores{cluster=\"\", namespace=\""+namespace+"\", pod=\""+pod+"\"}) by (container)");

      case "memoryQuotaUsage": return monitoringUtil.fromPromQL("sum(container_memory_working_set_bytes{cluster=\"\", namespace=\""+namespace+"\", pod=\""+pod+"\", container!=\"POD\", container!=\"\"}) by (container)");
      case "memoryQuotaRequests": return monitoringUtil.fromPromQL("sum(kube_pod_container_resource_requests_memory_bytes{cluster=\"\", namespace=\""+namespace+"\", pod=\""+pod+"\"}) by (container)");
      case "memoryQuotaRequestsRate": return monitoringUtil.fromPromQL("sum(container_memory_working_set_bytes{cluster=\"\", namespace=\""+namespace+"\", pod=\""+pod+"\"}) by (container) / sum(kube_pod_container_resource_requests_memory_bytes{namespace=\""+namespace+"\", pod=\""+pod+"\"}) by (container)");
      case "memoryQuotaLimits": return monitoringUtil.fromPromQL("sum(kube_pod_container_resource_limits_memory_bytes{cluster=\"\", namespace=\""+namespace+"\", pod=\""+pod+"\", container!=\"\"}) by (container)");
      case "memoryQuotaLimitsRate": return monitoringUtil.fromPromQL("sum(container_memory_working_set_bytes{cluster=\"\", namespace=\""+namespace+"\", pod=\""+pod+"\", container!=\"\"}) by (container) / sum(kube_pod_container_resource_limits_memory_bytes{namespace=\""+namespace+"\", pod=\""+pod+"\"}) by (container)");
      case "memoryQuotaUsageRss": return monitoringUtil.fromPromQL("sum(container_memory_rss{cluster=\"\", namespace=\""+namespace+"\", pod=\""+pod+"\", container!=\"\", container!=\"POD\"}) by (container)");
      case "memoryQuotaUsageCache": return monitoringUtil.fromPromQL("sum(container_memory_cache{cluster=\"\", namespace=\""+namespace+"\", pod=\""+pod+"\", container!=\"\", container!=\"POD\"}) by (container)");
      case "memoryQuotaUsageSwap": return monitoringUtil.fromPromQL("sum(container_memory_swap{cluster=\"\", namespace=\""+namespace+"\", pod=\""+pod+"\", container!=\"\", container!=\"POD\"}) by (container)");
      default: log.info("getNamespaceMonitoring() switch default"); return null;
    }
  }


}