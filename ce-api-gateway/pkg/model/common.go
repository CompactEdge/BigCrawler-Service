package model

import (
	"encoding/json"
	"time"

	"github.com/dgrijalva/jwt-go"
	"github.com/jinzhu/gorm"
)

// RequestAuth ...
type RequestAuth struct {
	Auth Auth `json:"auth"`
}

// Auth ...
type Auth struct {
	Identity Identity `json:"identity"`
}

// Identity ...
type Identity struct {
	User RequestUser `json:"user"`
}

// RequestUser ...
type RequestUser struct {
	gorm.Model
	Username string `json:"username" gorm:"username"`
	Password string `json:"password" gorm:"password"`
}

// ResponseToken ...
type ResponseToken struct {
	ExpiresAt int64        `json:"expires_at"` // exp
	IssuedAt  int64        `json:"issued_at"`  // iat
	User      ResponseUser `json:"user"`
	jwt.StandardClaims
}

// ResponseUser ...
type ResponseUser struct {
	ID       string `json:"id" gorm:"id"`
	Username string `json:"name" gorm:"username"`
}

// NodeCondition is member of dbmanager package.
type NodeCondition struct {
	LastHeartbeatTime  string `json:"lastHeartbeatTime,omitempty"`
	LastTransitionTime string `json:"lastTransitionTime,omitempty"`
	Message            string `json:"message,omitempty"`
	Reason             string `json:"reason,omitempty"`
	Status             string `json:"status,omitempty"`
	Type               string `json:"type,omitempty"`
}

// NodeAllocatable is member of dbmanager package.
type NodeAllocatable struct {
	CPU              string `json:"cpu,omitempty"`
	EphemeralStorage string `json:"ephemeral-storage,omitempty"`
	Hugepages1Gi     string `json:"hugepages-1Gi,omitempty"`
	Hugepages2Mi     string `json:"hugepages-2Mi,omitempty"`
	Memory           string `json:"memory,omitempty"`
	Pods             string `json:"pods,omitempty"`
}

// Metric is member of dbmanager package.
type Metric struct {
	Container        string `json:"container"`
	CreatedByKind    string `json:"created_by_kind"`
	CreatedByName    string `json:"created_by_name"`
	Configmap        string `json:"configmap"`
	Endpoint         string `json:"endpoint"`
	Handler          string `json:"handler"`
	HostIP           string `json:"host_ip"`
	Instance         string `json:"instance"`
	Job              string `json:"job"`
	Name             string `json:"__name__"`
	Namespace        string `json:"namespace"`
	Node             string `json:"node"`
	Operation        string `json:"operation"`
	OperationType    string `json:"operation_type"`
	PersistentVolume string `json:"persistentvolume"`
	Phase            string `json:"phase"`
	Pod              string `json:"pod"`
	PodIP            string `json:"pod_ip"`
	PriorityClass    string `json:"priority_class"`
	Quantile         string `json:"quantile"`
	Resource         string `json:"resource"`
	ResourceName     string `json:"resource_name"`
	Role             string `json:"role"`
	Server           string `json:"server"`
	Service          string `json:"service"`
	Type             string `json:"type"`
	UID              string `json:"uid"`
	Version          string `json:"version"`
	Zone             string `json:"zone"`
}

// StreamData is member of dbmanager package.
type StreamData struct {
	Metric Metric          `json:"metric"`
	Values json.RawMessage `json:"value"`
}

// AlertLabel is member of dbmanager package.
type AlertLabel struct {
	Alertname  string `json:"alertname"`
	Container  string `json:"container"`
	Deployment string `json:"deployment"`
	Endpoint   string `json:"endpoint"`
	Instance   string `json:"instance"`
	Job        string `json:"job"`
	Namespace  string `json:"namespace"`
	Pod        string `json:"pod"`
	Prometheus string `json:"prometheus"`
	Service    string `json:"service"`
	Severity   string `json:"severity"`
}

