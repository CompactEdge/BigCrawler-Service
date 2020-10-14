package util

import (
	"flag"
	"fmt"
	"os"

	"github.com/labstack/gommon/log"

	"github.com/spf13/viper"
)

var (
	configPath string
	configName = "ce-broker.yaml"
)

// Cli ...
type Cli struct {
	Version bool
	Debug   bool
	Profile string
}

// Parse cmd flags, validates them and performs some initializations
func (c *Cli) Parse() *Cli {
	flag.BoolVar(&c.Version, "version", false, "version check")
	flag.BoolVar(&c.Debug, "debug", false, "enable debug mode")
	flag.StringVar(&c.Profile, "profile", "", "define a profile")
	flag.Parse()

	if c.Profile == "server" {
		configPath = "/conf/"
	}
	if c.Profile == "dev" || c.Profile == "" {
		c.Profile = "dev"
		configPath = "./config/"
	}
	log.Debug("Debug level")
	viper.AddConfigPath(configPath)
	viper.SetConfigName(configName)
	viper.SetConfigType("yaml")
	if err := viper.ReadInConfig(); err != nil {
		if _, ok := err.(viper.ConfigFileNotFoundError); ok {
			log.Printf("Config file not found: %v\n", err)
		} else {
			log.Printf("Couldn't load config file: %v\n", err)
		}
		os.Exit(1)
	}

	if c.Version {
		printVersion(c)
		os.Exit(1)
	}

	printVersion(c)
	return c
}

// printVersion is member of main package
func printVersion(c *Cli) {
	var (
		name    = fmt.Sprint("CE-BROKER")
		profile = fmt.Sprintf("Profile : %s", c.Profile)
		config  = fmt.Sprintf("Config : %s", configPath+configName)
		version string
	)
	// if c.Debug == true {
	// 	name = fmt.Sprint("CE-BROKER (Debug mode)")
	// 	profile = fmt.Sprintf("Profile   : %s", c.Profile)
	// 	config = fmt.Sprintf("Config    : %s", configPath+configName)
	// } else {
	// 	name = fmt.Sprint("CE-BROKER")
	// }
	version = fmt.Sprintf("%s", viper.GetString("broker.version"))
	log.Infof("%s:%s, %s, %s", name, version, profile, config)
}
