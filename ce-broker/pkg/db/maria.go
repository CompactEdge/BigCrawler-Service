package db

import (
	"encoding/json"
	"fmt"
	"strconv"
	"strings"
	"time"

	"github.com/labstack/gommon/log"

	. "github.com/compactedge/cewizontech/ce-broker/pkg/model"
	"github.com/compactedge/cewizontech/ce-broker/pkg/mq"
	"github.com/compactedge/cewizontech/ce-broker/pkg/util"

	_ "github.com/go-sql-driver/mysql"
	"github.com/jinzhu/gorm"

	// TODO: migrate to "k8s.io/client-go/kubernetes"
	"github.com/kubernetes-client/go/kubernetes/client"

	// prom "github.com/prometheus/client_golang/api"
	// apiv1 "github.com/prometheus/client_golang/api/prometheus/v1"
	"github.com/spf13/viper"
)

// const is member of dbmanager package
const (
	ResourceTypeDefaultCore             = 0
	ResourceTypeDefaultApps             = 1
	ResourceTypeDefaultAutoscaling      = 2
	ResourceTypeDefaultBatch            = 3
	ResourceTypeDefaultNetwork          = 4
	ResourceTypeDefaultStorage          = 5
	ResourceTypeDefaultExt              = 6
	ResourceTypeNode                    = 7
	ResourceTypeConfigMap               = 8
	ResourceTypeComponentStatus         = 9
	ResourceTypeEvent                   = 10
	ResourceTypeNamespace               = 11
	ResourceTypePersistentVolumeClaim   = 12
	ResourceTypePod                     = 13
	ResourceTypeReplicationController   = 14
	ResourceTypeSecret                  = 15
	ResourceTypeService                 = 16
	ResourceTypeServiceAccount          = 17
	ResourceTypeLimitRange              = 18
	ResourceTypeResourceQuota           = 19
	ResourceTypePersistentVolume        = 20
	ResourceTypeControllerRevision      = 21
	ResourceTypeDaemonSet               = 22
	ResourceTypeDeployment              = 23
	ResourceTypeReplicaSet              = 24
	ResourceTypeStatefulSet             = 25
	ResourceTypeHorizontalPodAutoscaler = 26
	ResourceTypeJob                     = 27
	ResourceTypeNetworkPolicy           = 28
	ResourceTypeStorageClass            = 29
	ResourceTypeVolumeAttachment        = 30
)

// UpdateDbFunc is member of dbmanager package
type UpdateDbFunc func(db *gorm.DB, data []byte)

// DeleteDbFunc is member of dbmanager package
type DeleteDbFunc func(db *gorm.DB, isAll bool, namespace string, name string)

// ResourceData is member of dbmanager package
type ResourceData struct {
	ResourceType  int
	ResourceStr   string
	UpdateHandler UpdateDbFunc
	DeleteHandler DeleteDbFunc
}

// resourceMaps is member of dbmanager package
// ResourceStr 정의시 기존 단어를 포함하면 그 리스트의 상위에 지정하여야 함
var resourceMaps = []ResourceData{
	{ResourceType: ResourceTypeDefaultCore, ResourceStr: "CoreAvailableResources", UpdateHandler: nil, DeleteHandler: nil},
	{ResourceType: ResourceTypeDefaultApps, ResourceStr: "AppsAvailableResources", UpdateHandler: nil, DeleteHandler: nil},
	{ResourceType: ResourceTypeDefaultAutoscaling, ResourceStr: "AutoscalingAvailableResources", UpdateHandler: nil, DeleteHandler: nil},
	{ResourceType: ResourceTypeDefaultBatch, ResourceStr: "BatchAvailableResources", UpdateHandler: nil, DeleteHandler: nil},
	{ResourceType: ResourceTypeDefaultNetwork, ResourceStr: "NetworkAvailableResources", UpdateHandler: nil, DeleteHandler: nil},
	{ResourceType: ResourceTypeDefaultStorage, ResourceStr: "StorageAvailableResources", UpdateHandler: nil, DeleteHandler: nil},
	{ResourceType: ResourceTypeDefaultExt, ResourceStr: "ExtAvailableResources", UpdateHandler: nil, DeleteHandler: nil},

	{ResourceType: ResourceTypeNode, ResourceStr: "Node", UpdateHandler: setNode, DeleteHandler: deleteNode},
	{ResourceType: ResourceTypeConfigMap, ResourceStr: "ConfigMap", UpdateHandler: setConfigMap, DeleteHandler: deleteConfigMap},
	{ResourceType: ResourceTypeComponentStatus, ResourceStr: "ComponentStatus", UpdateHandler: setComponentStatus, DeleteHandler: nil},
	{ResourceType: ResourceTypeEvent, ResourceStr: "Event", UpdateHandler: setEvent, DeleteHandler: deleteEvent},
	{ResourceType: ResourceTypeNamespace, ResourceStr: "Namespace", UpdateHandler: setNamespace, DeleteHandler: deleteNamespace},
	{ResourceType: ResourceTypePersistentVolumeClaim, ResourceStr: "PersistentVolumeClaim", UpdateHandler: setPersistentVolumeClaim, DeleteHandler: deletePersistentVolumeClaim},
	{ResourceType: ResourceTypeReplicationController, ResourceStr: "ReplicationController", UpdateHandler: setReplicationController, DeleteHandler: deleteReplicationController},
	{ResourceType: ResourceTypeSecret, ResourceStr: "Secret", UpdateHandler: setSecret, DeleteHandler: deleteSecret},
	{ResourceType: ResourceTypeServiceAccount, ResourceStr: "ServiceAccount", UpdateHandler: setServiceAccount, DeleteHandler: deleteServiceAccount},
	{ResourceType: ResourceTypeService, ResourceStr: "Service", UpdateHandler: setService, DeleteHandler: deleteService},
	{ResourceType: ResourceTypeLimitRange, ResourceStr: "LimitRange", UpdateHandler: setLimitRange, DeleteHandler: deleteLimitRange},
	{ResourceType: ResourceTypeResourceQuota, ResourceStr: "ResourceQuota", UpdateHandler: setResourceQuota, DeleteHandler: deleteResourceQuota},
	{ResourceType: ResourceTypePersistentVolume, ResourceStr: "PersistentVolume", UpdateHandler: setPersistentVolume, DeleteHandler: deletePersistentVolume},
	{ResourceType: ResourceTypeControllerRevision, ResourceStr: "ControllerRevision", UpdateHandler: setControllerRevision, DeleteHandler: deleteControllerRevision},
	{ResourceType: ResourceTypeDaemonSet, ResourceStr: "DaemonSet", UpdateHandler: setDaemonset, DeleteHandler: deleteDaemonset},
	{ResourceType: ResourceTypeDeployment, ResourceStr: "Deployment", UpdateHandler: setDeployment, DeleteHandler: deleteDeployment},
	{ResourceType: ResourceTypeReplicaSet, ResourceStr: "ReplicaSet", UpdateHandler: setReplicaSet, DeleteHandler: deleteReplicaset},
	{ResourceType: ResourceTypeStatefulSet, ResourceStr: "StatefulSet", UpdateHandler: setStatefulSet, DeleteHandler: deleteStatefulset},
	{ResourceType: ResourceTypeHorizontalPodAutoscaler, ResourceStr: "HorizontalPodAutoscaler", UpdateHandler: setHorizontalPodAutoscaler, DeleteHandler: deleteHorizontalPodAutoscaler},
	{ResourceType: ResourceTypeJob, ResourceStr: "Job", UpdateHandler: setJob, DeleteHandler: deleteJob},
	{ResourceType: ResourceTypeNetworkPolicy, ResourceStr: "NetworkPolicy", UpdateHandler: setNetworkPolicy, DeleteHandler: deleteNetworkPolicy},
	{ResourceType: ResourceTypeStorageClass, ResourceStr: "StorageClass", UpdateHandler: setStorageClass, DeleteHandler: deleteStorageClass},
	{ResourceType: ResourceTypeVolumeAttachment, ResourceStr: "VolumeAttachment", UpdateHandler: setVolumeAttachment, DeleteHandler: deleteVolumeAttachment},
	{ResourceType: ResourceTypePod, ResourceStr: "Pod", UpdateHandler: setPod, DeleteHandler: deletePod},
}

// connectionString is member of dbmanager package.
var connectionString string

// SetConfig is member of dbmanager package
func SetConfig() {
	connectionString = fmt.Sprintf("%s:%s@tcp(%s:%s)/%s?allowNativePasswords=true&parseTime=true", viper.GetString("mariadb.username"), viper.GetString("mariadb.password"), viper.GetString("mariadb.host"), viper.GetString("mariadb.port"), viper.GetString("mariadb.dbname"))
	// connectionString = fmt.Sprintf("%s:%s@(%s:%s)/%s?allowNativePasswords=true&parseTime=true", viper.GetString("mariadb.username"), viper.GetString("mariadb.password"), viper.GetString("mariadb.host"), viper.GetString("mariadb.port"), viper.GetString("mariadb.dbname"))
	// connectionString = fmt.Sprintf("%s:%s@/%s?allowNativePasswords=true&parseTime=true", viper.GetString("mariadb.username"), viper.GetString("mariadb.password"), viper.GetString("mariadb.dbname"))
	log.Debug(connectionString)
	go initDB()
}

