package client

import (
	"flag"
	"fmt"
	"os"
	"path/filepath"

	"k8s.io/client-go/kubernetes"
	"k8s.io/client-go/rest"
	"k8s.io/client-go/tools/clientcmd"
	"k8s.io/client-go/util/homedir"

	// "k8s.io/client-go/rest"

	"github.com/labstack/gommon/log"
	"github.com/spf13/viper"
)

var client *kubernetes.Clientset

// SetConfig ...
func SetConfig() error {
	var err error
	if viper.GetBool("enable.defaultkubeconfig") == true {
		config, err := rest.InClusterConfig()
		if err != nil {
			panic(err.Error())
		}
		client, err = kubernetes.NewForConfig(config)
		if err != nil {
			panic(err.Error())
		}
	} else {
		path := fmt.Sprintf("%s/%s", os.Getenv("HOME"), ".kube/config")
		log.Debug("Load from : ", path)
		if client, err = loadKubeConfig(); err != nil {
			log.Debug("Load Kube Config Error : ", err)
			return err
		}
	}

	return nil
}

func loadKubeConfig() (*kubernetes.Clientset, error) {
	var kubeconfig *string
	if home := homedir.HomeDir(); home != "" {
		kubeconfig = flag.String("kubeconfig", filepath.Join(home, ".kube", "config"), "(optional) absolute path to the kubeconfig file")
	} else {
		kubeconfig = flag.String("kubeconfig", "", "absolute path to the kubeconfig file")
	}
	flag.Parse()

	config, err := clientcmd.BuildConfigFromFlags("", *kubeconfig)
	if err != nil {
		panic(err)
	}

	clientset, err := kubernetes.NewForConfig(config)
	if err != nil {
		panic(err)
	}

	return clientset, nil
}

// GetKubeClient ...
func GetKubeClient() *kubernetes.Clientset {
	return client
}