// AlertAnnotation is member of dbmanager package.
type AlertAnnotation struct {
	Message    string `json:"message"`
	RunbookURL string `json:"runbook_url"`
}

// Alert is member of dbmanager package.
type Alert struct {
	Status       string          `json:"status"`
	Labels       AlertLabel      `json:"labels"`
	Annotations  AlertAnnotation `json:"annotations"`
	StartsAt     string          `json:"startsAt"`
	EndsAt       string          `json:"endsAt"`
	GeneratorURL string          `json:"generatorURL"`
	Fingerprint  string          `json:"fingerprint"`
}

// GroupLabels is member of dbmanager package.
type GroupLabels struct {
	Alertname string `json:"alertname"`
}

// AlertData is member of dbmanager package
type AlertData struct {
	Receiver          string          `json:"receiver"`
	Status            string          `json:"status"`
	Alerts            []Alert         `json:"alerts"`
	GroupLabels       GroupLabels     `json:"groupLabels"`
	CommonLabels      AlertLabel      `json:"commonLabels"`
	CommonAnnotations AlertAnnotation `json:"commonAnnotations"`
	ExternalURL       string          `json:"externalURL"`
	Version           string          `json:"version"`
	GroupKey          string          `json:"groupKey"`
}

// -------------------------------------------------------
// DB Data Structure
// -------------------------------------------------------

// TableResource is member of dbmanager package.
type TableResource struct {
	ID           uint   `gorm:"column:ID;primary_key"`
	Categories   string `gorm:"column:Categories;type:text"`
	Group        string `gorm:"column:Group"`
	Kind         string `gorm:"column:Kind;not null"`
	Name         string `gorm:"column:Name;not null"`
	Namespaced   bool   `gorm:"column:Namespaced;default:false"`
	ShortNames   string `gorm:"column:ShortNames;type:text"`
	SingularName string `gorm:"column:SingularName"`
	Verbs        string `gorm:"column:Verbs;type:text"`
}

// TableName is member of dbmanager package.
func (TableResource) TableName() string {
	return "TableResource"
}

// MetaData is member of dbmanager package
type MetaData struct {
	Annotations       string    `gorm:"column:Annotations;type:text"`
	CreationTimestamp time.Time `gorm:"column:CreationTimestamp;type:datetime;default:null"`
	DeletionTimestamp time.Time `gorm:"column:DeletionTimestamp;type:datetime;default:null"`
	Finalizers        string    `gorm:"column:Finalizers;type:text"`
	Generation        int64     `gorm:"column:Generation"`
	GenerateName      string    `gorm:"column:GenerateName"`
	Labels            string    `gorm:"column:Labels;type:text"`
	Name              string    `gorm:"column:Name"`
	Namespace         string    `gorm:"column:Namespace"`
	OwnerReferences   string    `gorm:"column:OwnerReferences;type:text"`
	ResourceVersion   string    `gorm:"column:ResourceVersion"`
	SelfLink          string    `gorm:"column:SelfLink"`
	UID               string    `gorm:"column:UID"`
}

// TableNode is member of dbmanager package.
type TableNode struct {
	ID                uint `gorm:"column:ID;primary_key"`
	MetaData          `gorm:"extends"`
	Spec              string    `gorm:"column:Spec;type:text"`
	Status            string    `gorm:"column:Status;type:text"`
	InternalIP        string    `gorm:"column:InternalIP"`
	CapacityCPU       string    `gorm:"column:CapacityCPU"`
	CapacityMEM       string    `gorm:"column:CapacityMEM"`
	AllocatableCPU    string    `gorm:"column:AllocatableCPU"`
	AllocatableMEM    string    `gorm:"column:AllocatableMEM"`
	AllocatedReqCPU   string    `gorm:"column:AllocatedReqCPU"`
	AllocatedReqMem   string    `gorm:"column:AllocatedReqMem"`
	AllocatedLimitCPU string    `gorm:"column:AllocatedLimitCPU"`
	AllocatedLimitMem string    `gorm:"column:AllocatedLimitMem"`
	UpdateTimestamp   time.Time `gorm:"column:UpdateTimestamp;type:datetime;default:null"`
	AvailableCPU      string    `gorm:"column:AvailableCPU"`
	AvailableMem      string    `gorm:"column:AvailableMem"`
}