// initDB is member of dbmanager package
func initDB() {
	log.Debug("Call initDB()")
	db, _ := connectToMariaDB(connectionString)
	defer db.Close()

	log.Debug("Connected to MariaDB : " + viper.GetString("mariadb.host") + ":" + viper.GetString("mariadb.port") + " - " + viper.GetString("mariadb.dbname"))

	//var tableResource TableResource
	// if db.HasTable(tableResource.TableName()) == false {
	// 	db.CreateTable(&TableResource{})
	// }
	db.Table("TableUser").AutoMigrate(&RequestUser{})
	db.AutoMigrate(&TableResource{})
	db.AutoMigrate(&TableNode{})
	db.AutoMigrate(&TableConfigMap{})
	db.AutoMigrate(&TableComponentStatus{})
	db.AutoMigrate(&TableEvent{})
	db.AutoMigrate(&TableNamespace{})
	db.AutoMigrate(&TablePersistentVolumeClaim{})
	db.AutoMigrate(&TablePod{})
	db.AutoMigrate(&TableReplicationController{})
	db.AutoMigrate(&TableSecret{})
	db.AutoMigrate(&TableService{})
	db.AutoMigrate(&TableServiceAccount{})
	db.AutoMigrate(&TableLimitRange{})
	db.AutoMigrate(&TableResourceQuota{})
	db.AutoMigrate(&TablePersistentVolume{})
	db.AutoMigrate(&TableControllerRevision{})
	db.AutoMigrate(&TableDaemonset{})
	db.AutoMigrate(&TableDeployment{})
	db.AutoMigrate(&TableReplicaset{})
	db.AutoMigrate(&TableStatefulset{})
	db.AutoMigrate(&TableHorizontalPodAutoscaler{})
	db.AutoMigrate(&TableJob{})
	db.AutoMigrate(&TableNetworkPolicy{})
	db.AutoMigrate(&TableStorageClass{})
	db.AutoMigrate(&TableVolumeAttachment{})
	db.AutoMigrate(&TableAlertMessage{})
}

// Try to connect to the connectToMariaDB server as
// long as it takes to establish a connection
func connectToMariaDB(uri string) (*gorm.DB, error) {
	var db *gorm.DB
	var err error

	for {
		// log.Info("uri :", uri)
		db, err = gorm.Open("mysql", uri)
		if err == nil {
			break
		}

		// log.Info(err)
		url := fmt.Sprintf("tcp(%s:%s)/%s", viper.GetString("mariadb.host"), viper.GetString("mariadb.port"), viper.GetString("mariadb.dbname"))
		log.Info("Trying reconnect to MariaDB :", url)
		time.Sleep(1 * time.Minute)
	}

	return db, err
}

// TODO: mqSender (sendCmdToVimDriver-getMQData-ParseMsgData)
// sendCmdToVimDriver is member of dbmanager package
// func sendCmdToVimDriver(uri string) {
// 	uriString := fmt.Sprintf("%s/%s%s", util.TagURIStart, uri, util.TagURIEnd)
// 	var msg strings.Builder
// 	// Ex : <Request><System><Method>GET</Method><URI>/listNamespaceAll</URI>
// 	msg.WriteString(util.TagRequest + util.TagSystem + util.TagMethodStart + "GET" + util.TagMethodEnd + uriString)

// 	// sendResult := mq.SendMessageToVimDriver(msg.String())
// 	sendResult := mq.SendMessageToVimDriver(uri)
// 	if sendResult == true {
// 		log.Info("Send Success to VIM MessageQueue : " + msg.String())
// 	} else {
// 		log.Info("Send Fail to VIM MessageQueue (Disconnected MQ).")
// 	}
// }

// // getMQData is member of dbmanager package
// func getMQData() {
// 	for {
// 		select {
// 		case msgData := <-mq.MQCh:
// 			ParseMsgData(msgData)
// 		}
// 	}
// }

// ParseMsgData is member of dbmanager package
func ParseMsgData(data string) {
	if strings.HasPrefix(data, util.TagRequest) == false && strings.HasPrefix(data, util.TagResponse) == false {
		log.Info("parseReceivedMsg - Invalid data")
		return
	}

	if strings.HasPrefix(data, util.TagRequest) == true {
		// Ex : <Request><Method>GET</Method><URI>/listNamespaceAll</URI><FileData>...</FileData><Body>{"name":"test"}</Body>
		sendResult := mq.SendMessageToVimDriver(data)
		if sendResult == true {
			log.Info("Send Success to VIM MessageQueue : " + data)
		} else {
			log.Info("Send Fail to VIM MessageQueue (Disconnected MQ).")
		}
		return
	}

	// Ex : <Response><StatusCode>200</StatusCode><System><Method>GET</Method><URI>/listNamespaceAll</URI><ResData>...</ResData>
	////////////////////////////////////////////////////////////////////
	// Check the System
	/*
		fromSystem := false
		if strings.Contains(data, util.TagSystem) == true {
			fromSystem = true
		}
	*/

	////////////////////////////////////////////////////////////////////
	// Split to StatusCode
	beginIndex := strings.Index(data, util.TagStatusCodeStart)
	endIndex := strings.Index(data, util.TagStatusCodeEnd)
	statusString := data[(beginIndex + util.TagStatusCodeLen):endIndex]
	if len(statusString) < 1 {
		log.Info("parseReceivedMsg - Invalid data type(StatusCode invalid)")
		return
	}

	if isOkResponse(statusString) == false {
		log.Info("parseReceivedMsg - StatusCode not OK")
		return
	}

	////////////////////////////////////////////////////////////////////
	// Split to Method
	beginIndex = strings.Index(data, util.TagMethodStart)
	endIndex = strings.Index(data, util.TagMethodEnd)
	methodString := data[(beginIndex + util.TagMethodLen):endIndex]
	if len(methodString) < 3 {
		log.Info("parseReceivedMsg - Invalid data type(Method invalid)")
		return
	}

	////////////////////////////////////////////////////////////////////
	// Split to URI
	beginIndex = strings.Index(data, util.TagURIStart)
	endIndex = strings.Index(data, util.TagURIEnd)
	uriString := data[(beginIndex + util.TagURILen):endIndex]
	if len(uriString) < 3 {
		log.Info("parseReceivedMsg - Invalid data type(URI invalid)")
		return
	}

	////////////////////////////////////////////////////////////////////
	// Split to Namespace and Name
	var namespaceString, nameString string
	beginIndex = strings.Index(data, util.TagNamespaceStart)
	if beginIndex != -1 {
		endIndex = strings.Index(data, util.TagNamespaceEnd)
		namespaceString = data[(beginIndex + util.TagNamespaceLen):endIndex]
	}
	beginIndex = strings.Index(data, util.TagNameStart)
	if beginIndex != -1 {
		endIndex = strings.Index(data, util.TagNameEnd)
		nameString = data[(beginIndex + util.TagNameLen):endIndex]
	}

	log.Info("parseReceivedMsg => " + statusString + ", " + methodString + ", " + uriString)

	////////////////////////////////////////////////////////////////////
	// Split to ResData
	var dataString string
	if strings.Contains(data, util.TagResDataStart) == true {
		beginIndex = strings.Index(data, util.TagResDataStart)
		endIndex = strings.Index(data, util.TagResDataEnd)
		dataString = data[(beginIndex + util.TagResDataLen):endIndex]
		//log.Info("parseReceivedMsg - Exist Response Data : " + uriString) // dataString)
	}

	////////////////////////////////////////////////////////////////////
	// Write to DB
	var availRsc bool
	var resource ResourceData
	var idx int
	for idx, resource = range resourceMaps {
		if strings.Contains(uriString, resource.ResourceStr) == true {
			if resource.ResourceType <= ResourceTypeDefaultExt {
				availRsc = true
			}
			break
		}
	}

	if idx > ResourceTypeVolumeAttachment {
		return
	}

	db, err := gorm.Open("mysql", connectionString)
	if err != nil {
		log.Info("DB Open Error - ", err.Error())
		return
	}
	defer db.Close()

	if availRsc == true {
		var resources []client.V1ApiResource
		errUnmarshal := json.Unmarshal([]byte(dataString), &resources)
		if errUnmarshal != nil {
			return
		}

		for _, resource := range resources {
			category, _ := json.Marshal(resource.Categories)
			shortNames, _ := json.Marshal(resource.ShortNames)
			verb, _ := json.Marshal(resource.Verbs)

			resourceRec := TableResource{
				Categories:   string(category),
				Group:        resource.Group,
				Kind:         resource.Kind,
				Name:         resource.Name,
				Namespaced:   resource.Namespaced,
				ShortNames:   string(shortNames),
				SingularName: resource.SingularName,
				Verbs:        string(verb),
			}

			db.Where(TableResource{Name: resource.Name}).Assign(&resourceRec).FirstOrCreate(&resourceRec)
			if db.Error != nil {
				log.Info("DB FirstOrCreate Error! => " + db.Error.Error())
			}
		}
	} else {
		if strings.HasPrefix(uriString, "/delete") == true {
			bAll := false
			if strings.HasPrefix(uriString, "/deleteCollection") == true {
				bAll = true
			}

			if resource.DeleteHandler != nil {
				resource.DeleteHandler(db, bAll, namespaceString, nameString)
			} else {
				log.Info("DeleteHandler is nil !!!")
			}
			return
		}

		arryDataString := dataString
		if dataString[0] != '[' && dataString[len(dataString)-1] != ']' {
			arryDataString = fmt.Sprintf("[%s]", dataString)
		}

		if resource.UpdateHandler != nil {
			resource.UpdateHandler(db, []byte(arryDataString))
		} else {
			log.Info("UpdateHandler is nil !!!")
		}
	}
}

////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////

