package com.wizontech.manoportal.k8s.model;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.joda.time.DateTime;

import io.kubernetes.client.openapi.models.V1ObjectMeta;
import io.kubernetes.client.openapi.models.V1PersistentVolume;
import io.kubernetes.client.openapi.models.V1PersistentVolumeClaim;
import io.kubernetes.client.openapi.models.V1PersistentVolumeClaimList;
import io.kubernetes.client.openapi.models.V1PersistentVolumeClaimSpec;
import io.kubernetes.client.openapi.models.V1PersistentVolumeClaimStatus;
import io.kubernetes.client.openapi.models.V1PersistentVolumeList;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

// @lombok.extern.slf4j.Slf4j
@Getter
@Setter
@ToString
@Builder
public class PersistentVolumeClaim extends K8sObject {
  // metadata
  private String name;
  private String namespace;
  private DateTime creationTime;
  private String uid;
  private List<String> labels;
  private List<String> annotations;

  // resource information
  private String status;
  private String volume;
  private String capacity;
  private List<String> accessModes;
  private String storageClass;

  public static List<PersistentVolumeClaim> v1PVCListToPVCList(V1PersistentVolumeClaimList v1PvcList, V1PersistentVolumeList v1PvList) {
    List<PersistentVolumeClaim> pvcs = new ArrayList<>();
    for (V1PersistentVolumeClaim v1Pvc : v1PvcList.getItems()) {
      V1ObjectMeta v1PvcMetadata = v1Pvc.getMetadata();
      V1PersistentVolumeClaimStatus v1PvcStatus = v1Pvc.getStatus();
      V1PersistentVolumeClaimSpec v1PvcSpec = v1Pvc.getSpec();

      List<String> labels = getLabels(v1PvcMetadata.getLabels());
      String storageClass = getStorageClass(v1PvList.getItems(), v1PvcMetadata);

      pvcs.add(
        PersistentVolumeClaim.builder()
          .name(v1PvcMetadata.getName())
          .namespace(v1PvcMetadata.getNamespace())
          .labels(labels)
          .status(v1PvcStatus.getPhase())
          .volume(v1PvcSpec.getVolumeName() == null ? "-" : v1PvcSpec.getVolumeName())
          .capacity(v1PvcStatus.getCapacity() == null ? "-" : v1PvcStatus.getCapacity().get("storage").getNumber().toString())
          .accessModes(v1PvcStatus.getAccessModes())
          .storageClass(storageClass)
          .build()
      );
    }

    return pvcs;
  }

  public static PersistentVolumeClaim v1PVCtoPVC(V1PersistentVolumeClaim v1Pvc) {
    V1ObjectMeta v1PvcMetadata = v1Pvc.getMetadata();
    V1PersistentVolumeClaimStatus v1PvcStatus = v1Pvc.getStatus();
    V1PersistentVolumeClaimSpec v1PvcSpec = v1Pvc.getSpec();

    List<String> labels = getLabels(v1PvcMetadata.getLabels());
    List<String> annotations = getLabels(v1PvcMetadata.getAnnotations());

    return
      PersistentVolumeClaim.builder()
        .name(v1PvcMetadata.getName())
        .namespace(v1PvcMetadata.getNamespace())
        .creationTime(v1PvcMetadata.getCreationTimestamp())
        .uid(v1PvcMetadata.getUid())
        .labels(labels)
        .annotations(annotations)
        .status(v1PvcStatus.getPhase())
        .volume(v1PvcSpec.getVolumeName() == null ? "-" : v1PvcSpec.getVolumeName())
        .capacity(v1PvcStatus.getCapacity() == null ? "-" : v1PvcStatus.getCapacity().get("storage").getNumber().toString())
        .accessModes(v1PvcStatus.getAccessModes())
        .build();
  }

  public static List<String> getLabels(Map<String, String> labelMap) {
    return labelMap != null
      ? labelMap
          .entrySet()
          .stream()
          .map(e -> e.getKey() + "=" + e.getValue())
          .collect(Collectors.toList())
      : null;
  }

  public static String getStorageClass(List<V1PersistentVolume> v1PvListItems, V1ObjectMeta v1PvcMetadata) {
    return v1PvListItems
      .stream()
      .filter(pvc -> pvc.getSpec().getClaimRef().getUid().equals(v1PvcMetadata.getUid()))
      .map(pv -> pv.getSpec().getStorageClassName())
      .reduce("", String::concat);
  }
}