// TableName is member of dbmanager package.
func (TableNode) TableName() string {
	return "TableNode"
}

// TableConfigMap is member of dbmanager package
type TableConfigMap struct {
	ID       uint   `gorm:"column:ID;primary_key"`
	Data     string `gorm:"column:Data;type:text"`
	MetaData `gorm:"extends"`
}

// TableName is member of dbmanager package.
func (TableConfigMap) TableName() string {
	return "TableConfigMap"
}

// TableComponentStatus is member of dbmanager package
type TableComponentStatus struct {
	ID         uint   `gorm:"column:ID;primary_key"`
	Conditions string `gorm:"column:Conditions;type:text"`
	MetaData   `gorm:"extends"`
}

// TableName is member of dbmanager package.
func (TableComponentStatus) TableName() string {
	return "TableComponentStatus"
}

// TableEvent is member of dbmanager package
type TableEvent struct {
	ID             uint      `gorm:"column:ID;primary_key"`
	Count          int32     `gorm:"column:Count"`
	EventTime      time.Time `gorm:"column:EventTime;type:datetime;default:null"`
	FirstTimestamp time.Time `gorm:"column:FirstTimestamp;type:datetime;default:null"`
	InvolvedObject string    `gorm:"column:InvolvedObject;type:text"`
	LastTimestamp  time.Time `gorm:"column:LastTimestamp;type:datetime;default:null"`
	Message        string    `gorm:"column:Message"`
	MetaData       `gorm:"extends"`
	Reason         string `gorm:"column:Reason"`
	Source         string `gorm:"column:Source;type:text"`
	Type           string `gorm:"column:Type"`
}

// TableName is member of dbmanager package.
func (TableEvent) TableName() string {
	return "TableEvent"
}

// TableNamespace is member of dbmanager package.
type TableNamespace struct {
	ID       uint `gorm:"column:ID;primary_key"`
	MetaData `gorm:"extends"`
	Spec     string `gorm:"column:spec;type:text"`
	Status   string `gorm:"column:status;type:text"`
}

// TableName is member of dbmanager package.
func (TableNamespace) TableName() string {
	return "TableNamespace"
}

// TablePersistentVolumeClaim is member of dbmanager package.
type TablePersistentVolumeClaim struct {
	ID       uint `gorm:"column:ID;primary_key"`
	MetaData `gorm:"extends"`
	Spec     string `gorm:"column:Spec;type:text"`
	Status   string `gorm:"column:Status;type:text"`
}

// TableName is member of dbmanager package.
func (TablePersistentVolumeClaim) TableName() string {
	return "TablePersistentVolumeClaim"
}

// TablePod is member of dbmanager package.
type TablePod struct {
	ID       uint `gorm:"column:ID;primary_key"`
	MetaData `gorm:"extends"`
	Spec     string `gorm:"column:Spec;type:text"`
	Status   string `gorm:"column:Status;type:text"`
}

// TableName is member of dbmanager package.
func (TablePod) TableName() string {
	return "TablePod"
}

// TableReplicationController is member of dbmanager package.
type TableReplicationController struct {
	ID       uint `gorm:"column:ID;primary_key"`
	MetaData `gorm:"extends"`
	Spec     string `gorm:"column:Spec;type:text"`
	Status   string `gorm:"column:Status;type:text"`
}

// TableName is member of dbmanager package.
func (TableReplicationController) TableName() string {
	return "TableReplicationController"
}

// TableSecret is member of dbmanager package.
type TableSecret struct {
	ID       uint   `gorm:"column:ID;primary_key"`
	Data     string `gorm:"column:Data;type:text"`
	MetaData `gorm:"extends"`
	Type     string `gorm:"column:Type"`
}