// setNode is member of dbmanager package
func setNode(db *gorm.DB, data []byte) {
	if data == nil {
		return
	}

	var nodes []client.V1Node
	errUnmarshal := json.Unmarshal(data, &nodes)
	if errUnmarshal != nil {
		return
	}

	for _, node := range nodes {
		annotations, _ := json.Marshal(node.Metadata.Annotations)
		labels, _ := json.Marshal(node.Metadata.Labels)
		spec, _ := json.Marshal(node.Spec)
		status, _ := json.Marshal(node.Status)

		var internalIP string
		for _, addr := range node.Status.Addresses {
			if strings.Compare(addr.Type_, "InternalIP") == 0 {
				internalIP = addr.Address
				break
			}
		}

		var nodeAllocatable NodeAllocatable
		allocatable, errMarshal := json.Marshal(node.Status.Allocatable)
		if errMarshal == nil {
			json.Unmarshal(allocatable, &nodeAllocatable)
		}

		var nodeCapacity NodeAllocatable
		allocatable, errMarshal = json.Marshal(node.Status.Capacity)
		if errMarshal == nil {
			json.Unmarshal(allocatable, &nodeCapacity)
		}

		//nodeStatus := "Not Ready"
		var nodeConditions []NodeCondition
		allocatable, errMarshal = json.Marshal(node.Status.Conditions)
		if errMarshal == nil {
			errUnmarshal := json.Unmarshal(allocatable, &nodeConditions)
			if errUnmarshal == nil {
				for _, nodeCondition := range nodeConditions {
					if strings.Compare(nodeCondition.Type, "Ready") == 0 {
						//nodeStatus = "Ready"
						log.Info("Status : [" + node.Metadata.Name + "] " + nodeCondition.Status)
						break
					}
				}
			}
		}

		nodeRec := TableNode{
			MetaData: MetaData{
				Annotations:       string(annotations),
				CreationTimestamp: node.Metadata.CreationTimestamp,
				DeletionTimestamp: node.Metadata.DeletionTimestamp,
				Labels:            string(labels),
				Name:              node.Metadata.Name,
				ResourceVersion:   node.Metadata.ResourceVersion,
				SelfLink:          node.Metadata.SelfLink,
				UID:               node.Metadata.Uid,
			},
			Spec:   string(spec),
			Status: string(status),

			CapacityCPU:    nodeCapacity.CPU,
			CapacityMEM:    nodeCapacity.Memory,
			AllocatableCPU: nodeAllocatable.CPU,
			AllocatableMEM: nodeAllocatable.Memory,
			InternalIP:     internalIP,
		}

		db.Where(TableNode{MetaData: MetaData{Name: node.Metadata.Name}}).Assign(&nodeRec).FirstOrCreate(&nodeRec)
		if db.Error != nil {
			log.Info("DB FirstOrCreate Error! => " + db.Error.Error())
		}
	}
}

// deleteNode is member of dbmanager package
func deleteNode(db *gorm.DB, isAll bool, _ string, name string) {
	if isAll == false && len(name) == 0 {
		log.Info("deleteNode Error! => Name: " + name)
		return
	}

	if isAll == true {
		db.Delete(&TableNode{})
		if db.Error != nil {
			log.Info("DB deleteCollectionNode Error! => " + db.Error.Error())
		}
		return
	}

	db.Where("Name = ?", name).Delete(&TableNode{})
	if db.Error != nil {
		log.Info("DB deleteNode Error! => " + db.Error.Error())
	}
}

// setConfigMap is member of dbmanager package
func setConfigMap(db *gorm.DB, data []byte) {
	if data == nil {
		return
	}

	var configMaps []client.V1ConfigMap
	errUnmarshal := json.Unmarshal(data, &configMaps)
	if errUnmarshal != nil {
		return
	}

	for _, configMap := range configMaps {
		data, _ := json.Marshal(configMap.Data)
		dataString := string(data)
		if len(dataString) > 1000 {
			dataString = dataString[:999]
		}
		annotations, _ := json.Marshal(configMap.Metadata.Annotations)
		labels, _ := json.Marshal(configMap.Metadata.Labels)

		configMapRec := TableConfigMap{
			Data: dataString,
			MetaData: MetaData{
				Annotations:       string(annotations),
				CreationTimestamp: configMap.Metadata.CreationTimestamp,
				DeletionTimestamp: configMap.Metadata.DeletionTimestamp,
				Labels:            string(labels),
				Name:              configMap.Metadata.Name,
				Namespace:         configMap.Metadata.Namespace,
				ResourceVersion:   configMap.Metadata.ResourceVersion,
				SelfLink:          configMap.Metadata.SelfLink,
				UID:               configMap.Metadata.Uid,
			},
		}

		db.Where(TableConfigMap{MetaData: MetaData{Name: configMap.Metadata.Name}}).Assign(&configMapRec).FirstOrCreate(&configMapRec)
		if db.Error != nil {
			log.Info("DB FirstOrCreate Error! => " + db.Error.Error())
		}
	}
}

// deleteConfigMap is member of dbmanager package
func deleteConfigMap(db *gorm.DB, isAll bool, namespace string, name string) {
	if isAll == false && (len(name) == 0 || len(namespace) == 0) {
		log.Info("deleteConfigMap Error! => Namespace: " + namespace + ", Name: " + name)
		return
	}

	if isAll == true {
		db.Where("Namespace = ?", namespace).Delete(&TableConfigMap{})
		if db.Error != nil {
			log.Info("DB deleteCollectionConfigMap Error! => " + db.Error.Error())
		}
		return
	}

	db.Where("Namespace = ? AND Name = ?", namespace, name).Delete(&TableConfigMap{})
	if db.Error != nil {
		log.Info("DB deleteConfigMap Error! => " + db.Error.Error())
	}
}

// setComponentStatus is member of dbmanager package
func setComponentStatus(db *gorm.DB, data []byte) {
	if data == nil {
		return
	}

	var componentStatuses []client.V1ComponentStatus
	errUnmarshal := json.Unmarshal(data, &componentStatuses)
	if errUnmarshal != nil {
		return
	}

	for _, componentStatus := range componentStatuses {
		conditions, _ := json.Marshal(componentStatus.Conditions)

		componentStatusRec := TableComponentStatus{
			Conditions: string(conditions),
			MetaData: MetaData{
				CreationTimestamp: componentStatus.Metadata.CreationTimestamp,
				DeletionTimestamp: componentStatus.Metadata.DeletionTimestamp,
				Name:              componentStatus.Metadata.Name,
				SelfLink:          componentStatus.Metadata.SelfLink,
			},
		}

		db.Where(TableComponentStatus{MetaData: MetaData{Name: componentStatus.Metadata.Name}}).Assign(&componentStatusRec).FirstOrCreate(&componentStatusRec)
		if db.Error != nil {
			log.Info("DB FirstOrCreate Error! => " + db.Error.Error())
		}
	}
}

// setEvent is member of dbmanager package
func setEvent(db *gorm.DB, data []byte) {
	if data == nil {
		return
	}

	var events []client.V1Event
	errUnmarshal := json.Unmarshal(data, &events)
	if errUnmarshal != nil {
		return
	}

	for _, event := range events {
		involvedObject, _ := json.Marshal(event.InvolvedObject)
		source, _ := json.Marshal(event.Source)
		message := event.Message
		if len(message) > 255 {
			message = message[:254]
		}

		eventRec := TableEvent{
			Count:          event.Count,
			EventTime:      event.EventTime,
			FirstTimestamp: event.FirstTimestamp,
			InvolvedObject: string(involvedObject),
			LastTimestamp:  event.LastTimestamp,
			Message:        message,
			MetaData: MetaData{
				CreationTimestamp: event.Metadata.CreationTimestamp,
				DeletionTimestamp: event.Metadata.DeletionTimestamp,
				Name:              event.Metadata.Name,
				Namespace:         event.Metadata.Namespace,
				ResourceVersion:   event.Metadata.ResourceVersion,
				SelfLink:          event.Metadata.SelfLink,
				UID:               event.Metadata.Uid,
			},
			Reason: event.Reason,
			Source: string(source),
			Type:   event.Type_,
		}

		db.Where(TableEvent{MetaData: MetaData{Name: event.Metadata.Name}}).Assign(&eventRec).FirstOrCreate(&eventRec)
		if db.Error != nil {
			log.Info("DB FirstOrCreate Error! => " + db.Error.Error())
		}
	}
}

// deleteEvent is member of dbmanager package
func deleteEvent(db *gorm.DB, isAll bool, namespace string, name string) {
	if isAll == false && (len(name) == 0 || len(namespace) == 0) {
		log.Info("deleteEvent Error! => Namespace: " + namespace + ", Name: " + name)
		return
	}

	if isAll == true {
		db.Where("Namespace = ?", namespace).Delete(&TableEvent{})
		if db.Error != nil {
			log.Info("DB deleteCollectionEvent Error! => " + db.Error.Error())
		}
		return
	}

	db.Where("Namespace = ? AND Name = ?", namespace, name).Delete(&TableEvent{})
	if db.Error != nil {
		log.Info("DB deleteEvent Error! => " + db.Error.Error())
	}
}

// setNamespace is member of dbmanager package
func setNamespace(db *gorm.DB, data []byte) {
	if data == nil {
		return
	}

	var namespaces []client.V1Namespace
	errUnmarshal := json.Unmarshal(data, &namespaces)
	if errUnmarshal != nil {
		return
	}

	for _, namespace := range namespaces {
		annotations, _ := json.Marshal(namespace.Metadata.Annotations)
		labels, _ := json.Marshal(namespace.Metadata.Labels)
		spec, _ := json.Marshal(namespace.Spec)
		status, _ := json.Marshal(namespace.Status)

		namespaceRec := TableNamespace{
			MetaData: MetaData{
				Annotations:       string(annotations),
				CreationTimestamp: namespace.Metadata.CreationTimestamp,
				DeletionTimestamp: namespace.Metadata.DeletionTimestamp,
				Labels:            string(labels),
				Name:              namespace.Metadata.Name,
				ResourceVersion:   namespace.Metadata.ResourceVersion,
				SelfLink:          namespace.Metadata.SelfLink,
				UID:               namespace.Metadata.Uid,
			},
			Spec:   string(spec),
			Status: string(status),
		}

		db.Where(TableNamespace{MetaData: MetaData{Name: namespace.Metadata.Name}}).Assign(&namespaceRec).FirstOrCreate(&namespaceRec)
		if db.Error != nil {
			log.Info("DB FirstOrCreate Error! => " + db.Error.Error())
		}
	}
}

