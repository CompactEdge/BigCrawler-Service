package com.wizontech.manoportal.k8s.service;

import java.util.List;
import java.util.Map;

import com.wizontech.manoportal.k8s.model.K8sObject;
import com.wizontech.manoportal.k8s.model.Namespace;
import com.wizontech.manoportal.k8s.model.Node;
import com.wizontech.manoportal.k8s.model.Service;
import com.wizontech.manoportal.k8s.model.PersistentVolumeClaim;
import com.wizontech.manoportal.k8s.model.Pod;

import io.kubernetes.client.openapi.ApiException;

public interface ResourceService {

  /**
	 * 모든 Namespace 조회
	 * @throws ApiException
	 */
	List<Namespace> getAllNamespace() throws ApiException;

  /**
	 * 모든 Node 조회
	 * @throws ApiException
	 */
	Map<String, List<? extends K8sObject>> getAllNodes() throws ApiException;

	/**
	 * 모든 Namespace의 Pod 조회
	 * @param podType
	 * @throws ApiException
	 */
	Map<String, List<? extends K8sObject>> getAllNamespacedPods(String podType) throws ApiException;

	/**
	 * 특정 Namespace의 특정 Type 조회
	 * @param namespaceName
	 * @param podType
	 * @throws ApiException
	 */
	Map<String, List<? extends K8sObject>> getSpecifiedNamespacedPods(String namespaceName, String podType) throws ApiException;

	/**
	 * 특정 Type의 Pods 조회
	 * @param podType
	 * @param objectName
	 * @return
	 */
	Map<String, List<? extends K8sObject>> selectPod(String podType, String objectName) throws ApiException;
	/**
	 * 특정 Namespace의 특정 Pod 삭제
	 * @param namespaceName
	 * @param podType
	 * @param podName
	 * @throws ApiException
	 */
	void deleteSpecifiedNamespacedPods(String namespaceName, String podType, String podName) throws ApiException;

	/**
	 * 지정된 Namespace의 Service 조회
	 * @param namespaceName
	 * @throws ApiException
	 */
	Map<String, List<? extends K8sObject>> getServiceList(String namespaceName) throws ApiException;

	/**
	 * 지정된 Namespace의 Persistent Volume Claim 조회
	 * @throws ApiException
	 */
	Map<String, List<? extends K8sObject>> getStorageList(String namespaceName) throws ApiException;

	/**
	 * 특정 Node에 대한 정보 조회 팝업창
	 * @param namespaceName
	 * @param podName
	 * @return
	 */
	Node readNodeInfo(String nodeName) throws ApiException;

	/**
	 * 특정 Node에 대한 Pods 정보 조회 팝업창
	 * @param namespaceName
	 * @param podName
	 * @return
	 */
  List<Pod> readPodInfoByNode(String nodeName) throws ApiException;

	/**
	 * 특정 Pod에 대한 정보 조회 팝업창
	 * @param namespaceName
	 * @param podName
	 * @return
	 */
	Map<String, Pod> readPodInfo(String namespaceName, String podName) throws ApiException;

	/**
	 * 특정 Service에 대한 정보 조회 팝업창
	 * @param namespaceName
	 * @param serviceName
	 * @return
	 */
  Service readServiceInfo(String namespaceName, String serviceName) throws ApiException;

	/**
	 * 특정 PVC에 대한 정보 조회 팝업창
	 * @param namespaceName
	 * @param pvcName
	 * @return
	 */
	PersistentVolumeClaim readPVCInfo(String namespaceName, String pvcName) throws ApiException;
}