// TableName is member of dbmanager package.
func (TableSecret) TableName() string {
	return "TableSecret"
}

// TableService is member of dbmanager package.
type TableService struct {
	ID       uint `gorm:"column:ID;primary_key"`
	MetaData `gorm:"extends"`
	Spec     string `gorm:"column:Spec;type:text"`
	Status   string `gorm:"column:Status;type:text"`
}

// TableName is member of dbmanager package.
func (TableService) TableName() string {
	return "TableService"
}

// TableServiceAccount is member of dbmanager package.
type TableServiceAccount struct {
	ID       uint `gorm:"column:ID;primary_key"`
	MetaData `gorm:"extends"`
	Secrets  string `gorm:"column:Secrets;type:text"`
}

// TableName is member of dbmanager package.
func (TableServiceAccount) TableName() string {
	return "TableServiceAccount"
}

// TableLimitRange is member of dbmanager package.
type TableLimitRange struct {
	ID       uint `gorm:"column:ID;primary_key"`
	MetaData `gorm:"extends"`
	Spec     string `gorm:"column:Spec;type:text"`
}

// TableName is member of dbmanager package.
func (TableLimitRange) TableName() string {
	return "TableLimitRange"
}

// TableResourceQuota is member of dbmanager package.
type TableResourceQuota struct {
	ID       uint `gorm:"column:ID;primary_key"`
	MetaData `gorm:"extends"`
	Spec     string `gorm:"column:Spec;type:text"`
	Status   string `gorm:"column:Status;type:text"`
}

// TableName is member of dbmanager package.
func (TableResourceQuota) TableName() string {
	return "TableResourceQuota"
}

// TablePersistentVolume is member of dbmanager package.
type TablePersistentVolume struct {
	ID       uint `gorm:"column:ID;primary_key"`
	MetaData `gorm:"extends"`
	Spec     string `gorm:"column:Spec;type:text"`
	Status   string `gorm:"column:Status;type:text"`
}

// TableName is member of dbmanager package.
func (TablePersistentVolume) TableName() string {
	return "TablePersistentVolume"
}

// TableControllerRevision is member of dbmanager package.
type TableControllerRevision struct {
	ID       uint   `gorm:"column:ID;primary_key"`
	Data     string `gorm:"column:Data;type:text"`
	MetaData `gorm:"extends"`
	Revision int64 `gorm:"column:Revision"`
}

// TableName is member of dbmanager package.
func (TableControllerRevision) TableName() string {
	return "TableControllerRevision"
}

// TableDaemonset is member of dbmanager package.
type TableDaemonset struct {
	ID       uint `gorm:"column:ID;primary_key"`
	MetaData `gorm:"extends"`
	Spec     string `gorm:"column:Spec;type:text"`
	Status   string `gorm:"column:Status;type:text"`
}

// TableName is member of dbmanager package.
func (TableDaemonset) TableName() string {
	return "TableDaemonset"
}

// TableDeployment is member of dbmanager package.
type TableDeployment struct {
	ID       uint `gorm:"column:ID;primary_key"`
	MetaData `gorm:"extends"`
	Spec     string `gorm:"column:Spec;type:text"`
	Status   string `gorm:"column:Status;type:text"`
}

// TableName is member of dbmanager package.
func (TableDeployment) TableName() string {
	return "TableDeployment"
}

// TableReplicaset is member of dbmanager package.
type TableReplicaset struct {
	ID       uint `gorm:"column:ID;primary_key"`
	MetaData `gorm:"extends"`
	Spec     string `gorm:"column:Spec;type:text"`
	Status   string `gorm:"column:Status;type:text"`
}

// TableName is member of dbmanager package.
func (TableReplicaset) TableName() string {
	return "TableReplicaset"
}

// TableStatefulset is member of dbmanager package.
type TableStatefulset struct {
	ID       uint `gorm:"column:ID;primary_key"`
	MetaData `gorm:"extends"`
	Spec     string `gorm:"column:Spec;type:text"`
	Status   string `gorm:"column:Status;type:text"`
}