// deleteNamespace is member of dbmanager package
func deleteNamespace(db *gorm.DB, isAll bool, _ string, name string) {
	if isAll == false && len(name) == 0 {
		log.Info("deleteNamespace Error! => Name: " + name)
		return
	}

	if isAll == true {
		return
	}

	db.Where("Name = ?", name).Delete(&TableNamespace{})
	if db.Error != nil {
		log.Info("DB deleteNamespace Error! => " + db.Error.Error())
	}
}

// setPersistentVolumeClaim is member of dbmanager package
func setPersistentVolumeClaim(db *gorm.DB, data []byte) {
	if data == nil {
		return
	}

	var persistentVolumeClaims []client.V1PersistentVolumeClaim
	errUnmarshal := json.Unmarshal(data, &persistentVolumeClaims)
	if errUnmarshal != nil {
		return
	}

	for _, persistentVolumeClaim := range persistentVolumeClaims {
		finalizers, _ := json.Marshal(persistentVolumeClaim.Metadata.Finalizers)
		labels, _ := json.Marshal(persistentVolumeClaim.Metadata.Labels)
		spec, _ := json.Marshal(persistentVolumeClaim.Spec)
		status, _ := json.Marshal(persistentVolumeClaim.Status)

		persistentVolumeClaimRec := TablePersistentVolumeClaim{
			MetaData: MetaData{
				CreationTimestamp: persistentVolumeClaim.Metadata.CreationTimestamp,
				DeletionTimestamp: persistentVolumeClaim.Metadata.DeletionTimestamp,
				Finalizers:        string(finalizers),
				Labels:            string(labels),
				Name:              persistentVolumeClaim.Metadata.Name,
				Namespace:         persistentVolumeClaim.Metadata.Namespace,
				ResourceVersion:   persistentVolumeClaim.Metadata.ResourceVersion,
				SelfLink:          persistentVolumeClaim.Metadata.SelfLink,
				UID:               persistentVolumeClaim.Metadata.Uid,
			},
			Spec:   string(spec),
			Status: string(status),
		}

		db.Where(TablePersistentVolumeClaim{MetaData: MetaData{Name: persistentVolumeClaim.Metadata.Name}}).Assign(&persistentVolumeClaimRec).FirstOrCreate(&persistentVolumeClaimRec)
		if db.Error != nil {
			log.Info("DB FirstOrCreate Error! => " + db.Error.Error())
		}
	}
}

// deletePersistentVolumeClaim is member of dbmanager package
func deletePersistentVolumeClaim(db *gorm.DB, isAll bool, namespace string, name string) {
	if isAll == false && (len(name) == 0 || len(namespace) == 0) {
		log.Info("deletePersistentVolumeClaim Error! => Namespace: " + namespace + ", Name: " + name)
		return
	}

	if isAll == true {
		db.Where("Namespace = ?", namespace).Delete(&TablePersistentVolumeClaim{})
		if db.Error != nil {
			log.Info("DB deleteCollectionPersistentVolumeClaim Error! => " + db.Error.Error())
		}
		return
	}

	db.Where("Namespace = ? AND Name = ?", namespace, name).Delete(&TablePersistentVolumeClaim{})
	if db.Error != nil {
		log.Info("DB deletePersistentVolumeClaim Error! => " + db.Error.Error())
	}
}

// setPod is member of dbmanager package
func setPod(db *gorm.DB, data []byte) {
	if data == nil {
		return
	}

	var pods []client.V1Pod
	errUnmarshal := json.Unmarshal(data, &pods)
	if errUnmarshal != nil {
		return
	}

	for _, pod := range pods {
		annotations, _ := json.Marshal(pod.Metadata.Annotations)
		labels, _ := json.Marshal(pod.Metadata.Labels)
		ownerReferences, _ := json.Marshal(pod.Metadata.OwnerReferences)
		spec, _ := json.Marshal(pod.Spec)
		status, _ := json.Marshal(pod.Status)

		podRec := TablePod{
			MetaData: MetaData{
				Annotations:       string(annotations),
				CreationTimestamp: pod.Metadata.CreationTimestamp,
				DeletionTimestamp: pod.Metadata.DeletionTimestamp,
				GenerateName:      pod.Metadata.GenerateName,
				Labels:            string(labels),
				Name:              pod.Metadata.Name,
				Namespace:         pod.Metadata.Namespace,
				OwnerReferences:   string(ownerReferences),
				ResourceVersion:   pod.Metadata.ResourceVersion,
				SelfLink:          pod.Metadata.SelfLink,
				UID:               pod.Metadata.Uid,
			},
			Spec:   string(spec),
			Status: string(status),
		}

		db.Where(TablePod{MetaData: MetaData{Name: pod.Metadata.Name}}).Assign(&podRec).FirstOrCreate(&podRec)
		if db.Error != nil {
			log.Info("DB FirstOrCreate Error! => " + db.Error.Error())
		}
	}
}

// deletePod is member of dbmanager package
func deletePod(db *gorm.DB, isAll bool, namespace string, name string) {
	if isAll == false && (len(name) == 0 || len(namespace) == 0) {
		log.Info("deletePod Error! => Namespace: " + namespace + ", Name: " + name)
		return
	}

	if isAll == true {
		db.Where("Namespace = ?", namespace).Delete(&TablePod{})
		if db.Error != nil {
			log.Info("DB deleteCollectionPod Error! => " + db.Error.Error())
		}
		return
	}

	db.Where("Namespace = ? AND Name = ?", namespace, name).Delete(&TablePod{})
	if db.Error != nil {
		log.Info("DB deletePod Error! => " + db.Error.Error())
	}
}

// setReplicationController is member of dbmanager package
func setReplicationController(db *gorm.DB, data []byte) {
	if data == nil {
		return
	}

	var replicationControllers []client.V1ReplicationController
	errUnmarshal := json.Unmarshal(data, &replicationControllers)
	if errUnmarshal != nil {
		return
	}

	for _, replicationController := range replicationControllers {
		labels, _ := json.Marshal(replicationController.Metadata.Labels)
		spec, _ := json.Marshal(replicationController.Spec)
		status, _ := json.Marshal(replicationController.Status)

		replicationControllerRec := TableReplicationController{
			MetaData: MetaData{
				CreationTimestamp: replicationController.Metadata.CreationTimestamp,
				DeletionTimestamp: replicationController.Metadata.DeletionTimestamp,
				Generation:        replicationController.Metadata.Generation,
				Labels:            string(labels),
				Name:              replicationController.Metadata.Name,
				Namespace:         replicationController.Metadata.Namespace,
				ResourceVersion:   replicationController.Metadata.ResourceVersion,
				SelfLink:          replicationController.Metadata.SelfLink,
				UID:               replicationController.Metadata.Uid,
			},
			Spec:   string(spec),
			Status: string(status),
		}

		db.Where(TableReplicationController{MetaData: MetaData{Name: replicationController.Metadata.Name}}).Assign(&replicationControllerRec).FirstOrCreate(&replicationControllerRec)
		if db.Error != nil {
			log.Info("DB FirstOrCreate Error! => " + db.Error.Error())
		}
	}
}

// deleteReplicationController is member of dbmanager package
func deleteReplicationController(db *gorm.DB, isAll bool, namespace string, name string) {
	if isAll == false && (len(name) == 0 || len(namespace) == 0) {
		log.Info("deleteReplicationController Error! => Namespace: " + namespace + ", Name: " + name)
		return
	}

	if isAll == true {
		db.Where("Namespace = ?", namespace).Delete(&TableReplicationController{})
		if db.Error != nil {
			log.Info("DB deleteCollectionReplicationController Error! => " + db.Error.Error())
		}
		return
	}

	db.Where("Namespace = ? AND Name = ?", namespace, name).Delete(&TableReplicationController{})
	if db.Error != nil {
		log.Info("DB deleteReplicationController Error! => " + db.Error.Error())
	}
}

// setSecret is member of dbmanager package
func setSecret(db *gorm.DB, data []byte) {
	if data == nil {
		return
	}

	var secrets []client.V1Secret
	errUnmarshal := json.Unmarshal(data, &secrets)
	if errUnmarshal != nil {
		return
	}

	for _, secret := range secrets {
		data, _ := json.Marshal(secret.Data)
		annotations, _ := json.Marshal(secret.Metadata.Annotations)
		labels, _ := json.Marshal(secret.Metadata.Labels)
		ownerReferences, _ := json.Marshal(secret.Metadata.OwnerReferences)

		secretRec := TableSecret{
			Data: string(data),
			MetaData: MetaData{
				Annotations:       string(annotations),
				CreationTimestamp: secret.Metadata.CreationTimestamp,
				DeletionTimestamp: secret.Metadata.DeletionTimestamp,
				Labels:            string(labels),
				Name:              secret.Metadata.Name,
				Namespace:         secret.Metadata.Namespace,
				OwnerReferences:   string(ownerReferences),
				ResourceVersion:   secret.Metadata.ResourceVersion,
				SelfLink:          secret.Metadata.SelfLink,
				UID:               secret.Metadata.Uid,
			},
			Type: secret.Type_,
		}

		db.Where(TableSecret{MetaData: MetaData{Name: secret.Metadata.Name}}).Assign(&secretRec).FirstOrCreate(&secretRec)
		if db.Error != nil {
			log.Info("DB FirstOrCreate Error! => " + db.Error.Error())
		}
	}
}

// deleteSecret is member of dbmanager package
func deleteSecret(db *gorm.DB, isAll bool, namespace string, name string) {
	if isAll == false && (len(name) == 0 || len(namespace) == 0) {
		log.Info("deleteSecret Error! => Namespace: " + namespace + ", Name: " + name)
		return
	}

	if isAll == true {
		db.Where("Namespace = ?", namespace).Delete(&TableSecret{})
		if db.Error != nil {
			log.Info("DB deleteCollectionSecret Error! => " + db.Error.Error())
		}
		return
	}

	db.Where("Namespace = ? AND Name = ?", namespace, name).Delete(&TableSecret{})
	if db.Error != nil {
		log.Info("DB deleteSecret Error! => " + db.Error.Error())
	}
}

