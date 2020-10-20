package db

import (
	"fmt"
	"time"

	"github.com/labstack/gommon/log"

	. "github.com/compactedge/cewizontech/ce-broker/pkg/model"

	_ "github.com/go-sql-driver/mysql"
	"github.com/jinzhu/gorm"

	// TODO: migrate to "k8s.io/client-go/kubernetes"

	// prom "github.com/prometheus/client_golang/api"
	// apiv1 "github.com/prometheus/client_golang/api/prometheus/v1"
	"github.com/spf13/viper"
)

// connectionString ...
var connectionString string

// SetConfig ...
func SetConfig() {
	connectionString = fmt.Sprintf("%s:%s@tcp(%s:%s)/%s?allowNativePasswords=true&parseTime=true", viper.GetString("mariadb.username"), viper.GetString("mariadb.password"), viper.GetString("mariadb.host"), viper.GetString("mariadb.port"), viper.GetString("mariadb.dbname"))
	log.Debug(connectionString)
	go initDB()
}

// initDB ...
func initDB() {
	log.Debug("Call initDB()")
	db, _ := connectToMariaDB(connectionString)
	defer db.Close()

	log.Debug("Connected to MariaDB : " + viper.GetString("mariadb.host") + ":" + viper.GetString("mariadb.port") + " - " + viper.GetString("mariadb.dbname"))

	db.Table("TableUser").AutoMigrate(&RequestUser{})
}

func connectToMariaDB(uri string) (*gorm.DB, error) {
	var db *gorm.DB
	var err error

	for {
		log.Debug("uri :", uri)
		db, err = gorm.Open("mysql", uri)
		if err == nil {
			break
		}

		log.Debug(err)
		url := fmt.Sprintf("tcp(%s:%s)/%s", viper.GetString("mariadb.host"), viper.GetString("mariadb.port"), viper.GetString("mariadb.dbname"))
		log.Info("Trying reconnect to MariaDB :", url)
		time.Sleep(1 * time.Minute)
	}

	return db, err
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