// TableName is member of dbmanager package.
func (TableStatefulset) TableName() string {
	return "TableStatefulset"
}

// TableHorizontalPodAutoscaler is member of dbmanager package.
type TableHorizontalPodAutoscaler struct {
	ID       uint `gorm:"column:ID;primary_key"`
	MetaData `gorm:"extends"`
	Spec     string `gorm:"column:Spec;type:text"`
	Status   string `gorm:"column:Status;type:text"`
}

// TableName is member of dbmanager package.
func (TableHorizontalPodAutoscaler) TableName() string {
	return "TableHorizontalPodAutoscaler"
}

// TableJob is member of dbmanager package.
type TableJob struct {
	ID       uint `gorm:"column:ID;primary_key"`
	MetaData `gorm:"extends"`
	Spec     string `gorm:"column:Spec;type:text"`
	Status   string `gorm:"column:Status;type:text"`
}

// TableName is member of dbmanager package.
func (TableJob) TableName() string {
	return "TableJob"
}

// TableNetworkPolicy is member of dbmanager package.
type TableNetworkPolicy struct {
	ID       uint `gorm:"column:ID;primary_key"`
	MetaData `gorm:"extends"`
	Spec     string `gorm:"column:Spec;type:text"`
}

// TableName is member of dbmanager package.
func (TableNetworkPolicy) TableName() string {
	return "TableNetworkPolicy"
}

// TableStorageClass is member of dbmanager package.
type TableStorageClass struct {
	ID                   uint `gorm:"column:ID;primary_key"`
	AllowVolumeExpansion bool `gorm:"column:AllowVolumeExpansion;default:false"`
	MetaData             `gorm:"extends"`
	MountOptions         string `gorm:"column:MountOptions;type:text"`
	Parameters           string `gorm:"column:Parameters;type:text"`
	Provisioner          string `gorm:"column:Provisioner"`
	ReclaimPolicy        string `gorm:"column:ReclaimPolicy"`
	VolumeBindingMode    string `gorm:"column:VolumeBindingMode"`
}

// TableName is member of dbmanager package.
func (TableStorageClass) TableName() string {
	return "TableStorageClass"
}

// TableVolumeAttachment is member of dbmanager package.
type TableVolumeAttachment struct {
	ID       uint `gorm:"column:ID;primary_key"`
	MetaData `gorm:"extends"`
	Spec     string `gorm:"column:Spec;type:text"`
	Status   string `gorm:"column:Status;type:text"`
}

// TableName is member of dbmanager package.
func (TableVolumeAttachment) TableName() string {
	return "TableVolumeAttachment"
}

// TableAlertMessage is member of dbmanager package.
type TableAlertMessage struct {
	ID           uint      `gorm:"column:ID;primary_key"`
	Status       string    `gorm:"column:Status"`
	Alertname    string    `gorm:"column:Alertname"`
	Container    string    `gorm:"column:Container"`
	Deployment   string    `gorm:"column:Deployment"`
	Endpoint     string    `gorm:"column:Endpoint"`
	Instance     string    `gorm:"column:Instance"`
	Job          string    `gorm:"column:Job"`
	Namespace    string    `gorm:"column:Namespace"`
	Pod          string    `gorm:"column:Pod"`
	Prometheus   string    `gorm:"column:Prometheus"`
	Service      string    `gorm:"column:Service"`
	Severity     string    `gorm:"column:Severity"`
	Message      string    `gorm:"column:Message;type:text"`
	RunbookURL   string    `gorm:"column:RunbookURL"`
	StartsAt     time.Time `gorm:"column:StartsAt;type:datetime;default:null"`
	EndsAt       time.Time `gorm:"column:EndsAt;type:datetime;default:null"`
	GeneratorURL string    `gorm:"column:GeneratorURL;type:text"`
	Fingerprint  string    `gorm:"column:Fingerprint"`
}

// TableName is member of dbmanager package.
func (TableAlertMessage) TableName() string {
	return "TableAlertMessage"
}