// setService is member of dbmanager package
func setService(db *gorm.DB, data []byte) {
	if data == nil {
		return
	}

	var services []client.V1Service
	errUnmarshal := json.Unmarshal(data, &services)
	if errUnmarshal != nil {
		return
	}

	for _, service := range services {
		annotations, _ := json.Marshal(service.Metadata.Annotations)
		labels, _ := json.Marshal(service.Metadata.Labels)
		ownerReferences, _ := json.Marshal(service.Metadata.OwnerReferences)
		spec, _ := json.Marshal(service.Spec)
		status, _ := json.Marshal(service.Status)

		serviceRec := TableService{
			MetaData: MetaData{
				Annotations:       string(annotations),
				CreationTimestamp: service.Metadata.CreationTimestamp,
				DeletionTimestamp: service.Metadata.DeletionTimestamp,
				Labels:            string(labels),
				Name:              service.Metadata.Name,
				Namespace:         service.Metadata.Namespace,
				OwnerReferences:   string(ownerReferences),
				ResourceVersion:   service.Metadata.ResourceVersion,
				SelfLink:          service.Metadata.SelfLink,
				UID:               service.Metadata.Uid,
			},
			Spec:   string(spec),
			Status: string(status),
		}

		db.Where(TableService{MetaData: MetaData{Name: service.Metadata.Name}}).Assign(&serviceRec).FirstOrCreate(&serviceRec)
		if db.Error != nil {
			log.Info("DB FirstOrCreate Error! => " + db.Error.Error())
		}
	}
}

// deleteService is member of dbmanager package
func deleteService(db *gorm.DB, isAll bool, namespace string, name string) {
	if isAll == false && (len(name) == 0 || len(namespace) == 0) {
		log.Info("deleteService Error! => Namespace: " + namespace + ", Name: " + name)
		return
	}

	if isAll == true {
		return
	}

	db.Where("Namespace = ? AND Name = ?", namespace, name).Delete(&TableService{})
	if db.Error != nil {
		log.Info("DB deleteService Error! => " + db.Error.Error())
	}
}

// setServiceAccount is member of dbmanager package
func setServiceAccount(db *gorm.DB, data []byte) {
	if data == nil {
		return
	}

	var serviceAccounts []client.V1ServiceAccount
	errUnmarshal := json.Unmarshal(data, &serviceAccounts)
	if errUnmarshal != nil {
		return
	}

	for _, serviceAccount := range serviceAccounts {
		annotations, _ := json.Marshal(serviceAccount.Metadata.Annotations)
		labels, _ := json.Marshal(serviceAccount.Metadata.Labels)
		secrets, _ := json.Marshal(serviceAccount.Secrets)

		serviceAccountRec := TableServiceAccount{
			MetaData: MetaData{
				Annotations:       string(annotations),
				CreationTimestamp: serviceAccount.Metadata.CreationTimestamp,
				DeletionTimestamp: serviceAccount.Metadata.DeletionTimestamp,
				Labels:            string(labels),
				Name:              serviceAccount.Metadata.Name,
				Namespace:         serviceAccount.Metadata.Namespace,
				ResourceVersion:   serviceAccount.Metadata.ResourceVersion,
				SelfLink:          serviceAccount.Metadata.SelfLink,
				UID:               serviceAccount.Metadata.Uid,
			},
			Secrets: string(secrets),
		}

		db.Where(TableServiceAccount{MetaData: MetaData{Name: serviceAccount.Metadata.Name}}).Assign(&serviceAccountRec).FirstOrCreate(&serviceAccountRec)
		if db.Error != nil {
			log.Info("DB FirstOrCreate Error! => " + db.Error.Error())
		}
	}
}

// deleteServiceAccount is member of dbmanager package
func deleteServiceAccount(db *gorm.DB, isAll bool, namespace string, name string) {
	if isAll == false && (len(name) == 0 || len(namespace) == 0) {
		log.Info("deleteServiceAccount Error! => Namespace: " + namespace + ", Name: " + name)
		return
	}

	if isAll == true {
		db.Where("Namespace = ?", namespace).Delete(&TableServiceAccount{})
		if db.Error != nil {
			log.Info("DB deleteCollectionServiceAccount Error! => " + db.Error.Error())
		}
		return
	}

	db.Where("Namespace = ? AND Name = ?", namespace, name).Delete(&TableServiceAccount{})
	if db.Error != nil {
		log.Info("DB deleteServiceAccount Error! => " + db.Error.Error())
	}
}

// setLimitRange is member of dbmanager package
func setLimitRange(db *gorm.DB, data []byte) {
	if data == nil {
		return
	}

	var limitRanges []client.V1LimitRange
	errUnmarshal := json.Unmarshal(data, &limitRanges)
	if errUnmarshal != nil {
		return
	}

	for _, limitRange := range limitRanges {
		annotations, _ := json.Marshal(limitRange.Metadata.Annotations)
		labels, _ := json.Marshal(limitRange.Metadata.Labels)
		spec, _ := json.Marshal(limitRange.Spec)

		limitRangeRec := TableLimitRange{
			MetaData: MetaData{
				Annotations:       string(annotations),
				CreationTimestamp: limitRange.Metadata.CreationTimestamp,
				DeletionTimestamp: limitRange.Metadata.DeletionTimestamp,
				Labels:            string(labels),
				Name:              limitRange.Metadata.Name,
				Namespace:         limitRange.Metadata.Namespace,
				ResourceVersion:   limitRange.Metadata.ResourceVersion,
				SelfLink:          limitRange.Metadata.SelfLink,
				UID:               limitRange.Metadata.Uid,
			},
			Spec: string(spec),
		}

		db.Where(TableLimitRange{MetaData: MetaData{Name: limitRange.Metadata.Name}}).Assign(&limitRangeRec).FirstOrCreate(&limitRangeRec)
		if db.Error != nil {
			log.Info("DB FirstOrCreate Error! => " + db.Error.Error())
		}
	}
}

// deleteLimitRange is member of dbmanager package
func deleteLimitRange(db *gorm.DB, isAll bool, namespace string, name string) {
	if isAll == false && (len(name) == 0 || len(namespace) == 0) {
		log.Info("deleteLimitRange Error! => Namespace: " + namespace + ", Name: " + name)
		return
	}

	if isAll == true {
		db.Where("Namespace = ?", namespace).Delete(&TableLimitRange{})
		if db.Error != nil {
			log.Info("DB deleteCollectionLimitRange Error! => " + db.Error.Error())
		}
		return
	}

	db.Where("Namespace = ? AND Name = ?", namespace, name).Delete(&TableLimitRange{})
	if db.Error != nil {
		log.Info("DB deleteLimitRange Error! => " + db.Error.Error())
	}
}

// setResourceQuota is member of dbmanager package
func setResourceQuota(db *gorm.DB, data []byte) {
	if data == nil {
		return
	}

	var resourceQuotas []client.V1ResourceQuota
	errUnmarshal := json.Unmarshal(data, &resourceQuotas)
	if errUnmarshal != nil {
		return
	}

	for _, resourceQuota := range resourceQuotas {
		annotations, _ := json.Marshal(resourceQuota.Metadata.Annotations)
		labels, _ := json.Marshal(resourceQuota.Metadata.Labels)
		spec, _ := json.Marshal(resourceQuota.Spec)
		status, _ := json.Marshal(resourceQuota.Status)

		resourceQuotaRec := TableResourceQuota{
			MetaData: MetaData{
				Annotations:       string(annotations),
				CreationTimestamp: resourceQuota.Metadata.CreationTimestamp,
				DeletionTimestamp: resourceQuota.Metadata.DeletionTimestamp,
				Labels:            string(labels),
				Name:              resourceQuota.Metadata.Name,
				Namespace:         resourceQuota.Metadata.Namespace,
				ResourceVersion:   resourceQuota.Metadata.ResourceVersion,
				SelfLink:          resourceQuota.Metadata.SelfLink,
				UID:               resourceQuota.Metadata.Uid,
			},
			Spec:   string(spec),
			Status: string(status),
		}

		db.Where(TableResourceQuota{MetaData: MetaData{Name: resourceQuota.Metadata.Name}}).Assign(&resourceQuotaRec).FirstOrCreate(&resourceQuotaRec)
		if db.Error != nil {
			log.Info("DB FirstOrCreate Error! => " + db.Error.Error())
		}
	}
}

// deleteResourceQuota is member of dbmanager package
func deleteResourceQuota(db *gorm.DB, isAll bool, namespace string, name string) {
	if isAll == false && (len(name) == 0 || len(namespace) == 0) {
		log.Info("deleteResourceQuota Error! => Namespace: " + namespace + ", Name: " + name)
		return
	}

	if isAll == true {
		db.Where("Namespace = ?", namespace).Delete(&TableResourceQuota{})
		if db.Error != nil {
			log.Info("DB deleteCollectionResourceQuota Error! => " + db.Error.Error())
		}
		return
	}

	db.Where("Namespace = ? AND Name = ?", namespace, name).Delete(&TableResourceQuota{})
	if db.Error != nil {
		log.Info("DB deleteResourceQuota Error! => " + db.Error.Error())
	}
}

