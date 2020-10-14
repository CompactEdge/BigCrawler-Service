package com.wizontech.manoportal.config.k8s;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.time.Duration;

import org.apache.commons.io.FileUtils;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;

import io.kubernetes.client.openapi.ApiClient;
import io.kubernetes.client.openapi.apis.AppsV1Api;
import io.kubernetes.client.openapi.apis.CoreV1Api;
import io.kubernetes.client.openapi.auth.ApiKeyAuth;
import io.kubernetes.client.util.Config;
import lombok.extern.slf4j.Slf4j;
import okhttp3.OkHttpClient;

@Slf4j
@Profile(value = {"test"})
@Configuration
public class KubeInClusterTokenClient {

  private final String _HTTPS = "https://";
  private final String _SERVICE_HOST = System.getenv(Config.ENV_SERVICE_HOST);
  private final String _SERVICE_PORT = System.getenv(Config.ENV_SERVICE_PORT);
  private final String serviceUrl = _HTTPS + _SERVICE_HOST + ":" + _SERVICE_PORT;

  // https://kubernetes.io/docs/tasks/configure-pod-container/configure-service-account/
  public KubeInClusterTokenClient() throws IOException {
    log.info("Token based Config");
    ApiClient apiClient = Config.fromUrl(serviceUrl, true);
    InputStream cacertReader = new FileInputStream(Config.SERVICEACCOUNT_CA_PATH);
    apiClient.setSslCaCert(cacertReader);
    apiClient.setReadTimeout(60 * 1000);

    ApiKeyAuth apiKeyAuth = (ApiKeyAuth) apiClient.getAuthentication("BearerToken");
    String token = FileUtils.readFileToString(new File(Config.SERVICEACCOUNT_TOKEN_PATH));
    apiKeyAuth.setApiKey(token);
    // apiClient.setAccessToken(apiKeyAuth.getApiKey()); // throw new RuntimeException("No OAuth2 authentication configured!");

    OkHttpClient httpClient = apiClient.getHttpClient().newBuilder().readTimeout(Duration.ZERO).build();
    apiClient.setHttpClient(httpClient);
    io.kubernetes.client.openapi.Configuration.setDefaultApiClient(apiClient);
  }

  @Bean
  public CoreV1Api getCoreApi() {
    return new CoreV1Api();
  }

  @Bean
  public AppsV1Api getAppsV1Api() {
    return new AppsV1Api();
  }
}