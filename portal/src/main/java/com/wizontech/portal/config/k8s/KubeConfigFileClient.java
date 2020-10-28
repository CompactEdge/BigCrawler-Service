package com.wizontech.portal.config.k8s;

import java.io.IOException;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;

import io.kubernetes.client.openapi.ApiClient;
import io.kubernetes.client.openapi.apis.AppsV1Api;
import io.kubernetes.client.openapi.apis.CoreV1Api;
import io.kubernetes.client.util.Config;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Profile(value = {"dev-docker", "dev-kube", "server"})
@Configuration
public class KubeConfigFileClient {

  public KubeConfigFileClient() throws IOException {
    log.debug("Standard KubeConfig");
    ApiClient client = Config.defaultClient();
    log.debug(client.getBasePath());
    log.debug(client.getAuthentications().toString());
    io.kubernetes.client.openapi.Configuration.setDefaultApiClient(client);
  }

  // kubectl proxy
  @Bean
  public CoreV1Api getCoreApi() {
    return new CoreV1Api();
  }

  @Bean
  public AppsV1Api getAppsV1Api() {
    return new AppsV1Api();
  }

  // @Bean
  // public NodeV1beta1Api getNodeV1betaApi() {
  //   return new NodeV1beta1Api();
  // }

  // kubectl config view
  // kubectl proxy

  // // Cluster
  // @Bean
  // public List<Cluster> getClusters() {
  //   log.debug("system properties : {}", System.getProperties());
  //   log.debug("system env : {}", System.getenv());
  //   String kubeConfigPath = System.getenv("HOME") + File.separatorChar + KubeConfig.KUBEDIR + File.separatorChar + KubeConfig.KUBECONFIG;
  //   log.debug("kube config path : {}", kubeConfigPath);
  //   FileReader kubeConfigFile = new FileReader(kubeConfigPath);
  //   KubeConfig kubeConfig = KubeConfig.loadKubeConfig(kubeConfigFile);
  //   ApiClient client = ClientBuilder.kubeconfig(kubeConfig).build();

  //   List<Cluster> clusters = new ArrayList<>();
  //   kubeConfig.getClusters().forEach(clusterObj -> {
  //     Map<String, String> clusterMap = (LinkedHashMap<String, String>)clusterObj;

  //     ObjectMapper mapper = new ObjectMapper();
  //     Map<String, String> map = mapper.convertValue(clusterMap.get("cluster"), new TypeReference<Map<String, String>>() {});

  //     Cluster cluster = new Cluster();
  //     cluster.setServer(map.get("server"));
  //     cluster.setName(clusterMap.get("name"));

  //     clusters.add(cluster);
  //   });

  //   return clusters;
  // }

  // // Context
  // @Bean(name = "kubeConfig")
  // public KubeConfig getKubeConfig() {
  //   log.info("current-context : {}", kubeConfig.getCurrentContext());
  //   log.info("contexts : {}", kubeConfig.getContexts());
  //   return kubeConfig;
  // }
}