// setPersistentVolume is member of dbmanager package
func setPersistentVolume(db *gorm.DB, data []byte) {
	if data == nil {
		return
	}

	var persistentVolumes []client.V1PersistentVolume
	errUnmarshal := json.Unmarshal(data, &persistentVolumes)
	if errUnmarshal != nil {
		return
	}

	for _, persistentVolume := range persistentVolumes {
		annotations, _ := json.Marshal(persistentVolume.Metadata.Annotations)
		labels, _ := json.Marshal(persistentVolume.Metadata.Labels)
		spec, _ := json.Marshal(persistentVolume.Spec)
		status, _ := json.Marshal(persistentVolume.Status)

		persistentVolumeRec := TablePersistentVolume{
			MetaData: MetaData{
				Annotations:       string(annotations),
				CreationTimestamp: persistentVolume.Metadata.CreationTimestamp,
				DeletionTimestamp: persistentVolume.Metadata.DeletionTimestamp,
				Labels:            string(labels),
				Name:              persistentVolume.Metadata.Name,
				Namespace:         persistentVolume.Metadata.Namespace,
				ResourceVersion:   persistentVolume.Metadata.ResourceVersion,
				SelfLink:          persistentVolume.Metadata.SelfLink,
				UID:               persistentVolume.Metadata.Uid,
			},
			Spec:   string(spec),
			Status: string(status),
		}

		db.Where(TablePersistentVolume{MetaData: MetaData{Name: persistentVolume.Metadata.Name}}).Assign(&persistentVolumeRec).FirstOrCreate(&persistentVolumeRec)
		if db.Error != nil {
			log.Info("DB FirstOrCreate Error! => " + db.Error.Error())
		}
	}
}

// deletePersistentVolume is member of dbmanager package
func deletePersistentVolume(db *gorm.DB, isAll bool, _ string, name string) {
	if isAll == false && len(name) == 0 {
		log.Info("deletePersistentVolume Error! => Name: " + name)
		return
	}

	if isAll == true {
		db.Delete(&TablePersistentVolume{})
		if db.Error != nil {
			log.Info("DB deleteCollectionPersistentVolume Error! => " + db.Error.Error())
		}
		return
	}

	db.Where("Name = ?", name).Delete(&TablePersistentVolume{})
	if db.Error != nil {
		log.Info("DB deletePersistentVolume Error! => " + db.Error.Error())
	}
}

// setControllerRevision is member of dbmanager package
func setControllerRevision(db *gorm.DB, data []byte) {
	if data == nil {
		return
	}

	var controllerRevisions []client.V1ControllerRevision
	errUnmarshal := json.Unmarshal(data, &controllerRevisions)
	if errUnmarshal != nil {
		return
	}

	for _, controllerRevision := range controllerRevisions {
		data, _ := json.Marshal(controllerRevision.Data)
		annotations, _ := json.Marshal(controllerRevision.Metadata.Annotations)
		labels, _ := json.Marshal(controllerRevision.Metadata.Labels)
		ownerReferences, _ := json.Marshal(controllerRevision.Metadata.OwnerReferences)

		controllerRevisionRec := TableControllerRevision{
			Data: string(data),
			MetaData: MetaData{
				Annotations:       string(annotations),
				CreationTimestamp: controllerRevision.Metadata.CreationTimestamp,
				DeletionTimestamp: controllerRevision.Metadata.DeletionTimestamp,
				Labels:            string(labels),
				Name:              controllerRevision.Metadata.Name,
				Namespace:         controllerRevision.Metadata.Namespace,
				OwnerReferences:   string(ownerReferences),
				ResourceVersion:   controllerRevision.Metadata.ResourceVersion,
				SelfLink:          controllerRevision.Metadata.SelfLink,
				UID:               controllerRevision.Metadata.Uid,
			},
			Revision: controllerRevision.Revision,
		}

		db.Where(TableControllerRevision{MetaData: MetaData{Name: controllerRevision.Metadata.Name}}).Assign(&controllerRevisionRec).FirstOrCreate(&controllerRevisionRec)
		if db.Error != nil {
			log.Info("DB FirstOrCreate Error! => " + db.Error.Error())
		}
	}
}

// deleteControllerRevision is member of dbmanager package
func deleteControllerRevision(db *gorm.DB, isAll bool, namespace string, name string) {
	if isAll == false && (len(name) == 0 || len(namespace) == 0) {
		log.Info("deleteControllerRevision Error! => Namespace: " + namespace + ", Name: " + name)
		return
	}

	if isAll == true {
		db.Where("Namespace = ?", namespace).Delete(&TableControllerRevision{})
		if db.Error != nil {
			log.Info("DB deleteCollectionControllerRevision Error! => " + db.Error.Error())
		}
		return
	}

	db.Where("Namespace = ? AND Name = ?", namespace, name).Delete(&TableControllerRevision{})
	if db.Error != nil {
		log.Info("DB deleteControllerRevision Error! => " + db.Error.Error())
	}
}

// setDaemonset is member of dbmanager package
func setDaemonset(db *gorm.DB, data []byte) {
	if data == nil {
		return
	}

	var daemonsets []client.V1DaemonSet
	errUnmarshal := json.Unmarshal(data, &daemonsets)
	if errUnmarshal != nil {
		return
	}

	for _, daemonset := range daemonsets {
		annotations, _ := json.Marshal(daemonset.Metadata.Annotations)
		labels, _ := json.Marshal(daemonset.Metadata.Labels)
		spec, _ := json.Marshal(daemonset.Spec)
		status, _ := json.Marshal(daemonset.Status)

		daemonsetRec := TableDaemonset{
			MetaData: MetaData{
				Annotations:       string(annotations),
				CreationTimestamp: daemonset.Metadata.CreationTimestamp,
				DeletionTimestamp: daemonset.Metadata.DeletionTimestamp,
				Generation:        daemonset.Metadata.Generation,
				Labels:            string(labels),
				Name:              daemonset.Metadata.Name,
				Namespace:         daemonset.Metadata.Namespace,
				ResourceVersion:   daemonset.Metadata.ResourceVersion,
				SelfLink:          daemonset.Metadata.SelfLink,
				UID:               daemonset.Metadata.Uid,
			},
			Spec:   string(spec),
			Status: string(status),
		}

		db.Where(TableDaemonset{MetaData: MetaData{Name: daemonset.Metadata.Name}}).Assign(&daemonsetRec).FirstOrCreate(&daemonsetRec)
		if db.Error != nil {
			log.Info("DB FirstOrCreate Error! => " + db.Error.Error())
		}
	}
}

// deleteDaemonset is member of dbmanager package
func deleteDaemonset(db *gorm.DB, isAll bool, namespace string, name string) {
	if isAll == false && (len(name) == 0 || len(namespace) == 0) {
		log.Info("deleteDaemonset Error! => Namespace: " + namespace + ", Name: " + name)
		return
	}

	if isAll == true {
		db.Where("Namespace = ?", namespace).Delete(&TableDaemonset{})
		if db.Error != nil {
			log.Info("DB deleteCollectionDaemonset Error! => " + db.Error.Error())
		}
		return
	}

	db.Where("Namespace = ? AND Name = ?", namespace, name).Delete(&TableDaemonset{})
	if db.Error != nil {
		log.Info("DB deleteDaemonset Error! => " + db.Error.Error())
	}
}

// setDeployment is member of dbmanager package
func setDeployment(db *gorm.DB, data []byte) {
	if data == nil {
		return
	}

	var deployments []client.V1Deployment
	errUnmarshal := json.Unmarshal(data, &deployments)
	if errUnmarshal != nil {
		return
	}

	for _, deployment := range deployments {
		annotations, _ := json.Marshal(deployment.Metadata.Annotations)
		labels, _ := json.Marshal(deployment.Metadata.Labels)
		spec, _ := json.Marshal(deployment.Spec)
		status, _ := json.Marshal(deployment.Status)

		deploymentRec := TableDeployment{
			MetaData: MetaData{
				Annotations:       string(annotations),
				CreationTimestamp: deployment.Metadata.CreationTimestamp,
				DeletionTimestamp: deployment.Metadata.DeletionTimestamp,
				Generation:        deployment.Metadata.Generation,
				Labels:            string(labels),
				Name:              deployment.Metadata.Name,
				Namespace:         deployment.Metadata.Namespace,
				ResourceVersion:   deployment.Metadata.ResourceVersion,
				SelfLink:          deployment.Metadata.SelfLink,
				UID:               deployment.Metadata.Uid,
			},
			Spec:   string(spec),
			Status: string(status),
		}

		db.Where(TableDeployment{MetaData: MetaData{Name: deployment.Metadata.Name}}).Assign(&deploymentRec).FirstOrCreate(&deploymentRec)
		if db.Error != nil {
			log.Info("DB FirstOrCreate Error! => " + db.Error.Error())
		}
	}
}

// deleteDeployment is member of dbmanager package
func deleteDeployment(db *gorm.DB, isAll bool, namespace string, name string) {
	if isAll == false && (len(name) == 0 || len(namespace) == 0) {
		log.Info("deleteDeployment Error! => Namespace: " + namespace + ", Name: " + name)
		return
	}

	if isAll == true {
		db.Where("Namespace = ?", namespace).Delete(&TableDeployment{})
		if db.Error != nil {
			log.Info("DB deleteCollectionDeployment Error! => " + db.Error.Error())
		}
		return
	}

	db.Where("Namespace = ? AND Name = ?", namespace, name).Delete(&TableDeployment{})
	if db.Error != nil {
		log.Info("DB deleteDeployment Error! => " + db.Error.Error())
	}
}

