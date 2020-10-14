package util

import (
	"flag"
	"fmt"

	"github.com/labstack/gommon/log"
	"github.com/spf13/viper"
)

var (
	configPath string
	configName     = "ce-vim.yaml"
	// userLicense string
	// rootCmd = &cobra.Command{
	// 	Use:   "root",
	// 	Short: "Root short description",
	// 	Long:  "Root long description",
	// 	Run:   emptyRun,
	// }
)

// Cli ...
type Cli struct {
	Version bool
	Debug bool
	Profile string
}

// func emptyRun(*cobra.Command, []string) {}

// func init() {
// 	cobra.OnInitialize(initConfig)
// 	// rootCmd.PersistentFlags().StringVar(&cfgFile, "config", "", "config file (default is $HOME/ce-vim.yaml)")
// 	// rootCmd.PersistentFlags().StringP("author", "a", "compact-edge", "author name for copyright attribution")
// 	// rootCmd.PersistentFlags().StringVarP(&userLicense, "license", "l", "", "name of license for the project")
// 	// rootCmd.PersistentFlags().Bool("viper", true, "use Viper for configuration")
// 	// viper.BindPFlag("author", rootCmd.PersistentFlags().Lookup("author"))
// 	// viper.BindPFlag("useViper", rootCmd.PersistentFlags().Lookup("viper"))
// 	viper.SetDefault("author", "compact-edge")
// 	viper.SetDefault("license", "")
// 	rootCmd.Flags().StringP("config", "c", "", "test")

// 	// rootCmd.AddCommand(&cobra.Command{
// 	// 	Use: "config",
// 	// 	Args: cobra.MinimumNArgs(1),
//   //   Run: func(cmd *cobra.Command, args []string) {
//   //     fmt.Println("Echo: " + strings.Join(args, " "))
//   //   },
// 	// })
// 	// rootCmd.AddCommand(&cobra.Command{
// 	// 	Use: "profile",
// 	// 	Args: cobra.MinimumNArgs(1),
//   //   Run: func(cmd *cobra.Command, args []string) {
//   //     fmt.Println("Echo: " + strings.Join(args, " "))
//   //   },
// 	// })
// 	rootCmd.Execute()
// }

// Parse ...
func (c *Cli) Parse() {
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

	viper.AddConfigPath(configPath)
	viper.SetConfigName(configName)
	viper.SetConfigType("yaml")
	if err := viper.ReadInConfig(); err != nil {
		if _, ok := err.(viper.ConfigFileNotFoundError); ok {
			log.Printf("Config file not found: %v\n", err)
		} else {
			log.Printf("Couldn't load config file: %v\n", err)
		}
		panic(err.Error())
	}

	viper.AutomaticEnv()

	if err := viper.ReadInConfig(); err == nil {
		fmt.Println("Using config file:", viper.ConfigFileUsed())
	}
}