// setReplicaSet is member of dbmanager package
func setReplicaSet(db *gorm.DB, data []byte) {
	if data == nil {
		return
	}

	var replicaSets []client.V1ReplicaSet
	errUnmarshal := json.Unmarshal(data, &replicaSets)
	if errUnmarshal != nil {
		return
	}

	for _, replicaSet := range replicaSets {
		annotations, _ := json.Marshal(replicaSet.Metadata.Annotations)
		labels, _ := json.Marshal(replicaSet.Metadata.Labels)
		ownerReferences, _ := json.Marshal(replicaSet.Metadata.OwnerReferences)
		spec, _ := json.Marshal(replicaSet.Spec)
		status, _ := json.Marshal(replicaSet.Status)

		replicaSetRec := TableReplicaset{
			MetaData: MetaData{
				Annotations:       string(annotations),
				CreationTimestamp: replicaSet.Metadata.CreationTimestamp,
				DeletionTimestamp: replicaSet.Metadata.DeletionTimestamp,
				Generation:        replicaSet.Metadata.Generation,
				Labels:            string(labels),
				Name:              replicaSet.Metadata.Name,
				Namespace:         replicaSet.Metadata.Namespace,
				OwnerReferences:   string(ownerReferences),
				ResourceVersion:   replicaSet.Metadata.ResourceVersion,
				SelfLink:          replicaSet.Metadata.SelfLink,
				UID:               replicaSet.Metadata.Uid,
			},
			Spec:   string(spec),
			Status: string(status),
		}

		db.Where(TableReplicaset{MetaData: MetaData{Name: replicaSet.Metadata.Name}}).Assign(&replicaSetRec).FirstOrCreate(&replicaSetRec)
		if db.Error != nil {
			log.Info("DB FirstOrCreate Error! => " + db.Error.Error())
		}
	}
}

// deleteReplicaset is member of dbmanager package
func deleteReplicaset(db *gorm.DB, isAll bool, namespace string, name string) {
	if isAll == false && (len(name) == 0 || len(namespace) == 0) {
		log.Info("deleteReplicaset Error! => Namespace: " + namespace + ", Name: " + name)
		return
	}

	if isAll == true {
		db.Where("Namespace = ?", namespace).Delete(&TableReplicaset{})
		if db.Error != nil {
			log.Info("DB deleteCollectionReplicaset Error! => " + db.Error.Error())
		}
		return
	}

	db.Where("Namespace = ? AND Name = ?", namespace, name).Delete(&TableReplicaset{})
	if db.Error != nil {
		log.Info("DB deleteReplicaset Error! => " + db.Error.Error())
	}
}

// setStatefulSet is member of dbmanager package
func setStatefulSet(db *gorm.DB, data []byte) {
	if data == nil {
		return
	}

	var statefulSets []client.V1StatefulSet
	errUnmarshal := json.Unmarshal(data, &statefulSets)
	if errUnmarshal != nil {
		return
	}

	for _, statefulSet := range statefulSets {
		annotations, _ := json.Marshal(statefulSet.Metadata.Annotations)
		labels, _ := json.Marshal(statefulSet.Metadata.Labels)
		ownerReferences, _ := json.Marshal(statefulSet.Metadata.OwnerReferences)
		spec, _ := json.Marshal(statefulSet.Spec)
		status, _ := json.Marshal(statefulSet.Status)

		statefulSetRec := TableStatefulset{
			MetaData: MetaData{
				Annotations:       string(annotations),
				CreationTimestamp: statefulSet.Metadata.CreationTimestamp,
				DeletionTimestamp: statefulSet.Metadata.DeletionTimestamp,
				Generation:        statefulSet.Metadata.Generation,
				Labels:            string(labels),
				Name:              statefulSet.Metadata.Name,
				Namespace:         statefulSet.Metadata.Namespace,
				OwnerReferences:   string(ownerReferences),
				ResourceVersion:   statefulSet.Metadata.ResourceVersion,
				SelfLink:          statefulSet.Metadata.SelfLink,
				UID:               statefulSet.Metadata.Uid,
			},
			Spec:   string(spec),
			Status: string(status),
		}

		db.Where(TableStatefulset{MetaData: MetaData{Name: statefulSet.Metadata.Name}}).Assign(&statefulSetRec).FirstOrCreate(&statefulSetRec)
		if db.Error != nil {
			log.Info("DB FirstOrCreate Error! => " + db.Error.Error())
		}
	}
}

// deleteStatefulset is member of dbmanager package
func deleteStatefulset(db *gorm.DB, isAll bool, namespace string, name string) {
	if isAll == false && (len(name) == 0 || len(namespace) == 0) {
		log.Info("deleteStatefulset Error! => Namespace: " + namespace + ", Name: " + name)
		return
	}

	if isAll == true {
		db.Where("Namespace = ?", namespace).Delete(&TableStatefulset{})
		if db.Error != nil {
			log.Info("DB deleteCollectionStatefulset Error! => " + db.Error.Error())
		}
		return
	}

	db.Where("Namespace = ? AND Name = ?", namespace, name).Delete(&TableStatefulset{})
	if db.Error != nil {
		log.Info("DB deleteStatefulset Error! => " + db.Error.Error())
	}
}

// setHorizontalPodAutoscaler is member of dbmanager package
func setHorizontalPodAutoscaler(db *gorm.DB, data []byte) {
	if data == nil {
		return
	}

	var horizontalPodAutoscalers []client.V1HorizontalPodAutoscaler
	errUnmarshal := json.Unmarshal(data, &horizontalPodAutoscalers)
	if errUnmarshal != nil {
		return
	}

	for _, horizontalPodAutoscaler := range horizontalPodAutoscalers {
		annotations, _ := json.Marshal(horizontalPodAutoscaler.Metadata.Annotations)
		labels, _ := json.Marshal(horizontalPodAutoscaler.Metadata.Labels)
		ownerReferences, _ := json.Marshal(horizontalPodAutoscaler.Metadata.OwnerReferences)
		spec, _ := json.Marshal(horizontalPodAutoscaler.Spec)
		status, _ := json.Marshal(horizontalPodAutoscaler.Status)

		horizontalPodAutoscalerRec := TableHorizontalPodAutoscaler{
			MetaData: MetaData{
				Annotations:       string(annotations),
				CreationTimestamp: horizontalPodAutoscaler.Metadata.CreationTimestamp,
				DeletionTimestamp: horizontalPodAutoscaler.Metadata.DeletionTimestamp,
				Labels:            string(labels),
				Name:              horizontalPodAutoscaler.Metadata.Name,
				Namespace:         horizontalPodAutoscaler.Metadata.Namespace,
				OwnerReferences:   string(ownerReferences),
				ResourceVersion:   horizontalPodAutoscaler.Metadata.ResourceVersion,
				SelfLink:          horizontalPodAutoscaler.Metadata.SelfLink,
				UID:               horizontalPodAutoscaler.Metadata.Uid,
			},
			Spec:   string(spec),
			Status: string(status),
		}

		db.Where(TableHorizontalPodAutoscaler{MetaData: MetaData{Name: horizontalPodAutoscaler.Metadata.Name}}).Assign(&horizontalPodAutoscalerRec).FirstOrCreate(&horizontalPodAutoscalerRec)
		if db.Error != nil {
			log.Info("DB FirstOrCreate Error! => " + db.Error.Error())
		}
	}
}

// deleteHorizontalPodAutoscaler is member of dbmanager package
func deleteHorizontalPodAutoscaler(db *gorm.DB, isAll bool, namespace string, name string) {
	if isAll == false && (len(name) == 0 || len(namespace) == 0) {
		log.Info("deleteHorizontalPodAutoscaler Error! => Namespace: " + namespace + ", Name: " + name)
		return
	}

	if isAll == true {
		db.Where("Namespace = ?", namespace).Delete(&TableHorizontalPodAutoscaler{})
		if db.Error != nil {
			log.Info("DB deleteCollectionHorizontalPodAutoscaler Error! => " + db.Error.Error())
		}
		return
	}

	db.Where("Namespace = ? AND Name = ?", namespace, name).Delete(&TableHorizontalPodAutoscaler{})
	if db.Error != nil {
		log.Info("DB deleteHorizontalPodAutoscaler Error! => " + db.Error.Error())
	}
}

// setJob is member of dbmanager package
func setJob(db *gorm.DB, data []byte) {
	if data == nil {
		return
	}

	var jobs []client.V1Job
	errUnmarshal := json.Unmarshal(data, &jobs)
	if errUnmarshal != nil {
		return
	}

	for _, job := range jobs {
		annotations, _ := json.Marshal(job.Metadata.Annotations)
		labels, _ := json.Marshal(job.Metadata.Labels)
		ownerReferences, _ := json.Marshal(job.Metadata.OwnerReferences)
		spec, _ := json.Marshal(job.Spec)
		status, _ := json.Marshal(job.Status)

		jobRec := TableJob{
			MetaData: MetaData{
				Annotations:       string(annotations),
				CreationTimestamp: job.Metadata.CreationTimestamp,
				DeletionTimestamp: job.Metadata.DeletionTimestamp,
				Labels:            string(labels),
				Name:              job.Metadata.Name,
				Namespace:         job.Metadata.Namespace,
				OwnerReferences:   string(ownerReferences),
				ResourceVersion:   job.Metadata.ResourceVersion,
				SelfLink:          job.Metadata.SelfLink,
				UID:               job.Metadata.Uid,
			},
			Spec:   string(spec),
			Status: string(status),
		}

		db.Where(TableJob{MetaData: MetaData{Name: job.Metadata.Name}}).Assign(&jobRec).FirstOrCreate(&jobRec)
		if db.Error != nil {
			log.Info("DB FirstOrCreate Error! => " + db.Error.Error())
		}
	}
}

// deleteJob is member of dbmanager package
func deleteJob(db *gorm.DB, isAll bool, namespace string, name string) {
	if isAll == false && (len(name) == 0 || len(namespace) == 0) {
		log.Info("deleteJob Error! => Namespace: " + namespace + ", Name: " + name)
		return
	}

	if isAll == true {
		db.Where("Namespace = ?", namespace).Delete(&TableJob{})
		if db.Error != nil {
			log.Info("DB deleteCollectionJob Error! => " + db.Error.Error())
		}
		return
	}

	db.Where("Namespace = ? AND Name = ?", namespace, name).Delete(&TableJob{})
	if db.Error != nil {
		log.Info("DB deleteJob Error! => " + db.Error.Error())
	}
}

// setNetworkPolicy is member of dbmanager package
func setNetworkPolicy(db *gorm.DB, data []byte) {
	if data == nil {
		return
	}

	var networkPolicys []client.V1NetworkPolicy
	errUnmarshal := json.Unmarshal(data, &networkPolicys)
	if errUnmarshal != nil {
		return
	}

	for _, networkPolicy := range networkPolicys {
		annotations, _ := json.Marshal(networkPolicy.Metadata.Annotations)
		labels, _ := json.Marshal(networkPolicy.Metadata.Labels)
		ownerReferences, _ := json.Marshal(networkPolicy.Metadata.OwnerReferences)
		spec, _ := json.Marshal(networkPolicy.Spec)

		networkPolicyRec := TableNetworkPolicy{
			MetaData: MetaData{
				Annotations:       string(annotations),
				CreationTimestamp: networkPolicy.Metadata.CreationTimestamp,
				DeletionTimestamp: networkPolicy.Metadata.DeletionTimestamp,
				Labels:            string(labels),
				Name:              networkPolicy.Metadata.Name,
				Namespace:         networkPolicy.Metadata.Namespace,
				OwnerReferences:   string(ownerReferences),
				ResourceVersion:   networkPolicy.Metadata.ResourceVersion,
				SelfLink:          networkPolicy.Metadata.SelfLink,
				UID:               networkPolicy.Metadata.Uid,
			},
			Spec: string(spec),
		}

		db.Where(TableNetworkPolicy{MetaData: MetaData{Name: networkPolicy.Metadata.Name}}).Assign(&networkPolicyRec).FirstOrCreate(&networkPolicyRec)
		if db.Error != nil {
			log.Info("DB FirstOrCreate Error! => " + db.Error.Error())
		}
	}
}

// deleteNetworkPolicy is member of dbmanager package
func deleteNetworkPolicy(db *gorm.DB, isAll bool, namespace string, name string) {
	if isAll == false && (len(name) == 0 || len(namespace) == 0) {
		log.Info("deleteNetworkPolicy Error! => Namespace: " + namespace + ", Name: " + name)
		return
	}

	if isAll == true {
		db.Where("Namespace = ?", namespace).Delete(&TableNetworkPolicy{})
		if db.Error != nil {
			log.Info("DB deleteCollectionNetworkPolicy Error! => " + db.Error.Error())
		}
		return
	}

	db.Where("Namespace = ? AND Name = ?", namespace, name).Delete(&TableNetworkPolicy{})
	if db.Error != nil {
		log.Info("DB deleteNetworkPolicy Error! => " + db.Error.Error())
	}
}

// setStorageClass is member of dbmanager package
func setStorageClass(db *gorm.DB, data []byte) {
	if data == nil {
		return
	}

	var storageClasses []client.V1StorageClass
	errUnmarshal := json.Unmarshal(data, &storageClasses)
	if errUnmarshal != nil {
		return
	}

	for _, storageClass := range storageClasses {
		annotations, _ := json.Marshal(storageClass.Metadata.Annotations)
		labels, _ := json.Marshal(storageClass.Metadata.Labels)
		ownerReferences, _ := json.Marshal(storageClass.Metadata.OwnerReferences)
		mountOptions, _ := json.Marshal(storageClass.MountOptions)
		parameters, _ := json.Marshal(storageClass.Parameters)

		storageClassRec := TableStorageClass{
			AllowVolumeExpansion: storageClass.AllowVolumeExpansion,
			MetaData: MetaData{
				Annotations:       string(annotations),
				CreationTimestamp: storageClass.Metadata.CreationTimestamp,
				DeletionTimestamp: storageClass.Metadata.DeletionTimestamp,
				Labels:            string(labels),
				Name:              storageClass.Metadata.Name,
				Namespace:         storageClass.Metadata.Namespace,
				OwnerReferences:   string(ownerReferences),
				ResourceVersion:   storageClass.Metadata.ResourceVersion,
				SelfLink:          storageClass.Metadata.SelfLink,
				UID:               storageClass.Metadata.Uid,
			},
			MountOptions:      string(mountOptions),
			Parameters:        string(parameters),
			Provisioner:       storageClass.Provisioner,
			ReclaimPolicy:     storageClass.ReclaimPolicy,
			VolumeBindingMode: storageClass.VolumeBindingMode,
		}

		db.Where(TableStorageClass{MetaData: MetaData{Name: storageClass.Metadata.Name}}).Assign(&storageClassRec).FirstOrCreate(&storageClassRec)
		if db.Error != nil {
			log.Info("DB FirstOrCreate Error! => " + db.Error.Error())
		}
	}
}

// deleteStorageClass is member of dbmanager package
func deleteStorageClass(db *gorm.DB, isAll bool, _ string, name string) {
	if isAll == false && len(name) == 0 {
		log.Info("deleteStorageClass Error! => Name: " + name)
		return
	}

	if isAll == true {
		db.Delete(&TableStorageClass{})
		if db.Error != nil {
			log.Info("DB deleteCollectionStorageClass Error! => " + db.Error.Error())
		}
		return
	}

	db.Where("Name = ?", name).Delete(&TableStorageClass{})
	if db.Error != nil {
		log.Info("DB deleteStorageClass Error! => " + db.Error.Error())
	}
}

// setVolumeAttachment is member of dbmanager package
func setVolumeAttachment(db *gorm.DB, data []byte) {
	if data == nil {
		return
	}

	var volumeAttachments []client.V1beta1VolumeAttachment
	errUnmarshal := json.Unmarshal(data, &volumeAttachments)
	if errUnmarshal != nil {
		return
	}

	for _, volumeAttachment := range volumeAttachments {
		annotations, _ := json.Marshal(volumeAttachment.Metadata.Annotations)
		labels, _ := json.Marshal(volumeAttachment.Metadata.Labels)
		ownerReferences, _ := json.Marshal(volumeAttachment.Metadata.OwnerReferences)
		spec, _ := json.Marshal(volumeAttachment.Spec)
		status, _ := json.Marshal(volumeAttachment.Status)

		volumeAttachmentRec := TableVolumeAttachment{
			MetaData: MetaData{
				Annotations:       string(annotations),
				CreationTimestamp: volumeAttachment.Metadata.CreationTimestamp,
				DeletionTimestamp: volumeAttachment.Metadata.DeletionTimestamp,
				Labels:            string(labels),
				Name:              volumeAttachment.Metadata.Name,
				Namespace:         volumeAttachment.Metadata.Namespace,
				OwnerReferences:   string(ownerReferences),
				ResourceVersion:   volumeAttachment.Metadata.ResourceVersion,
				SelfLink:          volumeAttachment.Metadata.SelfLink,
				UID:               volumeAttachment.Metadata.Uid,
			},
			Spec:   string(spec),
			Status: string(status),
		}

		db.Where(TableVolumeAttachment{MetaData: MetaData{Name: volumeAttachment.Metadata.Name}}).Assign(&volumeAttachmentRec).FirstOrCreate(&volumeAttachmentRec)
		if db.Error != nil {
			log.Info("DB FirstOrCreate Error! => " + db.Error.Error())
		}
	}
}

// deleteVolumeAttachment is member of dbmanager package
func deleteVolumeAttachment(db *gorm.DB, isAll bool, _ string, name string) {
	if isAll == false && len(name) == 0 {
		log.Info("deleteVolumeAttachment Error! => Name: " + name)
		return
	}

	if isAll == true {
		db.Delete(&TableVolumeAttachment{})
		if db.Error != nil {
			log.Info("DB deleteVolumeAttachment Error! => " + db.Error.Error())
		}
		return
	}

	db.Where("Name = ?", name).Delete(&TableVolumeAttachment{})
	if db.Error != nil {
		log.Info("DB deleteVolumeAttachment Error! => " + db.Error.Error())
	}
}

// SetAlertMsgDB is member of dbmanager package
func SetAlertMsgDB(alert Alert) {
	db, err := gorm.Open("mysql", connectionString)
	if err != nil {
		log.Info("DB Open Error - ", err.Error())
		return
	}
	defer db.Close()

	layout := "2006-01-02T15:04:05.000000000Z"
	startDateTime, _ := time.Parse(layout, alert.StartsAt)
	endDateTime, _ := time.Parse(layout, alert.EndsAt)

	tableAlertMessage := TableAlertMessage{
		Status:       alert.Status,
		Alertname:    alert.Labels.Alertname,
		Container:    alert.Labels.Container,
		Deployment:   alert.Labels.Deployment,
		Endpoint:     alert.Labels.Endpoint,
		Instance:     alert.Labels.Instance,
		Job:          alert.Labels.Job,
		Namespace:    alert.Labels.Namespace,
		Pod:          alert.Labels.Pod,
		Prometheus:   alert.Labels.Prometheus,
		Service:      alert.Labels.Service,
		Severity:     alert.Labels.Severity,
		Message:      alert.Annotations.Message,
		RunbookURL:   alert.Annotations.RunbookURL,
		StartsAt:     startDateTime,
		EndsAt:       endDateTime,
		GeneratorURL: alert.GeneratorURL,
		Fingerprint:  alert.Fingerprint,
	}

	db.Create(&tableAlertMessage)
	if db.Error != nil {
		log.Info("DB Create Error! => " + db.Error.Error())
	}
}

// isOkResponse is member of dbmanager package
func isOkResponse(code string) bool {
	if codeInt, errConv := strconv.Atoi(code); errConv == nil {
		if /*http.StatusOK*/ 200 <= codeInt && codeInt <= 202 /*http.StatusAccepted*/ {
			return true
		}
	}

	return false
}

// Login ...
func Login(user *RequestUser) *ResponseUser {
	db, err := gorm.Open("mysql", connectionString)
	if err != nil {
		log.Info("DB Open Error - ", err.Error())
		return nil
	}
	defer db.Close()
	valid := ResponseUser{}
	finded := db.Table("TableUser").Select("id, username").Where("username = ? AND password = ?", user.Username, user.Password).First(&valid)
	if finded.Error != nil {
		return nil
	}
	return &valid
}
